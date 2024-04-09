<template>

    <!-- Reproductor -->
    <ModularPlayer v-if="$device.isDesktop" @pause="playTrack($event)" @propose="proposeSong($event)" />
    <MobilePlayer v-else @pause="playTrack($event)" @propose="proposeSong($event)" />

    <!-- TITULO -->
    <h1 class="w-full text-center text-5xl font-bold m-2">Proposa la teva cançó</h1>

    <!-- BARRA DE BUSQUEDA -->
    <div class="w-full flex justify-center items-center">
        <div class="relative w-[70%] m-2 text-center">
            <input type="text" placeholder="Buscar..."
                class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                v-model="query" @keyup.enter="getSongs()">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded">
                search
            </span>
            <button @click="deleteSearch">
                <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded">
                    Close
                </span>
            </button>
        </div>
    </div>


    <!-- Listado de canciones -->
    <div class="mb-20">
        <div v-for="track, index in tracks" :key="index" class="flex flex-row justify-center m-2">
            <div class="relative">
                <img :src="track.album.images[1].url" :alt="track.name + '_img'" class="w-20 h-20 m-2 rounded-full z-0">
                <Transition name="playingFade">
                    <div v-if="currentTrackId === track.id && isPlaying"
                        class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-full">
                        <div class="loader"></div>
                    </div>
                </Transition>
            </div>
            <div
                class="border-b border-solid border-gray-300 flex flex-row w-3/5 flex justify-between p-2 items-center">
                <div class="flex flex-col w-[70%]">
                    <p class="font-bold text-base uppercase">{{ track.name }}</p>
                    <div class="flex flex-row text-sm">
                        <p class="whitespace-nowrap overflow-hidden">
                            <span v-for="(artist, index) in track.artists" :key="index">
                                <span v-if="index !== 0">, </span>
                                {{ artist.name }}
                            </span>
                        </p>
                    </div>
                </div>
                <button @click="playTrack(track)">
                    <span v-if="currentTrackId === track.id && isPlaying" class="material-symbols-rounded text-4xl">
                        pause
                    </span>
                    <span v-else class="material-symbols-rounded text-4xl">
                        play_arrow
                    </span>
                </button>
                <button @click="proposeSong(track)" v-if="!track.loading && !track.proposed">
                    <span class="material-symbols-rounded text-4xl">
                        add_circle
                    </span>
                </button>
                <div v-if="track.loading" class="loader-track"></div>
                <span v-if="track.proposed" class="material-symbols-rounded text-4xl">
                    task_alt
                </span>
            </div>
        </div>
    </div>
    <!-- Boton que redirige a la propuesta de canciones -->
    <footer class="fixed bottom-2 w-full flex justify-center align-center">
        <button @click="$router.push('/llista_propostes2')"
            class="w-1/3 m-2 p-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-700">Tornar a les votacions
        </button>
    </footer>
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';


export default {
    data() {
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
        }
    },
    created() {

    },
    mounted() {
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
                    submitedBy: this.store.getUser().id,
                }
                socket.emit('postSong', this.store.getUser().token, song);
            }
            setTimeout(() => {
                track.proposed = true;
                track.loading = false;
            }, 2000);
        },
        getMp3(AudioPreviewURL, songId) {
            fetch(AudioPreviewURL)
                .then(response => response.blob())
                .then(blob => { // blob is the file track.mp3
                    const audioURL = URL.createObjectURL(blob);
                    this.tracks.forEach(item => {
                        if (item.id == songId) {
                            item.preview_url = audioURL;
                        }
                    });
                    if (this.isWaitingToPlay) {
                        this.currentTrack = new Audio(audioURL);
                        this.currentTrackId = songId;
                        this.currentTrack.play();
                        this.isPlaying = true;
                        this.isWaitingToPlay = false;
                    } else if (this.isWaitingToPropose) {
                        let track = this.tracks.find(item => item.id == songId);

                        let song = {
                            id: track.id,
                            title: track.name,
                            artist: track.artists[0].name,
                            date: track.album.release_date,
                            img: track.album.images[1].url,
                            previewUrl: track.preview_url,
                            submitDate: new Date().toISOString(),
                            submitedBy: this.store.getUser().id,
                        }
                        socket.emit('postSong', this.store.getUser().token, song);
                        this.isWaitingToPropose = false;

                    }
                })
                .catch(error => {
                    console.error('Error getting the audio file:', error);
                });
        },
        deleteSearch() {
            this.query = '';
            this.tracks = [];
            socket.emit('getTopSongs', 'Top Songs Spain');
        }
    },
    beforeDestroy() {
        socket.off('topSongs');
        socket.off('searchResult');
        socket.off('sendHtmlSpotify');
    },
    watch: {
        'currentTrack': {
            handler: function () {
                this.currentTrack.onended = () => {
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                }
            }
        }
    }
}
</script>

<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
    width: 45px;
    aspect-ratio: 1;
    --c: no-repeat linear-gradient(#ffffff 0 0);
    background:
        var(--c) 0% 50%,
        var(--c) 50% 50%,
        var(--c) 100% 50%;
    background-size: 20% 100%;
    animation: l1 1s infinite linear;
}

@keyframes l1 {
    0% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }

    33% {
        background-size: 20% 10%, 20% 100%, 20% 100%
    }

    50% {
        background-size: 20% 100%, 20% 10%, 20% 100%
    }

    66% {
        background-size: 20% 100%, 20% 100%, 20% 10%
    }

    100% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }
}

/* HTML: <div class="loader"></div> */
.loader-track {
    width: 35px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffffff;
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
</style>