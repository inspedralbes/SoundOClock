<template>
    <div>
        <div class="h-screen flex justify-center" v-if="loading">
            <Loader />
        </div>
        <div v-else>
            <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">LLISTA NEGRA</h2>
            <div class="width mx-auto my-5 flex flex-row justify-center">
                <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                    v-model="query" @keyup.enter="getSongs()" />
            </div>
            <div v-if="tracks.length == 0" class="mt-4  w-full">
                <p class="text-center text-xl">No hi ha cap cançó bloquejada.</p>
            </div>
            <!-- <div class="w-full" v-if="filteredSongs.length > 0"> -->
            <TransitionGroup name="song-slide" mode="out-in">
                <SongAdmin v-for="track in filteredTracks" :key="track.id" :track="track"
                    :currentTrackId="status.currentTrackId" :isPlaying="status.isPlaying" @play="playSong"
                    @unBan="setSongToUnBan(track), modalActual = true" :type="'unBan'" />
            </TransitionGroup>

            <UModal v-model="modalActual">
                <div>
                    <UAlert title="Estàs segur/a de treure aquesta cançó de la blacklist?"
                        icon="i-heroicons-exclamation-triangle-16-solid" color="orange" variant="subtle" class="p-6">
                        <template #title="{ title }">
                            <span v-html="title" />
                        </template>
                        <template #description>
                            <div>
                                Els usuaris podran tornar a proposar i votar la cançó.
                            </div>
                            <div class="mt-2 flex gap-2">
                                <UButton size="md" color="red" @click="modalActual = false">Enrere</UButton>
                                <UButton size="md" color="primary" @click="removeFromBlacklist(songToUnBan.spotify_id)">
                                    Continuar</UButton>
                            </div>
                        </template>
                    </UAlert>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                        class="absolute right-0 top-0" @click="modalActual = false" />
                </div>
            </UModal>

            <ModularToast v-bind:serverResponse="serverResponse" time="10000" />
        </div>
    </div>
</template>

<script>

import { socket } from '@/socket';
import { useAppStore } from '../../stores/app';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            songFile: null,
            query: '',
            tracks: [],
            songToUnBan: null,
            filteredTracks: [],
            modalActual: false,
            status: {
                isPlaying: false,
                currentTrackId: null,
                currentTrack: null,
            },
        }
    },
    unmounted() {
        this.store.setServerResponse(null);
    },
    computed: {
        serverResponse() {
            return this.store.getServerResponse();
        },
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

        socket.on('deleteError', (data) => {
            this.store.setServerResponse(data);
        });
    },
    methods: {

        setSongToUnBan(track) {
            this.songToUnBan = track;
        },

        playSong(track) {
            this.status = this.store.playTrack(track);
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
            this.modalActual = false;
            let token = this.store.getUser().token;
            socket.emit('removeFromBlacklist', token, spotify_id);
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