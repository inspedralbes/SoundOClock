<template>
    <div class="w-full flex justify-center text-white">
        <div class="relative flex w-[95%] h-[100px] bg-gray-200 overflow-hidden rounded-lg border"
            :class="{ 'mt-4': type !== 'admin', 'border-yellow-300': isFirstPlace || isNext }">
            <UBadge color="yellow" variant="solid" v-if="isNext" class="absolute z-10 bottom-0 end-0">
                Següent
            </UBadge>
            <img class="w-full h-auto object-cover object-center brightness-50"
                :class="{ 'opacity-100': type === 'admin' && isSelected, 'opacity-75': type === 'admin' && !isSelected }"
                :src="track.album ? track.album.images[0].url : track.img" :alt="track.name + '_img'">

            <div class="absolute inset-0 flex flex-row justify-center faded-background">
                <div class="flex flex-row w-full justify-between p-2 items-center">
                    <div class="flex flex-col w-[70%] overflow-hidden items-start marquee-container">
                        <p class="font-bold text-base bg-opacity-60 uppercase overflow-hidden whitespace-nowrap"
                            :class="{ 'text-marquee': isOverflowing('title') }">
                            {{ track.name }}
                        </p>
                        <div class="flex items-center gap-2 text-sm marquee-container">
                            <UBadge v-if="track.explicit" color="gray">E</UBadge>
                            <span class="overflow-hidden whitespace-nowrap text-ellipsis" v-if="artistList"
                                :class="{ 'text-marquee': isOverflowing('artist') }">
                                {{ artistList }}
                            </span>
                        </div>
                        <p v-if="type === 'vote'" class="text-sm">Vots: {{ track.totalVotes }}
                        </p>
                        <p v-if="type === 'admin' || type === 'ranking'" class="text-sm">Vots: {{ track.votes }}</p>
                        <UBadge color="indigo" variant="soft" v-if="type === 'selected'">{{ getBellHour(bellId) }}
                        </UBadge>
                    </div>
                    <button @click="playTrack(track)">
                        <span v-if="currentTrackId === track.id && isPlaying" class="material-symbols-rounded text-4xl">
                            pause
                        </span>
                        <span v-else class="material-symbols-rounded text-4xl">
                            play_arrow
                        </span>
                    </button>
                    <button v-if="type === 'vote'" @click="report(track)">
                        <span class="material-symbols-rounded text-4xl"
                            :class="{ 'text-red-400': isSongReported(track.id) }">
                            report
                        </span>
                    </button>
                    <button @click="proposeSong(track)"
                        v-if="type === 'propose' && (!track.loading && !track.proposed)">
                        <span class="material-symbols-rounded text-4xl">
                            add_circle
                        </span>
                    </button>
                    <div v-if="track.loading || (isLoadingVote.state && isLoadingVote.selectedSong == track.id)"
                        class="loader-track"></div>
                    <span v-if="track.proposed" class="material-symbols-rounded text-4xl">
                        task_alt
                    </span>
                    <button v-if="type === 'vote' && !(isLoadingVote.state && isLoadingVote.selectedSong == track.id)"
                        @click="vote(track.id)">
                        <span
                            :class="{ 'material-symbols-rounded text-4xl': true, 'text-blue-500': isSongVoted(track.id) }">
                            thumb_up
                        </span>
                    </button>
                    <div v-if="type === 'admin'" class="mx-2">
                        <input type="checkbox" name="selected" id="selected" :checked="isSelected"
                            @change="e => setSelected(e, bell.id, track.id)" class="h-6 w-6">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';

export default {
    props: {
        track: {
            type: Object,
            required: true
        },
        currentTrackId: {
            type: String,
        },
        isPlaying: {
            type: Boolean,
        },
        type: {
            type: String,
            default: 'propose'
        },
        bell: {
            type: Object,
            default: null
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        isFirstPlace: {
            type: Boolean,
            default: false
        },
        bellId: {
            type: String,
            default: null
        },
        isNext: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            store: useAppStore(),
            isLoadingVote: computed(() => this.store.isLoadingVote),
            userSelectedSongs: computed(() => this.store.userSelectedSongs),
            userReportedSongs: computed(() => this.store.userReportedSongs),
            bells: computed(() => this.store.bells),
        }
    },
    methods: {
        playTrack(track) {
            this.$emit('play', track);
        },
        proposeSong(track) {
            this.$emit('propose', track);
        },
        vote(songId) {
            this.$emit('vote', songId);
        },
        report(track) {
            this.$emit('report', track);
        },
        isSongVoted(songId) {
            if (this.userSelectedSongs && this.userSelectedSongs.votedSongs && this.userSelectedSongs.votedSongs.includes(songId)) {
                return true;
            } else {
                return false;
            }
        },
        isSongReported(songId) {
            // Check if the songId is in userReportedSongs.songId
            return this.userReportedSongs.some(song => song.songId === songId);
        },
        setSelected(e, bellId, songId) {
            // Prevent the checkbox from being checked
            e.target.checked = false;
            // Then emit the event
            this.$emit('setSelected', bellId, songId);
        },
        isOverflowing(type) {
            if (type === 'title') {
                return this.track.name.length > 25;
            } else if (type === 'artist') {
                return this.artistList.length > 30;
            }
        },
        getBellHour(bellId) {
            const bell = this.bells.find(bell => bell.id === bellId);

            // Assuming the time is in HH:MM:SS format and for today's date
            const [hours, minutes, seconds] = bell.hour.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10));

            // Determine whether to show minutes based on their value
            const options = {
                hour: 'numeric',
                hour12: true
            };
            if (parseInt(minutes, 10) !== 0) {
                options.minute = '2-digit';  // Include minutes if they are non-zero
            }

            // Format the time in AM/PM format, possibly including minutes
            const formattedTime = date.toLocaleTimeString('en-US', options);

            return formattedTime;
        },
    },
    computed: {
        artistList() {
            // Get the list of artists in a string
            if (this.track.artists) {
                let artistList = "";
                this.track.artists.forEach((artist, index) => {
                    if (index !== 0) {
                        artistList += ", ";
                    }
                    artistList += artist.name;
                });
                return artistList;
            }
        }
    }
}
</script>

<style scoped>
.loader {
    width: 45px;
    aspect-ratio: 1;
    --c: no-repeat linear-gradient(#ffffff 0 0);
    background:
        var(--c) 0% 50%,
        var(--c) 50% 50%,
        var(--c) 100% 50%;
    background-size: 20% 100%;
    animation: l1 1s infinite linear;
}

@keyframes l1 {
    0% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }

    33% {
        background-size: 20% 10%, 20% 100%, 20% 100%
    }

    50% {
        background-size: 20% 100%, 20% 10%, 20% 100%
    }

    66% {
        background-size: 20% 100%, 20% 100%, 20% 10%
    }

    100% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }
}

/* HTML: <div class="loader"></div> */
.loader-track {
    width: 35px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffffff;
    --_m:
        conic-gradient(#0000 10%, #000),
        linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
}

@keyframes l3 {
    to {
        transform: rotate(1turn)
    }
}

.playingFade-enter-active,
.playingFade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.playingFade-enter-from,
.playingFade-leave-to {
    opacity: 0;
}

.faded-background {
    /** Black background and fades from left to right */
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1));
}

.marquee-container {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}

.text-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: scroll-text 10s linear infinite;
}

/* Keyframes for the scrolling animation using translateX */
@keyframes scroll-text {
    from {
        transform: translateX(60%);
        /* Start by moving from the right */
    }

    to {
        transform: translateX(-100%);
        /* Move all the way to the left */
    }
}
</style>