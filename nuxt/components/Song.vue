<script>
//import { socket } from '@/socket';
export default {
    name: 'Song',
    props: {
        song: Object
    },
    data() {
        return {
            
        }
    },
    methods: {
        vote(songId) {
            console.log("VOTED SONG", songId);
            
        }
    }
}


</script>

<template>
    <div class="contenidor-canço flex flex-row justify-between items-center rounded-lg p-3 gap-5">
        <div class="flex flex-row items-center gap-4">
            <img src="/img/mora-primer-dia-de-clases.jpg" alt="" width="60" height="60" class="rounded-lg">
            <div class="song-data">
                <p class="font-black">{{ song.title }}</p>
                <p>{{ song.artist}}</p>
                <p>{{ song.votes }} vots</p>
            </div>
        </div>
        <div class="flex flex-row justify-center items-center gap-1">
            <button>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="36"  height="36"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
            </button>
            <button @click="vote(song.id)">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="36"  height="36"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
            </button>
            <button>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="36"  height="36"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            </button>
            <!--<svg  xmlns="http://www.w3.org/2000/svg"  width="36"  height="36"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /></svg>-->
        </div>
    </div>
</template>

<style scoped>

.contenidor-canço {
    background-color: beige;
}

.song-data {
    min-width: 0px;
    max-width: 160px;
}

.song-data > p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

img {
    width: 60px;
    height: 60px;
}
    
</style>