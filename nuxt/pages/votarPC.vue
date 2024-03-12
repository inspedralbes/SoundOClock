<template>
    <div>
        <div>
            <div class="searchBar">
                <input type="text" placeholder="Buscar">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="44"
                        height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="song" v-for="song in list" :key="song.id">
            <h2>{{ song.title }}</h2>
            <p>{{ song.artist }}</p>
            <p>{{ song.year }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    async mounted() {
        const response = await fetch('http://localhost:8000/api/songs');
        this.list = await response.json();
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped>
* {
    color: white;
}

.searchBar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    width: 70%;
}

.searchBar>input {
    padding: 10px;
    border: none;
    border-radius: 50px;
}

.searchBar>button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #1db954;
    cursor: pointer;
}
</style>