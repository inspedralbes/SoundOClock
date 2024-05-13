<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">CENSURAR CANÇÓ</h2>
        <div v-if="loading">
            <Loader />
        </div>
        <div v-else>
            <div v-if="reportedSongs.length === 0 && nonReportedSongs.length === 0" class="mt-4  w-full">
                <p class="text-center text-xl">No hi ha cap cançó proposada.</p>
            </div>
            <div v-else class="flex flex-row mt-8">
                <div class="songs-container w-1/3 ml-20 overflow-x-hidden overflow-y-auto">
                    <div class="width mb-8 flex flex-col justify-center ml-auto mr-auto gap-3">
                        <UAlert v-if="reportedSongs.length === 0" color="orange"
                            variant="subtle" title="Actualment no hi ha cap cançó reportada"/>

                        <UAlert v-if="reportedSongs.length > 0" color="orange"
                            variant="subtle" title="Cançons reportades:"/>

                        <button v-for="song in reportedSongs" @click="selectSong(song)"
                            class="flex flex-row justify-between items-center rounded-lg" :class="isSelected(song)">

                            <Song :track="song" :currentTrackId="songStatus.currentTrackId"
                                :isPlaying="songStatus.isPlaying" class="w-full justify-around" @play="playSong"
                                :type="'admin'" :isSelected="selectedSong.id === song.id"
                                :isReported="!areAllReportsRead(song)" />
                        </button>

                        <UAlert v-if="nonReportedSongs.length > 0" color="primary"
                            variant="subtle" title="Cançons NO reportades:"/>

                        <button v-for="song in nonReportedSongs" @click="selectSong(song)"
                            class="flex flex-row justify-between items-center rounded-lg" :class="isSelected(song)">

                            <Song :track="song" :currentTrackId="songStatus.currentTrackId"
                                :isPlaying="songStatus.isPlaying" class="w-full justify-around" @play="playSong"
                                :type="'admin'" :isSelected="selectedSong.id === song.id"
                                :isReported="!areAllReportsRead(song)" />
                        </button>

                    </div>
                </div>
                <div class="w-2/3 text-white text-center ml-4 mr-4">
                    <SongDetails v-bind:song="selectedSong" />
                </div>
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
            store: useAppStore(),
            selectedSong: null,
            areReportedSongs: false,
        }
    },
    created() {
        if (this.store.getProposedSongsAdminView().length === 0) {
            this.store.setLoadingAdminComponent(true);
            comManager.getAdminSongs();
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
        areAllReportsRead(song) {
            if (!song.reports.length > 0) {
                return true;
            }

            for (let i = 0; i < song.reports.length; i++) {
                if (!song.reports[i].isRead) {
                    return false;
                }
            }

            return true;
        },
        playSong(track) {
            this.store.playTrack(track)
        },
    },
    computed: {
        loading() {
            return this.store.getLoadingAdminComponent();
        },
        reportedSongs() {
            // Select only the songs that have reports
            const songs = this.store.getProposedSongsAdminView();
            const reportedSongs = songs.filter(song => song.reports.length > 0);

            // Sort the songs by the number of reports
            reportedSongs.sort((a, b) => b.reports.length - a.reports.length);

            if (reportedSongs.length > 0) {
                this.selectedSong = reportedSongs[0];
                this.areReportedSongs = true;
            }

            return reportedSongs;
        },
        nonReportedSongs() {
            // Select only the songs that have no reports
            const songs = this.store.getProposedSongsAdminView();
            const nonReportedSongs = songs.filter(song => song.reports.length === 0);

            if (nonReportedSongs.length > 0 && !this.areReportedSongs) {
                this.selectedSong = nonReportedSongs[0];
            }

            return nonReportedSongs;
        },
        songStatus() {
            return this.store.getSongStatus();
        }
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
    border-radius: 0.5rem;
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
    border-radius: 0.5rem;
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