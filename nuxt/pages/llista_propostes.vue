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
        applyFilter(){
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
        search(){
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
        songs: { // Each time the prop course change execute updateChart() method
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
        <div class="mt-8 px-10">
            <Cercador @search="search"/>
        </div>
        <div class="mb-4 px-10">
            <FilterButtons @applyFilter="applyFilter"/>
        </div>
        <div class="w-full mb-8 px-10 flex flex-col gap-3">
            <Song v-for="song in filteredSongs" v-bind:song="song"/>
        </div>
    </div>
</template>

<style scoped>

.contenidor {
    color: white;
    height: 100vh;
    width: 100vw;
    margin: 0;
}
    
</style>
