<template>
    <div class="w-screen h-screen">
        <Loader />
    </div>

</template>

<script>
import axios from 'axios';
import { socket } from '@/socket';
import { useAppStore } from "@/stores/app";

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
        const store = useAppStore();

        this.getURIparams();
        store.deleteUser();
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
                console.log('Google', googleData);
                socket.emit('googleLogin', googleData.access_token);
            } catch (e) {
                console.error('Error during Google authentication:', e);
                throw new Error('Failed to authenticate with Google');
            }
        }
    },

}
</script>

<style scoped></style>

<!-- LOADER CSS QUE ESTA TO WAPO -->
<!-- https://uiverse.io/csozidev/curly-crab-48 -->