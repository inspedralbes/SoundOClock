<template>
    <Transition name="player-slide">
        <div v-if="track != null" class="w-full fixed bottom-0 bg-white z-20 opacity-80">
            <div class="flex flex-row justify-between">
                <div class="flex flex-row items-center w-[30%] overflow-hidden">
                    <img class="rounded-full w-24 m-4 ml-12" :src="track.album ? track.album.images[0].url : track.img"
                        alt="Album Image">
                    <div class="border-solid border-l-4 h-3/4 flex flex-col justify-center pl-2 border-gray-700 overflow-hidden"
                        :class="{ 'fader': isOverflowing('artist') || isOverflowing('title') }">
                        <h3 class="text-lg font-semibold text-gray-800 uppercase whitespace-nowrap overflow-hidden"
                            :class="{ 'text-marquee': isOverflowing('title') }">
                            {{ track.name }}
                        </h3>
                        <p class="text-gray-700 whitespace-nowrap overflow-hidden">
                            <span class="overflow-hidden whitespace-nowrap" v-if="artistList"
                                :class="{ 'text-marquee': isOverflowing('artist') }">
                                {{ artistList }}
                            </span>
                        </p>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-2/5 mr-[20%]">
                    <div class="w-full flex items-center justify-center">
                        <div class="flex flex-row w-1/2 justify-between items-center">
                            <button v-if="type === 'vote'" class="m-2" @click="report">
                                <span class="material-symbols-rounded text-4xl text-gray-700">
                                    report
                                </span>
                            </button>
                            <button class="m-2" @click="pause">
                                <span class="material-symbols-rounded text-4xl text-gray-700">
                                    pause
                                </span>
                            </button>
                            <button v-if="type === 'vote' && !isLoadingVote.state" class="m-2" @click="vote">
                                <span class="material-symbols-rounded text-4xl text-gray-700">
                                    thumb_up
                                </span>
                            </button>
                            <button v-if="type === 'propose' && (!track.loading && !track.proposed)" class="m-2"
                                @click="propose">
                                <span class="material-symbols-rounded text-4xl text-gray-700">
                                    add_circle
                                </span>
                            </button>
                            <div v-if="track.loading || isLoadingVote.state" class="loader-track"></div>
                            <div v-if="type === 'propose' && (track.proposed)" class="m-2">
                                <span class="material-symbols-rounded text-4xl text-gray-700">
                                    task_alt
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row justify-center items-center">
                        <p class="text-black">{{ store.player.currentTime }}</p>
                        <div class="w-full mx-4 h-2 bg-gray-700">
                            <div class="h-full bg-blue-500" :style="{ width: progressBar + '%' }"></div>
                        </div>
                        <p class="text-black">{{ isNaN(store.player.duration) ? '0:30' : store.player.duration }}</p>
                    </div>
                </div>
                <div class=" flex justify-center items-center mx-12">
                    <a v-if="track.link || track.external_urls.spotify" class="h-fit w-fit"
                        :href="track.link ? track.link : track.external_urls.spotify" target="_blank"
                        rel="noopener noreferrer">
                        <span class="material-symbols-rounded text-4xl text-gray-700">open_in_new
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';

export default {
    data() {
        return {
            store: useAppStore(),
            track: computed(() => this.store.currentTrackPlaying),
            isLoadingVote: computed(() => this.store.isLoadingVote),
            progressBar: computed(() => this.store.player.progressBar)
        }
    },
    props: {
        type: {
            type: String,
            default: 'propose'
        }
    },
    created() {
    },
    methods: {
        pause() {
            this.$emit('pause', this.track);
        },
        propose() {
            this.$emit('propose', this.track);
        },
        report() {
            this.$emit('report', this.track);
        },
        vote() {
            this.$emit('vote', this.track);
        },
        isOverflowing(type) {
            if (type === 'title') {
                return this.track.name.length > 18;
            } else if (type === 'artist') {
                return this.artistList.length > 50;
            }
        }
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
.player-slide-enter-active,
.player-slide-leave-active {
    transition: transform 0.3s;
}

.player-slide-enter-from,
.player-slide-leave-to {
    transform: translateY(150%);
}

.loader-track {
    width: 35px;
    height: 35px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #020202;
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

.spin {
    animation: spin 5s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.fill {
    animation: fill 30s linear infinite;
}

@keyframes fill {
    0% {
        width: 0;
    }

    100% {
        width: 50%;
    }
}

.text-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: scroll-text 10s ease-in infinite;
}

/* Keyframes for the scrolling animation using translateX */
@keyframes scroll-text {

    0%,
    10% {
        transform: translateX(0%);
        opacity: 1;
    }

    10.01% {
        transform: translateX(0%);
        opacity: 1;
    }

    80% {
        transform: translateX(-100%);
        /* The text scrolls left until out of view */
        opacity: 1;
    }

    80.01% {
        transform: translateX(100%);
        /* The text is instantly placed to the right of the screen */
        opacity: 0;
    }

    90% {
        transform: translateX(0%);
        opacity: 0;
    }

    100% {
        transform: translateX(0%);
        opacity: 1;
    }

}

.fader {
    -webkit-mask-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 0)));
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>