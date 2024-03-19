<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
export default {
    data() {
        return {
            filteredSongs: [],
            showModal: false,
            showReportModal: false,
            loading: false,
            reportSongData: {
                reportedSong: null,
                options: ["La cançó té contingut inadequat", "La cançó no s'adequa a la temàtica"],
                selectedOption: "La cançó té contingut inadequat"
            }
        }
    },
    mounted() {
        this.loading = true;
        fetch('http://localhost:8080/songs')
            .then(response => response.json())
            .then(data => {
                console.log("songs: ", data);
                this.store.setProposedSongs(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        this.loading = false;
    },
    methods: {
        applyFilter() {
            console.log("AQUEST ES EL FILTRE", this.filter)
            switch (parseInt(this.filter)) {
                case 1:
                    this.sortByVotesDescending();
                    break;
                case 2:
                    this.sortByVotesAscending();
                    break;
                case 3:
                    this.sortByTitleAlphabetically();
                    break;
                case 4:
                    this.sortByArtistAlphabetically();
                    break;
                default:
                    break;
            }
        },
        sortByVotesDescending() {
            this.filteredSongs.sort((a, b) => b.votes - a.votes);
        },
        sortByVotesAscending() {
            this.filteredSongs.sort((a, b) => a.votes - b.votes);
        },
        sortByTitleAlphabetically() {
            this.filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
        },
        sortByArtistAlphabetically() {
            this.filteredSongs.sort((a, b) => a.artist.localeCompare(b.artist));
        },
        search() {
            this.filteredSongs = [];

            for (let i = 0; i < this.songs.length; i++) {
                if (this.songs[i].artist.match(this.searchEngineFilter) || this.songs[i].title.match(this.searchEngineFilter)) {
                    this.filteredSongs.push(this.songs[i]);
                }
            }

            this.applyFilter();
        },
        openModal() {
            this.showModal = true;
            setTimeout(() => {
                this.closeModal();
            }, 1500);
        },
        closeModal() {
            this.showModal = false;
        },
        openReportModal(data) {
            this.reportSongData.reportedSong = data;
            this.showReportModal = true;
        },
        closeReportModal() {
            this.reportSongData.reportedSong = null;
            this.showReportModal = false;
        },
        report() {
            const song = {songId: this.reportSongData.reportedSong.id, option: this.reportSongData.selectedOption };
            socket.emit('reportSong', "4|7lYH7SgPE7o4k3xs8el5UelrwVEtlmSHA90Sn9aQ5bc4fee5", song);
        }
    },
    watch: {
        songs: { // Each time songs change execute search() method
            handler: 'search',
            immediate: false,
        }
    },
    computed: {
        searchEngineFilter() {
            return this.store.getSearchEngineFilter();
        },
        filter() {
            return this.store.getFilter();
        },
        songs() {
            return this.store.getProposedSongs();
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}

</script>

<template>
    <div v-if="loading" class="loading">
        <h2>Loading...</h2>
    </div>
    <div v-else class="flex flex-col">
        <div class="width margen w-4/5 ml-auto mr-auto">
            <Cercador @search="search" />
        </div>
        <div class="width margenb mb-10 w-4/5 ml-auto mr-auto">
            <FilterButtons @applyFilter="applyFilter" />
        </div>
        <div class="width mb-8 flex flex-col justify-center ml-auto mr-auto gap-5">
            <Song v-for="song in filteredSongs" @openModal="openModal" @openReportModal="openReportModal" v-bind:song="song" />
        </div>
        <div @click="showModal = false">
            <transition name="fade">
                <div v-if="showModal" class="modal">
                    <div class="modal-content">
                        <p>JA HAS UTILITZAT ELS TEUS DOS VOTS</p>
                    </div>
                </div>
            </transition>
        </div>
        <div v-if="showReportModal" class="modal">
            <div class="report-modal-content">
                <button type="button" class="float-end bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none" @click="closeReportModal()">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="clear-both flex flex-col justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                        stroke="#960019" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle mb-4">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>
                    <p class="mb-8">Per quin motiu vols reportar la cançó {{ reportSongData.reportedSong.title }} de {{ reportSongData.reportedSong.artist}}?</p>
                    <div class="flex flex-col justify-start items-start mb-4">
                        <label v-for="(option, index) in reportSongData.options" class="mb-2">
                            <input type="radio" v-model="reportSongData.selectedOption" :value="option" name="report-option">
                            <span class="ml-2">{{ option }}</span>
                        </label>
                    </div>
                    <button @click="report()" class="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">REPORTAR</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.width {
    width: 85%;
}

.margen {
    margin-top: 1rem;
}

.margenb {
    margin-bottom: 1rem;
}

/* */

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
}

.modal-content {
    width: 60%;
    text-align: center;
    background-color: white;
    padding: 30px;
    border-radius: 5px;
}

.report-modal-content {
    width: 90%;
    text-align: center;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

@media screen and (min-width: 640px) {
    .width {
        width: 55%;
    }

    .margen {
        margin-top: 2.5rem;
    }

    .margenb {
        margin-bottom: 2.5rem;
    }
}
</style>
