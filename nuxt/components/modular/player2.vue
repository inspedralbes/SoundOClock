<template>
    <Transition name="player-slide">
        <div v-if="track != null" class="w-full fixed bottom-0 bg-white z-20">
            <div class="flex flex-row items-center">
                <img class="rounded-full w-24 m-4 ml-12" :src="track.album ? track.album.images[0].url : track.img"
                    alt="Album Image">
                <div class="overflow-hidden">
                    <h3 class="text-lg font-semibold text-gray-800 uppercase whitespace-nowrap overflow-hidden ">
                        {{ track.name }}
                    </h3>
                    <p class="text-gray-700 whitespace-nowrap overflow-hidden">
                        <span v-if="track.artists" v-for="(artist, index) in track.artists" :key="index">
                            <span v-if="index !== 0">, </span>
                            {{ artist.name }}
                        </span>
                        <span v-else>{{ track.artist }}</span>
                    </p>
                </div>
                <div class="flex flex-row items-center">
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
                <!-- <div class="bg-black w-1/2 h-2 fill"></div> -->
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
        isOverflowing(text) {
            if (text === 1) {
                return this.track.name.length > 10;
            } else {
                let nameLength = 0;
                if (this.track.artists) {
                    for (const artist of this.track.artists) {
                        nameLength += artist.name.length;
                    }
                    return nameLength > 20;
                } else {
                    return this.track.artist.length > 20;
                }
            }
        }
    },
    computed: {

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

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.text-marquee {
    white-space: nowrap;
    animation: marquee 10s linear infinite;
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
</style>