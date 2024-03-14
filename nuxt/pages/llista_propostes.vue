<script>
import { useAppStore } from '@/stores/app';
export default {
    data() {
        return {
            filteredSongs: []
        }
    },
    mounted() {

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
        loading() {
            return this.store.getLoading();
        }
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}

</script>

<template>
    <div class="flex flex-col">
        <div class="width margen w-4/5 ml-auto mr-auto">
            <Cercador @search="search" />
        </div>
        <div class="width margenb mb-10 w-4/5 ml-auto mr-auto">
            <FilterButtons @applyFilter="applyFilter" />
        </div>
        <div v-if="loading" class="loading">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin icon icon-tabler icon-tabler-loader-2"
                    width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
            </span>
            <span>
                <p class="text-white">Processant...</p>
            </span>
        </div>
        <div v-else class="width mb-8 flex flex-col justify-center ml-auto mr-auto gap-5">
            <Song v-for="song in filteredSongs" v-bind:song="song" />
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
