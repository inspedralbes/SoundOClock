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
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.songs = data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    },
    methods: {
        applyFilter(filter){
            //http://localhost:8080/songs
            
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
            this.songs.sort((a, b) => b.votes - a.votes);
        },
        sortByVotesAscending() {
            this.songs.sort((a, b) => a.votes - b.votes);
        },
        sortByTitleAlphabetically() {
            this.songs.sort((a, b) => a.title.localeCompare(b.title));
        },
        sortByArtistAlphabetically() {
            this.songs.sort((a, b) => a.artist.localeCompare(b.artist));
        },
        search(name){
            console.log(name);

            this.filteredSongs = [];

            for (let i = 0; i < this.songs.length; i++) {
                if (this.songs[i].artist.match(name) || this.songs[i].title.match(name)) {
                    this.filteredSongs.push(this.songs[i]);
                }
            }
            console.log(this.filteredSongs);
        }
    },
    computed: {
        
    }
}

</script>

<template>
    <div class="pt-8 flex flex-col">
        <Cercador @search="search"/>
        <div class="mb-4 px-10">
            <FilterButtons @applyFilter="applyFilter"/>
        </div>
        <div class="w-full px-10 flex flex-col gap-3">
            <Song v-for="song in songs" v-bind:song="song"/>
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
