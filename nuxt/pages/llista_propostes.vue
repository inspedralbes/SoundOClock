<script>
export default {
    data() {
        return {
            songs: [],
            filteredSongs: []
        }
    },
    mounted() {
        fetch('http://localhost:8000/api/songs')
        //http://localhost:8080/songs
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.songs = data;
                this.filteredSongs = this.songs;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    },
    methods: {
        applyFilter(filter){            
            switch (parseInt(filter)) {
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
        search(name){
            console.log(name);

            this.filteredSongs = [];

            for (let i = 0; i < this.songs.length; i++) {
                if (this.songs[i].artist.match(name) || this.songs[i].title.match(name)) {
                    this.filteredSongs.push(this.songs[i]);
                }
            }
        }
    },
    computed: {
        
    }
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
