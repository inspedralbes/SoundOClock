<template>
    <div :class="{ 'overflow-hidden max-h-dvh': (modals.alreadyVotedModal || modals.reportModal) }">
        <!-- Reproductor -->
        <ModularPlayer v-if="$device.isDesktop" type="vote" @pause="playTrack($event)" @vote="vote($event.id)"
            @report="report($event)" />
        <MobilePlayer v-else type="vote" @pause="playTrack($event)" @vote="vote($event.id)" @report="report($event)" />

        <!-- Titulo -->
        <h1 :class="{ 'w-full text-center text-5xl font-bold m-2': true, '!text-2xl !mr-1 !ml-1': $device.isMobile }">
            Vota
            la teva
            cançó
            preferida</h1>

        <!-- Barra de busqueda -->
        <div class="w-full flex flex-row justify-center items-center" :class="{ 'flex-col': $device.isMobile }">
            <div class="relative w-[60%] m-2 text-center" :class="{ 'w-[90%]': $device.isMobile }">
                <input type="text" placeholder="Buscar..."
                    class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    :class="{ '!py-1 !text-sm': $device.isMobile }" v-model.lazy="filter">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded"
                    :class="{ 'text-base': $device.isMobile }">
                    search
                </span>
                <button @click="deleteSearch">
                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded"
                        :class="{ 'text-base': $device.isMobile }">
                        Close
                    </span>
                </button>
            </div>
            <select v-model.lazy="orderBy"
                class="w-[150px] appearance-none p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                :class="{ 'text-sm !p-1': $device.isMobile }">
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
            <div v-for="track, index in filteredSongs" :key="index" class="flex flex-row m-2"
                :class="{ 'justify-center': $device.isDesktop }">
                <div class="relative flex items-center">
                    <img :src="track.img" :alt="track.name + '_img'" class="w-20 h-20 m-2 rounded-full"
                        :class="{ '!w-[4rem] !h-[4rem]': $device.isMobile }">
                    <Transition name="playingFade">
                        <div v-if="currentTrackId === track.id && isPlaying"
                            class="absolute left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-full"
                            :class="{ '!w-20 !h-20': $device.isMobile }">
                            <div class="loader"></div>
                        </div>
                    </Transition>
                </div>
                <div class="border-b border-solid border-gray-300 flex flex-row w-3/5 flex justify-between p-2 items-center"
                    :class="{ '!w-full ml-4': $device.isMobile }">
                    <div class="flex flex-col w-[70%]">
                        <p class="font-bold text-base uppercase"
                            :class="{ '!text-sm overflow-hidden': $device.isMobile }">
                            {{ track.title }}</p>
                        <div class="flex flex-row text-sm">
                            <p class="whitespace-nowrap overflow-hidden">
                                {{ track.artist }}
                            </p>
                        </div>
                        <p class="text-sm">Vots: {{ track.votes }}</p>
                    </div>
                    <div :class="{ '!w-[80%] flex flex-row justify-between': $device.isMobile }">
                        <button @click="playTrack(track)">
                            <span v-if="currentTrackId === track.id && isPlaying"
                                class="material-symbols-rounded text-4xl" :class="{ '!text-2xl': $device.isMobile }">
                                pause
                            </span>
                            <span v-else class="material-symbols-rounded text-4xl"
                                :class="{ '!text-2xl': $device.isMobile }">
                                play_arrow
                            </span>
                        </button>
                        <button @click="report(track)">
                            <span class="material-symbols-rounded text-4xl" :class="{ '!text-2xl': $device.isMobile }">
                                report
                            </span>
                        </button>
                        <div v-if="isLoadingVote.state && isLoadingVote.selectedSong == track.id" class="loader-track">
                        </div>
                        <button v-else @click="vote(track.id)">
                            <span
                                :class="{ 'material-symbols-rounded text-4xl': true, 'text-blue-500': isSongVoted(track.id), '!text-2xl': $device.isMobile }">
                                thumb_up
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modales -->
        <!-- Modal que avisa que ya se han efectuado las 2 votaciones -->
        <component :is="activeModal" :open="modals.alreadyVotedModal" @close="modals.alreadyVotedModal = false">
            <template #title>Has arribat al màxim de vots</template>
            <template #content>
                <p>
                    Atenció! En aquesta votació, cada persona disposa d'un màxim de dos vots. Aquesta mesura
                    s'implementa per equilibrar la representació individual amb la capacitat d'influir en múltiples
                    opcions,
                    promovent així la diversitat d'opinions i una participació més àmplia en el procés democràtic.
                    Gràcies
                    per
                    la teva participació!
                </p>
            </template>
        </component>

        <!-- Modal de los reportes -->
        <component :is="activeModal" msg="Reportar" :open="modals.reportModal" @close="modals.reportModal = false"
            @confirm="reportTrack">
            <template #title>Reportar cançó</template>
            <template #content>
                <p>Per quin motiu vols reportar la cançó "{{ reportSongData.reportedSong.title }}" de {{
        reportSongData.reportedSong.artist }}?</p>
                <div class="flex flex-col mt-4">
                    <label v-for="(option, index) in reportSongData.options" class="flex flex-row">
                        <input type="radio" v-model="reportSongData.selectedOption" :value="option"
                            name="report-option">
                        <span class="ml-2">{{ option }}</span>
                    </label>
                </div>
            </template>
        </component>

        <!-- Boton que redirige a la propuesta de canciones -->
        <footer class="fixed bottom-2 w-full flex justify-center align-center">
            <button @click="goToProposar"
                class="w-1/3 m-2 p-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-700"
                :class="{ 'text-sm w-[90%] mb-4': $device.isMobile }">Proposar
                cançó
            </button>
        </footer>
    </div>
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
            userSelectedSongs: computed(() => store.userSelectedSongs),
            store: useAppStore(),
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
            modalSelector: this.$device.isMobile ? 1 : 0,
            modalComponent: {
                0: resolveComponent('ModularModal'),
                1: resolveComponent('MobileModal'),
            }
        }
    },
    created() {
        this.loading = true;
        comManager.getSongs();
        this.loading = false;
    },
    mounted() {
        if (!this.store.getUser().token) {
            navigateTo({ path: '/' });
        }
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
            this.currentTrack.pause();
            this.store.deleteCurrentTrackPlaying();
        },
        vote(songId) {
            if (!this.isLoadingVote.state) {
                if (this.userSelectedSongs && this.userSelectedSongs.votedSongs.length == 2 && !this.userSelectedSongs.votedSongs.includes(songId)) {
                    this.modals.alreadyVotedModal = true;
                } else {
                    this.store.setIsLoadingVote({ state: true, selectedSong: songId });
                    socket.emit('castVote', this.store.getUser().token, songId);
                }
            }
        },
        isSongVoted(songId) {
            if (this.userSelectedSongs && this.userSelectedSongs.votedSongs.includes(songId)) {
                return true;
            } else {
                return false;
            }
        },
        playTrack(track) {
            const store = useAppStore();
            if (this.currentTrackId == track.id) {
                if (this.isPlaying) {
                    this.currentTrack.pause();
                    this.isPlaying = false;
                    store.deleteCurrentTrackPlaying();
                } else {
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    store.setCurrentTrackPlaying(track);
                }
            } else {
                if (track.previewUrl != null) {
                    if (this.currentTrack != null) {
                        this.currentTrack.pause();
                        this.isPlaying = false;
                        store.deleteCurrentTrackPlaying();
                    }
                    this.currentTrack = new Audio(track.previewUrl);
                    this.currentTrackId = track.id;
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    store.setCurrentTrackPlaying(track);
                } else {
                    if (this.currentTrack != null) {
                        this.isPlaying = false;
                        this.currentTrack.pause();
                        store.deleteCurrentTrackPlaying();
                    }
                    store.setCurrentTrackPlaying(track);
                    socket.emit('getHtmlSpotify', track.id);
                    this.isWaitingToPlay = true;
                }
            }
        },
        isOverflowing(index) {
            let nameLength = 0;
            nameLength = this.filteredSongs[index].name ? this.filteredSongs[index].name.length : this.filteredSongs[index].title.length;
            return nameLength > 20;
        }
    },
    watch: {
        songs: { // Each time songs change execute search() method
            handler: 'search',
            immediate: false,
        },
        'currentTrack': {
            handler: function () {
                this.currentTrack.onended = () => {
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                }
            }
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
        activeModal() {
            return this.modalComponent[this.modalSelector];
        },
    },
}

</script>

<style scoped>
.loader {
    width: 45px;
    aspect-ratio: 1;
    --c: no-repeat linear-gradient(#ffffff 0 0);
    background:
        var(--c) 0% 50%,
        var(--c) 50% 50%,
        var(--c) 100% 50%;
    background-size: 20% 100%;
    animation: l1 1s infinite linear;
}

@keyframes l1 {
    0% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }

    33% {
        background-size: 20% 10%, 20% 100%, 20% 100%
    }

    50% {
        background-size: 20% 100%, 20% 10%, 20% 100%
    }

    66% {
        background-size: 20% 100%, 20% 100%, 20% 10%
    }

    100% {
        background-size: 20% 100%, 20% 100%, 20% 100%
    }
}

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

.playingFade-enter-active,
.playingFade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.playingFade-enter-from,
.playingFade-leave-to {
    opacity: 0;
}

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.text-marquee {
    white-space: nowrap;
    animation: marquee 10s linear infinite;
}
</style>
