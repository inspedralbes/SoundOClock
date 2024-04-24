<template>
    <div>
        <div class="h-screen flex justify-center" v-if="loading">
            <Loader />
        </div>
        <div v-else>
            <div class="width mx-auto my-5 flex flex-row justify-center">
                <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                    v-model="query" @keyup.enter="getSongs()" />
            </div>
            <div v-if="tracks.length == 0" class="mt-4  w-full">
                <p class="text-center text-xl">No hi ha cap cançó bloquejada.</p>
            </div>
            <!-- <div class="w-full" v-if="filteredSongs.length > 0"> -->
            <TransitionGroup name="song-slide" mode="out-in">
                <Song v-for="track in filteredTracks" :key="track.id" :track="track" :currentTrackId="status.currentTrackId"
                    :isPlaying="status.isPlaying" @play="playSong" @unBan="setSongToUnBan(track), modalActual = true"
                    :type="'unBan'" />
            </TransitionGroup>
            <ModularModal :open="modalActual" :msg="'Confirmar'" @close="modalActual = null"
                @confirm="removeFromBlacklist(songToUnBan.spotify_id)">
                <template v-slot:title>
                    <h2>Segur que vols treure aquesta cançó de la blacklist?</h2>
                </template>
                <template v-slot:content>
                    <p>
                        Si treus {{ songToUnBan.name }} de
                        {{ songToUnBan.artists.map(artist => artist.name).join(', ') }}
                        els usuaris podran tornar a votar-la.
                    </p>
                </template>
            </ModularModal>

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
            loading: true,
            songFile: null,
            query: '',
            tracks: [],
            songToUnBan: null,
            filteredTracks: [],
            modalActual: null,
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
            console.log("socket songRemovedFromBlacklist data received");
            this.tracks = this.tracks.filter(track => track.spotify_id !== spotify_id);
            this.filteredTracks = this.filteredTracks.filter(track => track.spotify_id !== spotify_id);
        });

        socket.on('deleteError', (data) => {
            console.log("socket deleteError data received", data)
            this.store.setServerResponse(data);
        });
    },
    methods: {

        setSongToUnBan(track) {
            this.songToUnBan = track;
        },

        playSong(track) {
            this.status = this.store.playTrack(track, this.status);
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