<script>
import { socket } from '../socket';
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
            if (this.userSelectedSongs.votedSongs.length == 2 && !this.userSelectedSongs.votedSongs.includes(songId)) {
                this.$emit('openModal');
            } else {
                socket.emit('castVote', 1, songId);
            }
        },
        isSongVotedColor(songId) {
            if (this.userSelectedSongs.votedSongs.includes(songId)) {
                return "#83aee4";
            } else {
                return "currentColor";
            }
        },
        isSongVotedFill(songId) {
            if (this.userSelectedSongs.votedSongs.includes(songId)) {
                return "#83aee4";
            } else {
                return "none";
            }
        },
    },
    computed: {
        userSelectedSongs() {
            return this.store.getUserSelectedSongs();
        }
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}

</script>

<template>
    <div class="contenidor-canço flex flex-row items-center rounded-lg p-3 gap-2">
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
            <p class="font-black basis-1/4">{{ song.title }}</p>
            <p class="basis-2/4">{{ song.artist }}</p>
            <p class="basis-1/4">{{ song.votes }} vots</p>
        </div>

        <div class="contenidor-butons flex flex-row justify-center items-center gap-1">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                </svg>
            </button>
            <button @click="vote(song.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" :fill="isSongVotedFill(song.id)"
                    :stroke="isSongVotedColor(song.id)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                </svg>
            </button>
            <!--<svg  xmlns="http://www.w3.org/2000/svg"  width="36"  height="36"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /></svg>-->
        </div>
    </div>
</template>

<style scoped>
.contenidor-canço {
    background-color: rgb(56, 56, 56);
    /* border: 1px solid rgb(163, 163, 163); */
    color: white;
}

.contenidor-canço>*:last-child {
    justify-self: flex-end;
}

.contenidor-img {
    position: relative;
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
    max-width: 60%;
    min-width: 5%;
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
    margin-left: auto;
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

}
</style>