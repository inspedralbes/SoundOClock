<template>
    <div>
        <h1>Proposta <button @click="getHtmlSpotify('5lwWpQ71GKN3sWmk8zZr9g')">getHtmlSpotify</button></h1>
        <!-- browser for getSongs -->
        <input type="text" v-model="query" @keyup.enter="getSongs(query)" placeholder="Search for songs">

        <!-- v-for tracks -->
        <div v-for="track in tracks" :key="track.id">
            <h2>NAME: {{ track.name }}</h2>
            <p>ARTIST: {{ track.artists[0].name }}</p>
            <img :src="track.album.images[1].url" alt="asdas">
            <p>ID: {{ track.id }}</p>
            <button @click="playTrack(track.id)">REPRODUCTOR / TOGGLE </button>
            <hr>
        </div>
    </div>
</template>

<script>
import { socket } from '@/socket';

export default {
    data() {
        return {
            songFile: null,
            query: '',
            tracks: [],
            currentTrack: null,
            currentTrackId: null,
            currentTrackStatus: 'stopped'
        }
    },
    mounted() {
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
                        this.currentTrackStatus = 'playing';
                        this.currentTrack.play();
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
        getHtmlSpotify(id) {
            socket.emit('getHtmlSpotify', id);
        },
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
            };
        },
        getSongs(query) {
            let token = "BQDHYS3B6e1y9imeOZGd8YEXjF1yscw5Ag48s-bB95FyfjIC8b2sGpDP0Ejzq0XAjLEtxTbkQkn5Vn1R5z-ZypWmLBrz3KNE5THyNsu_6M6Amqm8Lso"
            let url = `https://api.spotify.com/v1/search?query=${query}&type=track&offset=0&limit=20`;
            fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => response.json())
                .then(data => {
                    this.tracks = data.tracks.items;

                });
        },
        playTrack(id) {

            if (this.currentTrackId == id) {
                if (this.currentTrackStatus == 'playing') {
                    this.currentTrack.pause();
                    this.currentTrackStatus = 'paused';
                } else {
                    this.currentTrack.play();
                    this.currentTrackStatus = 'playing';
                }
            }

            else {
                let token = "BQDHYS3B6e1y9imeOZGd8YEXjF1yscw5Ag48s-bB95FyfjIC8b2sGpDP0Ejzq0XAjLEtxTbkQkn5Vn1R5z-ZypWmLBrz3KNE5THyNsu_6M6Amqm8Lso"
                let url = `https://api.spotify.com/v1/tracks/${id}`;

                // fetch to /songs/:id to get the song file .mp3 and play it
                fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const previewURL = data.preview_url;
                        return previewURL;
                    })
                    .then(previewURL => {
                        if (previewURL == null) {
                            console.error('No preview URL');
                            socket.emit('getHtmlSpotify', id);
                        }
                        else {
                            fetch(previewURL)
                                .then(response => response.blob())
                                .then(blob => { // blob is the file track.mp3
                                    const audioURL = URL.createObjectURL(blob);
                                    this.currentTrack = new Audio(audioURL);
                                    this.currentTrackId = id;
                                    this.currentTrackStatus = 'playing';
                                    this.currentTrack.play();
                                })
                                .catch(error => {
                                    console.error('Error getting the audio file:', error);
                                });
                        }
                    });
            }



        },
    },
    computed: {

    }
}
</script>

<style scoped>
* {
    color: white;
}

input {
    color: black;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin: 10px 0;
}
</style>