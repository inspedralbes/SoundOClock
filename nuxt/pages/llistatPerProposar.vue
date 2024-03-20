<template>
    <div>
        <div class="width mx-auto my-5 flex flex-row justify-center">
            <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                v-model="name" @change="search()"></input>
        </div>
        <div class="width mx-auto contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
            <div class="contenidor-img">
                <img src="/img/mora-primer-dia-de-clases.jpg" alt="" class="rounded-lg">
                <button class="rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="icon icon-tabler icons-tabler-filled icon-tabler-player-play">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                    </svg>
                </button>
            </div>

            <div class="song-data">
                <p class="font-black basis-1/2">titol</p>
                <p class="basis-1/2">artista</p>
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

export default {
    data() {
        return {
            token: '',
            songFile: null,
            query: '',
            tracks: [],
            currentTrack: null,
            currentTrackId: null,
            currentTrackStatus: 'stopped'
        }
    },
    mounted() {
        fetch
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
                    console.log('Pausing song:', this.currentTrackId);
                    this.currentTrack.pause();
                    this.currentTrackStatus = 'paused';
                } else {
                    console.log('Playing song:', this.currentTrackId);
                    this.currentTrack.play();
                    this.currentTrackStatus = 'playing';
                }
            }

            else {
                let token = "BQDHYS3B6e1y9imeOZGd8YEXjF1yscw5Ag48s-bB95FyfjIC8b2sGpDP0Ejzq0XAjLEtxTbkQkn5Vn1R5z-ZypWmLBrz3KNE5THyNsu_6M6Amqm8Lso"
                let url = `https://api.spotify.com/v1/tracks/${id}`;

                console.log('Fectch', url);
                // fetch to /songs/:id to get the song file .mp3 and play it
                fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Data:', data);
                        // const previewURL = data.preview_url;
                        const previewURL = 'https://p.scdn.co/mp3-preview/7aeb039fe573d76389e79dc52c228e9208604fd7'
                        return fetch(previewURL);
                    })
                    .then(response => response.blob())
                    .then(blob => { // blob is the file track.mp3
                        const audioURL = URL.createObjectURL(blob);
                        this.currentTrack = new Audio(audioURL);
                        this.currentTrackId = id;
                        this.currentTrackStatus = 'playing';
                        this.currentTrack.play();
                        console.log("Playing song:", this.currentTrackId);
                    })
                    .catch(error => {
                        console.error('Error getting the audio file:', error);
                    });
            }
        },
    },
    computed: {

    }
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

.contenidor-img>button {
    display: none;
}

.contenidor-img:hover>button>svg {
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

.song-data {
    display: flex;
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