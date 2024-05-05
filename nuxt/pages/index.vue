<template>
    <div class="flex flex-col items-center relative h-screen overflow-hidden w-full">
        <div class="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1] starfield">
            <Star v-for="(star, index) in stars" :key="index" :top="star.top" :left="star.left" :delay="star.delay" />
        </div>
        <div class="h-40"></div>

        <div class="title text-white text-center text-4xl font-bold my-4">
            <h1>VOTA LA CANÇÓ</h1>
            <h2 class="text-3xl bg-gradient-to-b from-purple-100 to-blue-500 text-transparent bg-clip-text">
                SENSE DIFICULTAT</h2>
        </div>

        <p class="text-white mt-3">Registra't o inicia sessió per començar</p>

        <button @click="loginGoogle"
            class="flex justify-center items-center px-10 py-4 text-white bg-black font-bold cursor-pointer mt-5 border-2 border-white border-opacity-50 shadow-md rounded-full">
            <span class="mr-2">Inicia sessió amb</span>
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
        </button>

        <div class="circle"></div>
        <div class="circle min"></div>

    </div>
</template>

<script>

import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            stars: [],
            store: useAppStore(),
        }
    },
    mounted() {
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                top: Math.random() * window.innerHeight,
                left: Math.random() * window.innerWidth,
                delay: Math.random() * 100,
            });
        }
    },
    methods: {
        loginGoogle() {

            const clientId = this.$config.public.GOOGLE_CLIENT_ID;
            const redirectUri = this.$config.public.GOOGLE_REDIRECT_URI;
            const state = this.generateRandomString(16);
            const scopes = [
                'openid',
                'profile',
                'email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ];
            const scope = encodeURIComponent(scopes.join(' '));
            const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
            window.location.href = url;
        },
        generateRandomString(length) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    }
};

</script>

<style lang="scss" scoped>
.circle {
    width: 300%;
    height: 50%;
    position: absolute;
    border-radius: 50%;
    bottom: -10rem;
    z-index: 99;
}

.circle:not(.min) {
    background: rgb(0, 0, 0);

}

.circle.min {
    box-shadow: 0px 0px 152px 60px rgba(255, 255, 255, 0.44);
    width: 52%;
    height: 40%;
    bottom: -4rem;
    z-index: 98;
    background-color: transparent;
    background: none;
}
</style>