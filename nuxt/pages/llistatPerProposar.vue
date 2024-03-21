<template>
    <div>
        <div class="width mx-auto my-5 flex flex-row justify-center">
            <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                v-model="query" @keyup.enter="getSongs()"></input>
        </div>
        <div v-for="track in tracks"
            class="width mb-3 mx-auto contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
            <div class="contenidor-img">
                <img :src="track.album.images[1].url" :alt="track.name + '_img'" class="rounded-lg">
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
                <p class="font-black basis-1/2">{{ track.name }}</p>
                <p class="basis-1/2">{{ track.artists[0].name }}</p>
            </div>

            <div class="contenidor-butons flex flex-row justify-center items-center gap-1">

                <button class="hover:rounded-lg hover:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="44"
                        height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                    </svg>
                </button>

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
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
        }
    },
    computed: {

    },
    mounted() {
        socket.emit('getTopSongs', 'TopGlobal');

        socket.on('topSongs', (results) => {
            console.log(results);
            this.tracks = results;
            console.log('Top songs:', this.tracks);
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

                // Ahora AudioPreviewURL contiene la URL del audio
                console.log("URL del audio:", AudioPreviewURL);

                // Fetch to AudioPreviewURL to get the audio file .mp3 and play it
                fetch(AudioPreviewURL)
                    .then(response => response.blob())
                    .then(blob => { // blob is the file track.mp3
                        const audioURL = URL.createObjectURL(blob);
                        this.currentTrack = new Audio(audioURL);
                        this.currentTrackId = songId;
                        this.currentTrack.play();
                        this.isPlaying = true;
                        console.log("Playing song:", this.currentTrackId);
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
        onFileChange(e) {
            this.songFile = e.target.files[0]; // this is the file

            // create a URL for the file
            const url = URL.createObjectURL(this.songFile);

            // create an audio element
            let audio = new Audio(url);

            audio.onloadedmetadata = function () {
                let minutes = Math.floor(audio.duration / 60); // get minutes
                let seconds = Math.floor(audio.duration % 60); // get seconds
                // let hours = Math.floor(audio.duration / 3600); // get hours
                console.log('Audio duration:', minutes + ':' + seconds); // log the duration
            };
        },
        getSongs() {
            socket.emit('searchSong', this.query);
            console.log('Searching songs:', this.query);
        },
        playTrack(id) {

            if (this.currentTrackId == id) {
                if (this.isPlaying == true) {
                    console.log('Pausing song:', this.currentTrackId);
                    this.currentTrack.pause();
                    this.isPlaying = false;
                } else {
                    console.log('Playing song:', this.currentTrackId);
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
    },
}
</script>

<style scoped>
.width {
    width: 85%;
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