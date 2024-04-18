<template>
    <div>
        <div class="width mx-auto my-5 flex flex-row justify-center">
            <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                v-model="query" @keyup.enter="getSongs()" />
        </div>
        <div v-for="track in filteredTracks"
            class="width mb-3 mx-auto contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
            <div class="contenidor-img">
                <img :src="track.image" :alt="track.name + '_img'" class="rounded-lg">
                <button @click="playTrack(track.spotify_id)" class="rounded-lg"
                    :class="{ playingC: isPlayingCheck(track.spotify_id), noPlaying: !isPlayingCheck(track.spotify_id) }">
                    <!-- fer amb computed la classe -->
                    <span v-if="currentTrackId === track.spotify_id && isPlaying" class="material-symbols-rounded">
                        pause
                    </span>
                    <span v-else class="material-symbols-rounded">
                        play_arrow
                    </span>
                </button>
            </div>

            <div class="song-data">
                <p class="font-black basis-1/2">{{ track.name }}</p>
                <p class="basis-1/2">{{ track.artists }}</p>
            </div>

            <div class="contenidor-butons flex flex-row justify-center items-center gap-1">

                <button @click="modalActual = track.spotify_id" class="hover:rounded-lg hover:bg-black flex">
                    <span class="material-symbols-outlined options-span">
                        unarchive
                    </span>
                </button>
                <ModularModal :open="modalActual === track.spotify_id" @close="modalActual = null"
                    @confirm="removeFromBlacklist(track.spotify_id)">
                    <template v-slot:title>
                        <h2>Segur que vols treure aquesta cançó de la blacklist?</h2>
                    </template>
                    <template v-slot:content>
                        <div class="mx-auto contenidor-canço flex flex-row items-center rounded-lg gap-2">
                            <div class="contenidor-img">
                                <img :src="track.image" :alt="track.name + '_img'" class="rounded-lg">
                                <button @click="playSong(track)" class="rounded-lg"
                                    :class="{ playingC: isPlayingCheck(track.spotify_id), noPlaying: !isPlayingCheck(track.spotify_id) }">
                                    <!-- fer amb computed la classe -->
                                    <span v-if="currentTrackId === track.spotify_id && isPlaying"
                                        class="material-symbols-rounded">
                                        pause
                                    </span>
                                    <span v-else class="material-symbols-rounded">
                                        play_arrow
                                    </span>
                                </button>
                            </div>

                            <div class="song-data">
                                <p class="font-black basis-1/2">{{ track.name }}</p>
                                <p class="basis-1/2">{{ track.artists }}</p>
                            </div>
                        </div>
                    </template>
                </ModularModal>

            </div>
        </div>
        <div class="m-8" v-if="loading">
            <Loader />
        </div>
    </div>
</template>

<script>

import { socket } from '@/socket';
import { useAppStore } from '../../stores/app';

export default {
    data() {
        return {
            loading: true,
            songFile: null,
            query: '',
            tracks: [],
            filteredTracks: [],
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
            modalActual: null,
            status: {
                isPlaying: false,
                currentTrackId: null,
                currentTrack: null,
            }
        }
    },
    computed: {

    },
    mounted() {
        this.loading = true;
        socket.emit('getBlacklist', this.store.getUser().token);

        socket.on('sendBlacklist', (blacklist) => {
            this.tracks = blacklist;
            this.filteredTracks = blacklist;
            this.loading = false;
        });

        socket.on('songRemovedFromBlacklist', (spotify_id) => {
            this.tracks = this.tracks.filter(track => track.spotify_id !== spotify_id);
            this.filteredTracks = this.filteredTracks.filter(track => track.spotify_id !== spotify_id);
        });
    },
    methods: {

        playSong(track) {
            this.store.playTrack(track, this.status);
        },

        getSongs() {
            // search on this.tracks by name or artist and set the results on this.filteredTracks
            if (this.query) {
                this.filteredTracks = this.tracks.filter(track => track.name.toLowerCase().includes(this.query.toLowerCase()) || track.artists.toLowerCase().includes(this.query.toLowerCase()));
            } else {
                this.filteredTracks = this.tracks;
            }
        },

        isPlayingCheck(id) {
            if (this.status.isPlaying && this.status.currentTrackId == id) {
                return true;
            } else if (!this.isPlaying && this.currentTrackId == id) {
                return false;
            }
        },

        removeFromBlacklist(spotify_id) {
            // Remove track from blacklist
            let token = this.store.getUser().token;
            socket.emit('removeFromBlacklist', token, spotify_id);
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
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