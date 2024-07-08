<template>
    <div v-if="loading" class="fixed h-screen w-screen top-0 bg-black z-50">
        <Loader />
    </div>
    <div v-if="!$device.isMobile" ref="scrollContainer" @scroll="handleScroll" class="overflow-y-scroll h-screen">
        <div class="flex justify-between relative">
            <div class="w-1/2 h-screen flex flex-col justify-between items-center">
                <div class="text-left mt-36">
                    <h1 class="text-8xl font-bold futura">Sound</h1>
                    <h1 class="text-8xl font-bold futura">O'Clock</h1>
                    <p class="text-4xl font-sans">El ritme del teu dia, a les teves mans</p>
                    <button @click="handleLogin"
                        class="flex flex-row gap-x-4 bg-white p-4 my-4 rounded-full hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4" />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853" />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05" />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span class="text-black">Inicia sessió amb Google</span>
                    </button>
                </div>
                <div class="text-left w-2/3">
                    <p class="text-3xl font-sans">Descobreix les últimes cançons votades</p>
                    <div class="flex justify-center">
                        <button @click="scrollToBottom"
                            class="animate-bounce border-2 border-white rounded-full p-2 px-3 my-8">
                            <span class="material-symbols-rounded text-3xl">arrow_downward</span>
                        </button>
                    </div>
                </div>
            </div>
            <div :style="{ opacity: opacity }"
                class="w-1/2 h-screen flex flex-col justify-end items-center absolute bottom-0 right-0 transition-opacity">
                <img src="/img/listening_boy2.png" alt="Vota la cançó"
                    class="w-5/6 drop-shadow-xl text-white sombra-filtro relative z-10">
                <div class="absolute inset-0 flex justify-center items-end z-0 mix-blend-screen">
                    <img src="/img/audio_wave_bg.jpg" class="w-full h-full opacity-gradient">
                </div>
            </div>
        </div>
        <div class="w-screen h-screen flex flex-col justify-center items-center">
            <h1 class="text-4xl futura mb-8 small-caps">Les últimes cançons seleccionades</h1>
            <UCarousel ref="carouselRef" v-slot="{ item, index }" :items="selectedSongs" arrows autoplay
                :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3' }" indicators
                class="w-[95%] rounded-lg overflow-hidden border-white">
                <img :src="item.img" class="w-full" draggable="false">
                <UDivider orientation="vertical" class="mx-2" size="sm" />
            </UCarousel>
            <div class="flex justify-end w-full">
                <button @click="scrollToTop" class="border-2 border-white rounded-full p-2 px-3 mt-8 mx-4">
                    <span class="material-symbols-rounded text-3xl">arrow_upward</span>
                </button>
            </div>
        </div>
    </div>
    <div v-else ref="scrollContainer" @scroll="handleScroll" class="h-screen overflow-hidden">
        <div class="h-screen w-full flex flex-col justify-between">
            <div class="m-2">
                <h1 class="text-7xl font-bold futura text-left">Sound</h1>
                <h1 class="text-7xl font-bold futura text-left">O'Clock</h1>
            </div>
            <div class="mx-2">
                <p class="text-3xl font-sans">El ritme del teu dia,</p>
                <p class="text-3xl font-sans">a les teves mans</p>
                <button @click="handleLogin"
                    class="flex flex-row gap-x-4 bg-white p-4 my-4 rounded-full hover:bg-gray-200 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4" />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853" />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05" />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    <span class="text-black">Inicia sessió amb Google</span>
                </button>
            </div>
        </div>
        <img src="/img/listening_boy2.png" alt="Vota la cançó"
            class="max-w-none fixed bottom-0 w-[600px] translate-x-[-20%] z-[-1]">
    </div>
    <div class="fixed inset-0 z-[-4] object-cover h-screen w-screen bg-gradient-to-t from-black to-transparent"></div>
    <AnimatedGradient class="fixed inset-0 z-[-5] object-cover h-screen w-screen" />
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '~/communicationManager';
import { socket } from '@/socket';

export default {
    data() {
        return {
            store: useAppStore(),
            opacity: 1,
            selectedSongs: [],
            intervalId: null,
            loading: false,
        }
    },
    async mounted() {
        this.selectedSongs = await comManager.getSelectedSongsOnLanding();
        this.$refs.scrollContainer.addEventListener('scroll', this.handleScroll);
        this.intervalId = setInterval(() => {
            const carousel = this.$refs.carouselRef;
            if (!carousel) return;

            if (carousel.page === carousel.pages) {
                carousel.select(0);
            } else {
                carousel.next();
            }
        }, 6000);
    },
    beforeDestroy() {
        this.$refs.scrollContainer.removeEventListener('scroll', this.handleScroll);
        clearInterval(this.intervalId);
    },
    methods: {
        handleLogin() {
            socket.emit('publicLogin')
            // if (this.$config.public.ENV === 'preprod') {
            //     socket.emit('publicLogin')
            //     this.loading = true;
            // } else {
            //     this.loginGoogle();
            // }
        },
        loginGoogle() {
            const clientId = this.$config.public.GOOGLE_CLIENT_ID; const
                redirectUri = this.$config.public.GOOGLE_REDIRECT_URI; const state = this.generateRandomString(16);
            const scopes = ['openid', 'profile', 'email'
                , 'https://www.googleapis.com/auth/userinfo.profile',]; const
                    scope = encodeURIComponent(scopes.join(' '));
            const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
            window.location.href = url;
        },
        generateRandomString(length) {
            let text = '';
            const possible = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; for (let i = 0; i <
                length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
            return text;
        },
        handleScroll() {
            const scrollTop = this.$refs.scrollContainer.scrollTop;
            const maxScroll = this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.clientHeight;
            // Calculamos la opacidad en función de la posición del scroll
            this.opacity = 1 - (scrollTop / maxScroll);
        },
        scrollToBottom() {
            this.$refs.scrollContainer.scrollTo({
                top: this.$refs.scrollContainer.scrollHeight,
                behavior: 'smooth',
            });
        },
        scrollToTop() {
            this.$refs.scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        },
    },
    computed: {
        songImages() {
            return this.selectedSongs.map(song => song.img);
        }
    }
}; 
</script>

<style lang="scss" scoped>
.sombra-filtro {
    filter: drop-shadow(-5px 5px 10px rgba(255, 255, 255, 0.25));
}

.futura {
    font-family: 'Futura', sans-serif;
}

.opacity-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
}

.small-caps {
    font-variant: small-caps;
}
</style>
