<template>
    <div class="w-full flex justify-center">
        <div class="relative flex w-[95%] h-[100px] bg-gray-200 overflow-hidden rounded-lg mt-4">
            <img class="w-full h-auto object-cover object-center brightness-50"
                :src="track.album ? track.album.images[0].url : track.img" :alt="track.name + '_img'">

            <div class="absolute inset-0 flex flex-row justify-center">
                <div class="flex flex-row w-full justify-between p-2 items-center">
                    <div class="flex flex-col w-[70%] overflow-hidden">
                        <p
                            class="font-bold text-base text-ellipsis uppercase max-w-[200px] overflow-hidden whitespace-nowrap">
                            {{ track.name }}
                        </p>
                        <div class="flex flex-row text-sm">
                            <p class="text-ellipsis">
                                <span class="overflow-hidden whitespace-nowrap text-ellipsis" v-if="track.artists"
                                    v-for="(artist, index) in track.artists" :key="index">
                                    <span v-if="index !== 0">, </span>
                                    {{ artist.name }}
                                </span>
                            </p>
                        </div>
                        <p v-if="type === 'vote'" class="text-sm">Vots: {{ track.totalVotes }}</p>
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
                        <span class="material-symbols-rounded text-4xl">
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
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { socket } from '@/socket';
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
        }
    },
    data() {
        return {
            store: useAppStore(),
            isLoadingVote: computed(() => this.store.isLoadingVote),
            userSelectedSongs: computed(() => this.store.userSelectedSongs)
        }
    },
    created() {

    },
    mounted() {

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
    },
    watch: {

    },
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
</style>