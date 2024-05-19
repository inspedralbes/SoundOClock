<template>
    <div>
        <!-- Capa que no gira pero superpuesta -->
        <img src="/img/Vinyl_Layer2.png" alt="vinyl_mockup" class="w-3/4 absolute inset-0 m-auto z-20" />
        <div class="w-3/4 flex justify-center items-center relative"
            :class="[store.player.isPlaying ? 'spin' : '', 'transition-transform duration-500 ease-out']">
            <!-- Capa base -->
            <img src="/img/Vinyl_Layer1.png" alt="vinyl_mockup" class="vinyl z-10 relative" />
            <!-- Capa superpuesta -->
            <img src="/img/Vinyl_Layer3.png" alt="layer" class="absolute inset-0 m-auto z-20 mix-blend-multiply" />
            <Transition name="slide-images">
                <img :key="store.currentTrackPlaying.album ? store.currentTrackPlaying.album.images[0].url : store.currentTrackPlaying.img"
                    v-if="store.currentTrackPlaying"
                    :src="store.currentTrackPlaying.album ? store.currentTrackPlaying.album.images[0].url : store.currentTrackPlaying.img"
                    :alt="store.currentTrackPlaying.name" class="absolute inset-0 m-auto w-1/3 right-0 rounded-full" />
            </Transition>
            <Transition name="slide-images">
                <img v-if="!store.currentTrackPlaying" src="/img/soundoclock-logo.svg" alt="Placeholder"
                    class="absolute inset-0 m-auto w-1/3 right-0 rounded-full" />
            </Transition>
        </div>
    </div>

</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            store: useAppStore()
        }
    }
}
</script>

<style scoped>
.vinyl {
    filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.1));
}

.slide-images-enter-active,
.slide-images-leave-active,
.slide-images-move {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-images-enter-from,
.slide-images-leave-to {
    opacity: 0;
    transform: rotate(360deg);
}

.spin {
    animation: spin 4s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes loader-rotate4 {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes loader-dash4 {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
    }

    100% {
        stroke-dashoffset: -125px;
    }
}
</style>