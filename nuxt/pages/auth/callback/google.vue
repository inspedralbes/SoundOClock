<template>
    <div class="w-screen h-screen">
        <div class="loader">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
            <div class="dot dot-4"></div>
            <div class="dot dot-5"></div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
import { socket } from '@/socket';

export default {
    data() {
        return {
            url: '',
            state: '',
            code: '',
            scope: '',
            hd: '',
            prompt: '',
        }
    },
    created() {
        this.getURIparams();
    },
    methods: {
        getURIparams() {
            if (process.client) {
                const url = new URL(window.location.href);
                this.code = url.searchParams.get('code');
                this.state = url.searchParams.get('state');
                this.scope = url.searchParams.get('scope');
                this.hd = url.searchParams.get('hd');
                this.prompt = url.searchParams.get('prompt');

                setTimeout(() => {
                    this.fetchGoogle();
                }, 300);
            }
        },
        async fetchGoogle() {
            let googleData = {};
            const authOptions = {
                url: 'https://oauth2.googleapis.com/token',
                data: new URLSearchParams({
                    code: this.code,
                    client_id: this.$config.public.GOOGLE_CLIENT_ID,
                    client_secret: this.$config.public.GOOGLE_CLIENT_SECRET,
                    redirect_uri: this.$config.public.GOOGLE_REDIRECT_URI,
                    grant_type: 'authorization_code',
                    scope: 'openid profile email'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            try {
                const responseToken = await axios.post(authOptions.url, authOptions.data, {
                    headers: authOptions.headers
                });
                googleData = responseToken.data;
                console.log('Google token:', googleData);
                console.log('Google token:', googleData.access_token);

                socket.emit('googleLogin', googleData.access_token);

                // axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                //     headers: {
                //         Authorization: `Bearer ${responseToken.data.access_token}`
                //     }
                // }).then(response => {
                //     googleData.userInfo = response.data;
                //     console.log('Google data:', googleData);
                // }).catch(e => {
                //     console.error('Error during Google authentication:', e);
                //     throw new Error('Failed to authenticate with Google');
                // });
            } catch (e) {
                console.error('Error during Google authentication:', e);
                throw new Error('Failed to authenticate with Google');
            }
        }
    },

}
</script>

<style scoped>
.loader {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
}

.dot {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 6px;
    border-radius: 50%;
    -webkit-animation: dot-pulse2 1.5s ease-in-out infinite;
    animation: dot-pulse2 1.5s ease-in-out infinite;
}

.dot-1 {
    background-color: #4285f4;
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
}

.dot-2 {
    background-color: #34a853;
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.dot-3 {
    background-color: #fbbc05;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

.dot-4 {
    background-color: #ea4335;
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
}

.dot-5 {
    background-color: #4285f4;
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
}

@keyframes dot-pulse2 {
    0% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        opacity: 0.5;
    }

    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        opacity: 0.5;
    }
}
</style>

<!-- LOADER CSS QUE ESTA TO WAPO -->
<!-- https://uiverse.io/csozidev/curly-crab-48 -->