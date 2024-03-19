<template>
    <div>
        <h1 class="text-white text-center mb-8">CENSURAR CANÇÓ</h1>
        <div class="flex flex-row">
            <div class="w-1/3 ml-20">
                <div class="width mb-8 flex flex-col justify-center ml-auto mr-auto gap-3">
                    <button v-for="song in songs" @click="selectSong(song)" class="contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
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
                            <p class="font-black basis-1/3">{{ song.title }}</p>
                            <p class="basis-1/3">{{ song.artist }}</p>
                            <p class="basis-1/3">{{ song.votes }} vots</p>
                        </div>
                    </button>
                </div>
            </div>
            <div class="w-2/3 text-white text-center ml-4 mr-8">
                <SongDetails v-bind:song="song"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            songs: [],
            song: null,
        }
    },
    methods: {
        selectSong(selectedSong) {
            this.song = selectedSong;
        }
    },
    mounted() {
        this.loading = true;
        fetch('http://localhost:8080/songs')
            .then(response => response.json())
            .then(data => {
                console.log("CANÇONS: ", data);
                this.songs = data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        this.loading = false;
    },


}
</script>

<style scoped>
.contenidor-canço {
    background-color: rgb(56, 56, 56);
    /* border: 1px solid rgb(163, 163, 163); */
    color: white;
}

.contenidor-canço>*:last-child {
    justify-self: flex-end;
}

.contenidor-img {
    position: relative;
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
    max-width: 100%;
    min-width: 5%;
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
    margin-left: auto;
}

img {
    width: 60px;
    height: 60px;
}

</style>