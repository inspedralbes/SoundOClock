<template>
    <div :class="{ 'overflow-hidden max-h-dvh': modals.proposeSongError }">
        <!-- Reproductor -->
        <component :is="activePlayer" @pause="playTrack($event)" @propose="proposeSong($event)" />

        <!-- TITULO -->
        <h1 :class="{ 'w-full text-center text-5xl font-bold m-2': true, '!text-2xl !mr-1 !ml-1': $device.isMobile }">
            Proposa la teva cançó</h1>

        <!-- BARRA DE BUSQUEDA -->
        <div class="w-full flex justify-center items-center">
            <div class="relative w-[70%] m-2 text-center" :class="{ 'w-[90%]': $device.isMobile }">
                <input type="text" placeholder="Buscar..."
                    class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    :class="{ '!py-2 !text-sm': $device.isMobile }" v-model="query" @keyup.enter="getSongs()">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded"
                    :class="{ 'text-base': $device.isMobile }">
                    search
                </span>
                <Transition name="delete-fade">
                    <button v-if="query" @click="deleteSearch">
                        <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded"
                            :class="{ 'text-base': $device.isMobile }">
                            Close
                        </span>
                    </button>
                </Transition>
            </div>
        </div>


        <!-- Listado de canciones -->
        <div class="mb-20">
            <component :is="activeSong" v-for="track, index in tracks" :track="track" :currentTrackId="currentTrackId"
                :isPlaying="isPlaying" type="propose" @play="playTrack($event)" @propose="proposeSong($event)">
            </component>
        </div>

        <!-- Modals -->
        <component :is="activeModal" :open="modals.proposeSongError" @close="modals.proposeSongError = false">
            <template #title>Ja has proposat una cançó</template>
            <template #content>
                <p class="text-center">Ja has proposat una cançó, espera a que la següent votació per proposar una
                    altra.
                </p>
            </template>
        </component>

        <!-- Boton que redirige a la propuesta de canciones -->
        <footer class="fixed bottom-2 w-full flex justify-center align-center">
            <button @click="goToVote"
                class="w-1/3 m-2 p-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-700"
                :class="{ 'text-sm w-[90%] mb-4': $device.isMobile }">Tornar a les
                votacions
            </button>
        </footer>
    </div>
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';


export default {
    data() {
        const store = useAppStore();
        return {
            token: '',
            songFile: null,
            query: '',
            tracks: [],
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
            isWaitingToPlay: false,
            isWaitingToPropose: false,
            store: useAppStore(),
            modals: {
                proposeSongError: false,
            },
            postedSongStatus: computed(() => store.postedSongStatus),
            postedSongId: "",
            modalSelector: this.$device.isMobile ? 1 : 0,
            songComponentSelector: this.$device.isMobile ? 1 : 0,
            playerComponentSelector: this.$device.isMobile ? 1 : 0,
            modalComponent: {
                0: resolveComponent('ModularModal'),
                1: resolveComponent('MobileModal'),
            },
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
            playerComponent: {
                0: resolveComponent('ModularPlayer'),
                1: resolveComponent('MobilePlayer'),
            }
        }
    },
    created() {

        socket.emit('getTopSongs', 'Top Songs Spain');

        socket.on('topSongs', (results) => {
            this.tracks = results;
        });
        socket.on('searchResult', (results) => {
            this.tracks = results;
        });

        socket.on('sendHtmlSpotify', (htmlSpotify, songId) => {
            // Crear un elemento HTML temporal
            const tempElement = document.createElement('div');

            // Establecer el HTML recibido en el elemento temporal
            tempElement.innerHTML = htmlSpotify;

            // Obtener el script por su id
            const scriptElement = tempElement.querySelector('#__NEXT_DATA__');


            // Verificar si se encontró el elemento
            if (scriptElement) {
                // Acceder al contenido JSON dentro del script y convertirlo a objeto JavaScript
                const jsonData = JSON.parse(scriptElement.textContent);

                // Acceder al AudioPreviewURL
                const AudioPreviewURL = jsonData.props.pageProps.state.data.entity.audioPreview.url;


                // add AudioPreviewURL to the track object with the songId
                this.tracks.forEach(item => {
                    if (item.id == songId) {
                        item.preview_url = AudioPreviewURL;
                    }
                });

                // Fetch to AudioPreviewURL to get the audio file .mp3
                this.getMp3(AudioPreviewURL, songId);
            } else {
                console.error('No se encontró el script con el id "__NEXT_DATA__" en el HTML recibido');
            }
        });

    },
    mounted() {
        if (!this.store.getUser().token) {
            console.log('No token');
            navigateTo({ path: '/' });
        }
    },
    methods: {
        getSongs() {
            if (this.query == '') {
                socket.emit('getTopSongs', 'Top Songs Spain');
                return;
            }
            socket.emit('searchSong', this.query);
        },
        playTrack(track) {
            const store = useAppStore();

            if (this.currentTrackId == track.id) {
                if (this.isPlaying) {
                    this.currentTrack.pause();
                    this.isPlaying = false;
                    store.deleteCurrentTrackPlaying();
                } else {
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    store.setCurrentTrackPlaying(track);
                }
            } else {
                if (track.preview_url != null) {
                    if (this.currentTrack != null) {
                        this.currentTrack.pause();
                        store.deleteCurrentTrackPlaying();
                    }
                    this.currentTrack = new Audio(track.preview_url);
                    this.currentTrackId = track.id;
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    store.setCurrentTrackPlaying(track);
                } else {
                    if (this.currentTrack != null) {

                        this.currentTrack.pause();
                        store.deleteCurrentTrackPlaying();
                    }
                    store.setCurrentTrackPlaying(track);
                    socket.emit('getHtmlSpotify', track.id);
                    this.isWaitingToPlay = true;
                }
            }
        },
        isPlayingCheck(id) {
            if (this.currentTrackId == id) {
                return this.isPlaying;
            }
        },
        proposeSong(track) {
            track.loading = true;
            this.postedSongId = track.id;
            if (track.preview_url == null) {
                socket.emit('getHtmlSpotify', track.id);
                this.isWaitingToPropose = true;
            } else {
                let song = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    date: track.album.release_date,
                    img: track.album.images[1].url,
                    previewUrl: track.preview_url,
                    submitDate: new Date().toISOString(),
                    submittedBy: this.store.getUser().id,
                }
                socket.emit('postSong', this.store.getUser().token, song);
            }
        },
        getMp3(AudioPreviewURL, songId) {
            let track = this.tracks.find(item => item.id == songId);
            track.preview_url = AudioPreviewURL;
            if (this.isWaitingToPlay) {
                this.playTrack(track);
                this.isWaitingToPlay = false;
            } else if (this.isWaitingToPropose) {
                this.proposeSong(track);
                this.isWaitingToPropose = false;

            }
        },
        deleteSearch() {
            this.query = '';
            this.tracks = [];
            socket.emit('getTopSongs', 'Top Songs Spain');
        },
        searchBySongId(id) {
            return this.tracks.find(item => item.id == id);
        },
        goToVote() {
            this.$router.push('/llista_propostes');
            this.store.deleteCurrentTrackPlaying(null);
            this.currentTrack.pause();
        }
    },
    beforeUnmount() {
        this.store.deleteCurrentTrackPlaying(null);
        this.currentTrack.pause();
        socket.off('topSongs');
        socket.off('searchResult');
        socket.off('sendHtmlSpotify');
    },
    computed: {
        activeModal() {
            return this.modalComponent[this.modalSelector];
        },
        activeSong() {
            return this.songComponent[this.songComponentSelector];
        },
        activePlayer() {
            return this.playerComponent[this.playerComponentSelector];
        }
    },
    watch: {
        'currentTrack': {
            handler: function () {
                this.currentTrack.onended = () => {
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                }
            }
        },
        postedSongStatus: {
            handler: function () {
                if (this.postedSongStatus.status == 'error') {
                    this.modals.proposeSongError = true;
                    this.searchBySongId(this.postedSongId).loading = false;
                } else {
                    this.searchBySongId(this.postedSongId).loading = false;
                    this.searchBySongId(this.postedSongId).proposed = true;
                }
            }
        }
    }
}
</script>

<style scoped>
.delete-fade-enter-active,
.delete-fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.delete-fade-enter-from,
.delete-fade-leave-to {
    opacity: 0;
}
</style>