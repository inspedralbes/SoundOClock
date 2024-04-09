<template>
    <!-- Reproductor -->
    <ModularPlayer type="vote" @pause="playTrack($event)" />

    <!-- Titulo -->
    <h1 class="w-full text-center text-5xl font-bold m-2">Vota la teva cançó preferida</h1>

    <!-- Barra de busqueda -->
    <div class="w-full flex justify-center items-center">
        <div class="relative w-[60%] m-2 text-center">
            <input type="text" placeholder="Buscar..."
                class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                v-model.lazy="filter">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded">
                search
            </span>
            <button @click="deleteSearch">
                <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded">
                    Close
                </span>
            </button>
        </div>
        <select v-model.lazy="orderBy"
            class="w-[150px] appearance-none p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-center">
            <option value="votes-desc">Més vots</option>
            <option value="votes-asc">Menys vots</option>
            <option value="title-desc">Títol (A-Z)</option>
            <option value="title-asc">Títol (Z-A)</option>
            <option value="artist-desc">Artista (A-Z)</option>
            <option value="artist-asc">Artista (Z-A)</option>
        </select>

    </div>

    <!-- Listado canciones -->
    <div class="mb-20">

        <div v-for="track, index in filteredSongs" :key="index" class="flex flex-row justify-center m-2">
            <div class="relative">
                <img :src="track.img" :alt="track.name + '_img'" class="w-20 h-20 m-2 rounded-full">
                <Transition name="playingFade">
                    <div v-if="currentTrackId === track.id && isPlaying"
                        class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-full">
                        <div class="loader"></div>
                    </div>
                </Transition>
            </div>
            <div
                class="border-b border-solid border-gray-300 flex flex-row w-3/5 flex justify-between p-2 items-center">
                <div class="flex flex-col w-[70%]">
                    <p class="font-bold text-base uppercase">{{ track.title }}</p>
                    <div class="flex flex-row text-sm">
                        <p class="whitespace-nowrap overflow-hidden">
                            {{ track.artist }}
                        </p>
                    </div>
                    <p>Vots: {{ track.votes }}</p>
                </div>
                <button @click="playTrack(track)">
                    <span v-if="currentTrackId === track.id && isPlaying" class="material-symbols-rounded text-4xl">
                        pause
                    </span>
                    <span v-else class="material-symbols-rounded text-4xl">
                        play_arrow
                    </span>
                </button>
                <button @click="report(track)">
                    <span class="material-symbols-rounded text-4xl">
                        report
                    </span>
                </button>
                <div v-if="isLoadingVote.state && isLoadingVote.selectedSong == track.id" class="loader-track"></div>
                <button v-else @click="vote(track.id)">
                    <span class="material-symbols-rounded text-4xl" :class="{ 'text-blue-500': isSongVoted }">
                        thumb_up
                    </span>
                </button>
            </div>
        </div>
    </div>
    <!-- Modales -->
    <!-- Modal que avisa que ya se han efectuado las 2 votaciones -->
    <ModularModal v-if="modals.alreadyVotedModal" @close="modals.alreadyVotedModal = false">
        <template #title>Màxims vots aconseguits</template>
        <template #content>
            <p>
                Atenció! En aquesta votació, cada persona disposa d'un màxim de dos vots. Aquesta mesura
                s'implementa per equilibrar la representació individual amb la capacitat d'influir en múltiples opcions,
                promovent així la diversitat d'opinions i una participació més àmplia en el procés democràtic. Gràcies
                per
                la teva participació!
            </p>
        </template>
    </ModularModal>

    <!-- Modal de los reportes -->
    <ModularModal msg="Reportar" v-if="modals.reportModal" @close="modals.reportModal = false" @confirm="reportTrack">
        <template #title>Reportar cançó</template>
        <template #content>
            <p>Per quin motiu vols reportar la cançó "{{ reportSongData.reportedSong.title }}" de {{
                reportSongData.reportedSong.artist }}?</p>
            <div class="flex flex-col">
                <label v-for="(option, index) in reportSongData.options" class="flex flex-row">
                    <input type="radio" v-model="reportSongData.selectedOption" :value="option" name="report-option">
                    <span class="ml-2">{{ option }}</span>
                </label>
            </div>
        </template>
    </ModularModal>

    <!-- Boton que redirige a la propuesta de canciones -->
    <footer class="fixed bottom-2 w-full flex justify-center align-center">
        <button @click="goToProposar"
            class="w-1/3 m-2 p-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-700">Proposar
            cançó
        </button>
    </footer>

</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';

export default {
    data() {
        const store = useAppStore();
        return {
            filter: '',
            modals: {
                alreadyVotedModal: false,
                reportModal: false
            },
            loading: false,
            isLoadingVote: computed(() => store.isLoadingVote),
            reportSongData: {
                reportedSong: null,
                options: ["La cançó té contingut inadequat", "La cançó no s'adequa a la temàtica"],
                selectedOption: "La cançó té contingut inadequat"
            },
            orderBy: 'votes-desc',
        }
    },
    created() {
        this.loading = true;
        // comManager.getUserSelectedSongs(this.store.getUser().id);
        comManager.getSongs();
        this.loading = false;
    },
    methods: {
        deleteSearch() {
            this.filter = '';
        },
        report(track) {
            this.modals.reportModal = true;
            this.reportSongData.reportedSong = track;
        },
        reportTrack() {
            const song = { songId: this.reportSongData.reportedSong.id, option: this.reportSongData.selectedOption };
            socket.emit('reportSong', this.store.getUser().token, song);
        },
        goToProposar() {
            this.$router.push('/llistatPerProposar');
        },
        vote(songId) {
            if (!this.isLoadingVote.state) {
                if (this.userSelectedSongs && this.userSelectedSongs.votedSongs.length == 2 && !this.userSelectedSongs.votedSongs.includes(songId)) {
                    // this.$emit('openModal');
                } else {
                    this.store.setIsLoadingVote({ state: true, selectedSong: songId });
                    socket.emit('castVote', this.store.getUser().token, songId);
                }
            }
        },
    },
    watch: {
        songs: { // Each time songs change execute search() method
            handler: 'search',
            immediate: false,
        }
    },
    computed: {
        songs() {
            let songs = this.store.getProposedSongs();
            return songs;
        },
        filteredSongs() {
            let filtered = this.songs.filter(song =>
                song.title.toLowerCase().includes(this.filter.toLowerCase()) ||
                song.artist.toLowerCase().includes(this.filter.toLowerCase())
            );

            switch (this.orderBy) {
                case 'votes-desc':
                    filtered.sort((a, b) => b.votes - a.votes);
                    break;
                case 'votes-asc':
                    filtered.sort((a, b) => a.votes - b.votes);
                    break;
                case 'title-desc':
                    filtered.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-asc':
                    filtered.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'artist-desc':
                    filtered.sort((a, b) => a.artist.localeCompare(b.artist));
                    break;
                case 'artist-asc':
                    filtered.sort((a, b) => b.artist.localeCompare(a.artist));
                    break;
                default:
                    break;
            }

            return filtered;
        },
        isSongVoted() {
            if (this.userSelectedSongs && this.userSelectedSongs.votedSongs.includes(songId)) {
                return true;
            } else {
                return false;
            }
        }

    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}

</script>

<style scoped>
.loader-track {
    width: 35px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffffff;
    --_m:
        conic-gradient(#0000 10%, #000),
        linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
}

@keyframes l3 {
    to {
        transform: rotate(1turn)
    }
}
</style>
