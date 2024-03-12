<script>
export default {
    name: 'Canço',
    props: {
        canco: Object
    },
    data() {
        return {
            cancons: []
        }
    },
}


</script>

<template>
    <div class="contenidor-canço flex flex-row justify-between items-center rounded-lg p-3 gap-5">
        <img src="/img/mora-primer-dia-de-clases.jpg" alt="" width="72" height="72" class="rounded-full">
        <div>
            <p class="font-black">{{ canco.title }}</p>
            <p>{{ canco.artist}}</p>
            <p>{{ canco.votes }} vots</p>
        </div>
        <div class="flex flex-row">
            <button>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="48"  height="48"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
            </button>
            <button>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="48"  height="48"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            </button>
            <!--<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /></svg>-->
        </div>
    </div>
</template>

<style scoped>

.contenidor-canço {
    background-color: beige;
}
    
</style>