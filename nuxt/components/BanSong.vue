<template>
    <div v-if="!loading">
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">CENSURAR CANÇÓ</h2>
        <div class="flex flex-row mt-8">
            <div class="songs-container w-1/3 ml-20 overflow-y-auto">
                <div class="width mb-8 flex flex-col justify-center ml-auto mr-auto gap-3">
                    <button v-for="song in songs" @click="selectSong(song)"
                        class="flex flex-row justify-between items-center rounded-lg p-3" :class="isSelected(song)">
                        <div class="flex flex-row items-center gap-2">
                            <div class="contenidor-img">
                                <img :src="song.img" alt="Song img" class="rounded-lg">
                                <button class="rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="icon icon-tabler icons-tabler-filled icon-tabler-player-play">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                                    </svg>
                                </button>
                            </div>
                            <div class="song-data text-start">
                                <p class="font-black basis-1/3">{{ song.title }}</p>
                                <p class="basis-1/3">{{ song.artist }}</p>
                                <p class="basis-1/3">{{ song.votes }} vots</p>
                            </div>
                        </div>
                        <div v-if="song.reports.length > 0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                fill="rgb(239 68 68)"
                                class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            <div class="w-2/3 text-white text-center ml-4 mr-4">
                <SongDetails v-bind:song="selectedSong" />
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            loading: true,
            selectedSong: null,
        }
    },
    methods: {
        selectSong(selectedSong) {
            this.selectedSong = selectedSong;
        },
        isSelected(song) {
            let style = "song-item--not-selected";

            if (song.id == this.selectedSong.id) {
                style = "song-item--selected";
            }

            return style;
        },
    },
    created() {
        this.loading = true;
        comManager.getAdminSongs();
        this.loading = false;
    },
    computed: {
        songs() {
            this.selectedSong = this.store.getProposedSongsAdminView()[0];
            return this.store.getProposedSongsAdminView();
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>

.songs-container {
  height: 85vh;
}

.song-item--not-selected {
    background-color: rgb(56, 56, 56);
    color: white;
}

.song-item--selected {
    background-color: white;
    color: rgb(56, 56, 56);
}

.song-item>*:last-child {
    justify-self: flex-end;
}

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