<template>
    <Transition name="player-slide">
        <div v-if="track != null" class="fixed bottom-0 right-0 bg-white shadow-lg p-4 w-full overflow-hidden z-50">
            <img class="fixed bottom-5 object-cover w-28 rounded-full border-8 border-solid border-white spin"
                :src="track.album ? track.album.images[0].url : track.img" alt="Album Image">
            <div class="flex flex-col items-center">
                <div class="flex flex-row items-center ml-20">
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
        </div>
    </Transition>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';

export default {
    data() {
        const appStore = useAppStore();
        return {
            track: computed(() => appStore.currentTrackPlaying),
            isLoadingVote: computed(() => appStore.isLoadingVote)
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
        vote() {
            this.$emit('vote', this.track);
        },
        report() {
            this.$emit('report', this.track);
        },
        isOverflowing(text) {
            let nameLength = 0;
            if (text === 1) {
                nameLength = this.track.name.length;
                return nameLength > 20;
            } else {
                for (const artist of this.track.artists) {
                    nameLength += artist.name.length;
                }
                return nameLength > 20;
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
</style>