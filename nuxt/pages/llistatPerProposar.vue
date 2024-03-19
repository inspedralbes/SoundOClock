<template>
    <div>
        <div class="width mx-auto my-5 flex flex-row justify-center">
            <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..."
                v-model="name" @change="search()"></input>
        </div>
        <div class="width mx-auto contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
            <div class="contenidor-img">
                <img src="/img/mora-primer-dia-de-clases.jpg" alt="" class="rounded-lg">
                <button class="rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="icon icon-tabler icons-tabler-filled icon-tabler-player-play">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                    </svg>
                </button>
            </div>

            <div class="song-data">
                <p class="font-black basis-1/2">titol</p>
                <p class="basis-1/2">artista</p>
            </div>

            <div class="contenidor-butons flex flex-row justify-center items-center gap-1">

                <button class="hover:rounded-lg hover:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="44"
                        height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                    </svg>
                </button>

            </div>
        </div>
    </div>
</template>

<script>

import { useAppStore } from '@/stores/app';

export default {
    data() {
        
    },
}
</script>

<style scoped>
.width {
    width: 85%;
}

.contenidor-canço {
    background-color: rgb(56, 56, 56);
    color: white;
}

.contenidor-canço>*:last-child {
    justify-self: flex-end;
}

.contenidor-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 20%;
    min-width: fit-content;
    height: 100%;
    width: fit-content;
}

.contenidor-img>button {
    display: none;
}

.contenidor-img:hover>button>svg {
    width: 80%;
    height: auto;
}

.contenidor-img:hover>button {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    background-color: rgb(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 100;
}

.song-data {
    display: flex;
    justify-content: space-evenly;
    flex-grow: 1;
    align-items: center;
    max-width: 100%;
    min-width: 5%;
    text-align: center;
}

.song-data>p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.contenidor-butons {
    max-width: 20%;
    min-width: fit-content;
    align-self: center;
}

img {
    width: 60px;
    height: 60px;
}

@media screen and (min-width: 768px) {

    .song-data {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;
    }

    .contenidor-butons {
        max-width: 20%;
        min-width: fit-content;
        align-self: center;
    }

    .width {
        width: 55%;
    }

}

.cercador {
    background-color: white;
    border-radius: 24px;
    height: 40px;
}
</style>