<template>
    <div>
        <div>
            <div class="searchBar">
                <Cercador></Cercador>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </button>
            </div>
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
        <div v-else class="songList">
            <div class="song" v-for="song in list" :key="song.id">
                <img src="/img/mora-primer-dia-de-clases.jpg" alt="cover">
                <h2 class="mt-2">{{ song.title }}</h2>
                <p class="mt-2">{{ song.artist }}</p>
                <div class="buttons mt-5">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-flag-filled"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z"
                                stroke-width="0" fill="currentColor" />
                        </svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play-filled"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"
                                stroke-width="0" fill="currentColor" />
                        </svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-thumb-up-filled"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z"
                                stroke-width="0" fill="currentColor" />
                            <path
                                d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z"
                                stroke-width="0" fill="currentColor" />
                        </svg>
                    </button>
                </div>
                <p class="text-2xl mt-5">
                    <strong>26 vots</strong>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            loading: false
        }
    },
    async mounted() {
        this.loading = true;
        const response = await fetch('http://localhost:8000/api/songs');
        this.list = await response.json();
        this.loading = false;
    },
    methods: {

    },
    computed: {

    }
}
</script>

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

.searchBar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 0 auto;
    padding: 2% 0 0 0;
    width: 70%;
}

.searchBar>button {
    position: absolute;
    right: 0.7%;
    width: 2.5%;
    height: 100%;
    border: none;
    cursor: pointer;
}

.searchBar>button>svg {
    width: 100%;
    height: 100%;
}

.songList {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 auto 0 auto;
    padding: 2% 0 0 0;
    width: 90%;
}

.song {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 4% 2% 0;
    padding: 2% 0 2% 0;
    width: 18%;
    color: black;
    background-color: #D9D9D9;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 #000000;
}

.song>img {
    width: 60%;
    height: auto;
    border-radius: 10px;
}

.buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    padding: 0;
    width: 80%;

}

.buttons>button {
    border: none;
    cursor: pointer;
    width: 13%;
    height: auto;
}

.buttons>button>svg {
    width: 100%;
}
</style>