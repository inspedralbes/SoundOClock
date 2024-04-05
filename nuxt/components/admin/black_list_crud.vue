<template>
    <div>
        <div class="width mx-auto my-5 flex flex-row justify-center">
            <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                v-model="query" @keyup.enter="getSongs()"></input>
        </div>
        <div v-for="track in filteredTracks"
            class="width mb-3 mx-auto contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
            <div class="contenidor-img">
                <img :src=track.img :alt="track.title + '_img'" class="rounded-lg">
                <button @click="playTrack(track.id)" class="rounded-lg"
                    :class="{ playingC: isPlayingCheck(track.id), noPlaying: !isPlayingCheck(track.id) }">
                    <!-- fer amb computed la classe -->
                    <span v-if="currentTrackId === track.id && isPlaying" class="material-symbols-rounded">
                        pause
                    </span>
                    <span v-else class="material-symbols-rounded">
                        play_arrow
                    </span>
                </button>
            </div>

            <div class="song-data">
                <p class="font-black basis-1/2">{{ track.title }}</p>
                <p class="basis-1/2">{{ track.artist }}</p>
            </div>

            <div class="contenidor-butons flex flex-row justify-center items-center gap-1">

                <button @click="modalActual = track.id" class="hover:rounded-lg hover:bg-black flex">
                    <span class="material-symbols-outlined options-span">
                        unarchive
                    </span>
                </button>
                <ModularModal v-if="modalActual === track.id" @close="modalActual = null"
                    @confirm="removeFromBlacklist(track.id)">
                    <template v-slot:title>
                        <h2>Segur que vols treure aquesta cançó de la blacklist?</h2>
                    </template>
                    <template v-slot:content>
                        <div class="mx-auto contenidor-canço flex flex-row items-center rounded-lg gap-2">
                            <div class="contenidor-img">
                                <img :src=track.img :alt="track.title + '_img'" class="rounded-lg">
                                <button @click="playTrack(track.id)" class="rounded-lg"
                                    :class="{ playingC: isPlayingCheck(track.id), noPlaying: !isPlayingCheck(track.id) }">
                                    <!-- fer amb computed la classe -->
                                    <span v-if="currentTrackId === track.id && isPlaying"
                                        class="material-symbols-rounded">
                                        pause
                                    </span>
                                    <span v-else class="material-symbols-rounded">
                                        play_arrow
                                    </span>
                                </button>
                            </div>

                            <div class="song-data">
                                <p class="font-black basis-1/2">{{ track.title }}</p>
                                <p class="basis-1/2">{{ track.artist }}</p>
                            </div>
                        </div>
                    </template>
                </ModularModal>

            </div>
        </div>
    </div>
</template>

<script>

import { socket } from '@/socket';

export default {
    data() {
        return {
            token: '',
            songFile: null,
            query: '',
            tracks: [],
            filteredTracks: [],
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
            modalActual: null,
        }
    },
    computed: {

    },
    mounted() {

        const songs = [
            { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/blinding-lights-preview', votes: 150, submitDate: new Date('2020-11-29'), submittedBy: 'User1' },
            { id: 2, title: 'Shot in the Dark', artist: 'AC/DC', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/shot-in-the-dark-preview', votes: 75, submitDate: new Date('2020-10-07'), submittedBy: 'User2' },
            { id: 3, title: 'Don\'t Start Now', artist: 'Dua Lipa', year: 2019, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/dont-start-now-preview', votes: 200, submitDate: new Date('2019-11-01'), submittedBy: 'User3' },
            { id: 4, title: 'Fear Inoculum', artist: 'Tool', year: 2019, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/fear-inoculum-preview', votes: 90, submitDate: new Date('2019-08-30'), submittedBy: 'User4' },
            { id: 5, title: 'God\'s Plan', artist: 'Drake', year: 2018, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/gods-plan-preview', votes: 250, submitDate: new Date('2018-01-19'), submittedBy: 'User5' },
            { id: 6, title: 'HARDWIRE', artist: 'Metallica', year: 2016, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/hardwire-preview', votes: 65, submitDate: new Date('2016-08-18'), submittedBy: 'User6' },
            { id: 7, title: 'Hello', artist: 'Adele', year: 2015, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/hello-preview', votes: 300, submitDate: new Date('2015-10-23'), submittedBy: 'User7' },
            { id: 8, title: 'Doom and Gloom', artist: 'The Rolling Stones', year: 2012, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/doom-and-gloom-preview', votes: 80, submitDate: new Date('2012-10-11'), submittedBy: 'User8' },
            { id: 9, title: 'Royals', artist: 'Lorde', year: 2013, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/royals-preview', votes: 220, submitDate: new Date('2013-03-08'), submittedBy: 'User9' },
            { id: 10, title: 'R U Mine?', artist: 'Arctic Monkeys', year: 2013, img: 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5', previewUrl: 'https://example.com/r-u-mine-preview', votes: 110, submitDate: new Date('2013-02-27'), submittedBy: 'User10' }
        ];

        // SE HA DE CABIAR POR UNA PETICIÓN AL NODE 
        // QUE DEVUELVA LAS CANCIONES OBTENIDAS DE LA API DE LARAVEL
        fetch('http://localhost:8080/songs')
            .then(response => response.json())
            .then(data => {
                data = songs;
                this.tracks = data;
                this.filteredTracks = data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        this.loading = false;

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

                // Fetch to AudioPreviewURL to get the audio file .mp3 and play it
                fetch(AudioPreviewURL)
                    .then(response => response.blob())
                    .then(blob => { // blob is the file track.mp3
                        const audioURL = URL.createObjectURL(blob);
                        this.currentTrack = new Audio(audioURL);
                        this.currentTrackId = songId;
                        this.currentTrack.play();
                        this.isPlaying = true;
                    })
                    .catch(error => {
                        console.error('Error getting the audio file:', error);
                    });
            } else {
                console.error('No se encontró el script con el id "__NEXT_DATA__" en el HTML recibido');
            }
        });
    },
    methods: {
        getSongs() {
            // search on this.tracks by name or artist and set the results on this.filteredTracks
            if (this.query) {
                this.filteredTracks = this.tracks.filter(track => track.title.toLowerCase().includes(this.query.toLowerCase()) || track.artist.toLowerCase().includes(this.query.toLowerCase()));
            } else {
                this.filteredTracks = this.tracks;
            }
        },
        playTrack(id) {

            if (this.currentTrackId == id) {
                if (this.isPlaying == true) {
                    this.currentTrack.pause();
                    this.isPlaying = false;
                } else {
                    this.currentTrack.play();
                    this.isPlaying = true;
                }
            } else {
                if (this.currentTrack) {
                    this.currentTrack.pause();
                }
                socket.emit('getHtmlSpotify', id);
            }
        },
        isPlayingCheck(id) {
            if (this.isPlaying && this.currentTrackId == id) {
                return true;
            } else if (!this.isPlaying && this.currentTrackId == id) {
                return false;
            }
        },
        removeFromBlacklist(trackId) {
            // Remove track from blacklist
            this.tracks = this.tracks.filter(track => track.id !== trackId);
            this.filteredTracks = this.filteredTracks.filter(track => track.id !== trackId);
            // socket.emit('removeFromBlacklist', trackId);
        },
    },
}
</script>

<style scoped>
.width {
    width: 85%;
}

input[type="text"] {
    color: black;
    /* Cambiar el color del texto aquí */
}

.contenidor-canço {
    background-color: rgb(56, 56, 56);
    color: white;
}

.contenidor-canço>*:last-child {
    justify-self: flex-end;
}

.contenidor-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 20%;
    min-width: fit-content;
    height: 100%;
    width: fit-content;
}

.contenidor-img>button>span {
    font-size: 40px;
    color: white;
}

.contenidor-img>button>svg {
    width: 80%;
    height: auto;
}

.contenidor-img:hover>button {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    background-color: rgb(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 100;
}

.playingC {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    background-color: rgb(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 100;
}

.song-data {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-evenly;
    flex-grow: 1;
    align-items: center;
    max-width: 100%;
    min-width: 5%;
    text-align: center;
}

.song-data>p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.contenidor-butons {
    max-width: 20%;
    min-width: fit-content;
    align-self: center;
}

img {
    width: 60px;
    height: 60px;
}

.noPlaying {
    display: none;
}

@media screen and (min-width: 768px) {

    .song-data {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;
    }

    .contenidor-butons {
        max-width: 20%;
        min-width: fit-content;
        align-self: center;
    }

    .width {
        width: 55%;
    }

}

.cercador {
    background-color: white;
    border-radius: 24px;
    height: 40px;
}
</style>