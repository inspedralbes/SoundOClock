<script>
export default {
    data() {
        return {
            songs: [],
            filteredSongs: []
        }
    },
    mounted() {
        fetch('/llistatM.json')
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
        applyFilter(filter) {
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
        search(name) {
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
        <div class="mt-8 w-4/5 ml-auto mr-auto">
            <Cercador @search="search" />
        </div>
        <div class="mb-4 w-4/5 ml-auto mr-auto">
            <FilterButtons @applyFilter="applyFilter" />
        </div>
        <div class="w-4/5 mb-8 flex flex-col justify-center ml-auto mr-auto gap-3">
            <Song v-for="song in filteredSongs" v-bind:song="song" />
        </div>
    </div>
</template>

<style scoped>
.contenidor {
    color: white;
    height: 100%;
    width: 100%;
    margin: 0;
}
</style>
