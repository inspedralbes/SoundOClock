<template>
    <Transition name="player-slide">
        <div v-if="track != null"
            class="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 w-[200px] overflow-hidden">
            <div class="flex flex-col items-center">
                <div>
                    <img class="rounded-lg object-cover" :src="track.album.images[0].url" alt="Album Image">
                </div>
                <div class="mt-4 text-center overflow-hidden">
                    <h3 class="text-lg font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-marquee">{{
                        track.name }}
                    </h3>
                    <p class="text-gray-700 whitespace-nowrap overflow-hidden">
                        <span v-for="(artist, index) in track.artists" :key="index">
                            {{ artist.name }}
                            <span v-if="index < track.artists.length - 1">, </span>
                        </span>
                    </p>
                </div>
                <div class="flex flex-row">
                    <button class="m-2" @click="pause">
                        <span class="material-symbols-rounded text-4xl text-gray-700">
                            pause
                        </span>
                    </button>
                    <button v-if="type === 'propose'" class="m-2" @click="propose">
                        <span class="material-symbols-rounded text-4xl text-gray-700">
                            add_circle
                        </span>
                    </button>
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
    transform: translateX(100%);
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
</style>