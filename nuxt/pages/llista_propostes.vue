<template>
    <div :class="{ 'overflow-hidden max-h-dvh': (modals.alreadyVotedModal || modals.reportModal) }">
        <!-- Reproductor -->
        <component :is="activePlayer" :type="getType(currentTrackId)" @pause="playTrack($event)" @vote="vote($event.id)"
            @report="report($event)" @propose="proposeSong($event)" />

        <!-- Titulo -->
        <!-- <h1 :class="{ 'w-full text-center text-5xl font-bold m-2': true, '!text-2xl !mr-1 !ml-1': $device.isMobile }">
            Vota
            la teva
            cançó
            preferida</h1> -->

        <!-- Barra de busqueda -->
        <div class="w-full flex flex-row justify-center items-center" :class="{ 'flex-col': $device.isMobile }">
            <div class="relative w-[60%] m-2 text-center" :class="{ 'w-[90%]': $device.isMobile }">
                <input type="text" placeholder="Buscar..."
                    class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    :class="{ '!py-2 !text-sm': $device.isMobile }" v-model.lazy="filter">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded"
                    :class="{ 'text-base': $device.isMobile }">
                    search
                </span>
                <Transition name="delete-fade">
                    <button v-if="filter" @click="deleteSearch">
                        <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded"
                            :class="{ 'text-base': $device.isMobile }">
                            Close
                        </span>
                    </button>
                </Transition>
            </div>
            <select v-model.lazy="orderBy"
                class="w-[150px] appearance-none p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'text-sm !p-2': $device.isMobile }" :disabled="songs.length == 0">
                <option value="" disabled selected>Filtre</option>
                <option value="votes-desc">Més vots</option>
                <option value="votes-asc">Menys vots</option>
                <option value="title-desc">Títol (A-Z)</option>
                <option value="title-asc">Títol (Z-A)</option>
                <option value="artist-desc">Artista (A-Z)</option>
                <option value="artist-asc">Artista (Z-A)</option>
            </select>

        </div>

        <!-- Listado canciones propuestas -->
        <h2 class="text-center text-3xl font-bold mt-4">Cançons proposades</h2>
        <!-- <TransitionGroup tag="div" class="mb-20" name="song-slide" mode="out-in"> -->
        <div v-if="songs.length === 0" class="mt-4 w-full">
            <p class="text-center text-xl">Encara no s'ha proposat cap cançó.</p>
            <p class="text-center mx-4">Anima't a compartir la teva proposta fent <br v-if="$device.isMobile">
                cercant a
                la barra de búsqueda.</p>
        </div>

        <div v-if="songs.length != 0 && filteredSongs.length === 0" class="mt-4  w-full">
            <p class="text-center text-xl">No hi ha cap cançó proposada amb aquesta cerca.</p>
            <p class="text-center mx-4">Comparteix la teva proposta buscant ara mateix!</p>
        </div>
        <!-- <div class="w-full" v-if="filteredSongs.length > 0"> -->
        <TransitionGroup name="song-slide" mode="out-in">
            <component :is="activeSong" v-for="track in filteredSongs" :key="track.id" :track="track"
                :currentTrackId="currentTrackId" :isPlaying="isPlaying" @play="playTrack" @vote="vote($event)"
                @report="report($event)" :type="getType(track.id)" />
        </TransitionGroup>
        <!-- </div> -->
        <!-- </TransitionGroup> -->


        <!-- Listado de canciones de Spotify -->
        <Transition name="song-slide">
            <h2 v-if="spotifySongs.length > 0" class="text-center text-3xl font-bold mt-10">Resultats de la cerca</h2>
        </Transition>
        <TransitionGroup tag="div" class="mb-20" name="song-slide">
            <component :is="activeSong" v-for="track in spotifySongs" :key="track.id" :track="track"
                :currentTrackId="currentTrackId" :isPlaying="isPlaying" @play="playTrack" @propose="proposeSong($event)"
                :type="getType(track.id)" />
        </TransitionGroup>


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
                <p>Per quin motiu vols reportar la cançó "{{ reportSongData.reportedSong.name }}" de "{{
                    reportSongData.reportedSong.artists.map(artist => artist.name).join(', ') }}"?</p>
                <div class="flex flex-col mt-4">
                    <label v-for="(option, index) in reportSongData.options" class="flex flex-row">
                        <input type="radio" v-model="reportSongData.selectedOption" :value="option"
                            name="report-option">
                        <span class="ml-2">{{ option }}</span>
                    </label>
                </div>
            </template>
        </component>
        <!-- Modal de error al proponer mas de una cancion -->
        <component :is="activeModal" :open="modals.proposeSongError" @close="modals.proposeSongError = false">
            <template #title>
                {{ postedSongStatus.title }}
                <!-- Ja has proposat una cançó -->
            </template>
            <template #content>
                <p class="text-center">
                    {{ postedSongStatus.message }}
                    <!-- Ja has proposat una cançó, espera a que la següent votació per proposar una altra. -->
                </p>
            </template>
        </component>
        <!-- Boton que redirige a la propuesta de canciones -->
        <!-- <footer class="fixed bottom-2 w-full flex justify-center align-center">
            <button @click="goToProposar"
                class="w-1/3 m-2 p-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-700"
                :class="{ 'text-sm w-[90%] mb-4': $device.isMobile }">Proposar
                cançó
            </button>
        </footer> -->
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            filter: '',
            modals: {
                alreadyVotedModal: false,
                reportModal: false,
                proposeSongError: false,
            },
            songs: computed(() => this.store.proposedSongs),
            spotifySongs: [],
            loading: false,
            isLoadingVote: computed(() => this.store.isLoadingVote),
            reportSongData: {
                reportedSong: null,
                options: ["La cançó té contingut inadequat", "La cançó no s'adequa a la temàtica"],
                selectedOption: "La cançó té contingut inadequat"
            },
            orderBy: '',
            userSelectedSongs: computed(() => this.store.userSelectedSongs),
            store: useAppStore(),
            currentTrack: null,
            postedSongStatus: computed(() => this.store.postedSongStatus),
            postedSongId: "",
            currentTrackId: null,
            isPlaying: false,
            mobileDetector: this.$device.isMobile ? 1 : 0,
            // songComponentSelector: this.$device.isMobile ? 1 : 0,
            // playerSelector: this.$device.isMobile ? 1 : 0,
            modalComponent: {
                0: resolveComponent('ModularModal'),
                1: resolveComponent('MobileModal'),
            },
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
            activePlayer: {
                0: resolveComponent('ModularPlayer'),
                1: resolveComponent('MobilePlayer'),
            }
        }
    },
    created() {
        socket.on('searchResult', (results) => {
            this.spotifySongs = results.filter(song => !this.songs.some(existingSong => existingSong.id === song.id));
        });

        socket.on('sendHtmlSpotify', (htmlSpotify, songId) => {
            // Crear un elemento HTML temporal
            const tempElement = document.createElement('div');
            // Establecer el HTML recibido en el elemento temporal
            tempElement.innerHTML = htmlSpotify;
            // Obtener el script por su id
            const scriptElement = tempElement.querySelector('#__NEXT_DATA__');
            // Verificar si se encontró el elemento
            if (scriptElement) {
                // Acceder al contenido JSON dentro del script y convertirlo a objeto JavaScript
                const jsonData = JSON.parse(scriptElement.textContent);
                // Acceder al AudioPreviewURL
                const AudioPreviewURL = jsonData.props.pageProps.state.data.entity.audioPreview.url;
                // Fetch to AudioPreviewURL to get the audio file .mp3
                this.getMp3(AudioPreviewURL, songId);
            } else {
                console.error('No se encontró el script con el id "__NEXT_DATA__" en el HTML recibido');
            }
        });
    },
    mounted() {
        if (!this.store.getUser().token) {
            navigateTo({ path: '/' });
        }
        comManager.getSongs();
        comManager.getUserSelectedSongs(this.store.getUser().id);

        socket.on("voteError", (data) => {
            this.modals.alreadyVotedModal = true;
            this.isLoadingVote.state = false;
        })
    },
    beforeUnmount() {
        if (this.currentTrack != null) {
            this.currentTrack.pause();
        }
        this.store.deleteCurrentTrackPlaying();
        socket.off("voteError");
        socket.off("searchResult");
    },
    methods: {
        getSongs() {
            if (this.filter != '') {
                socket.emit('searchSong', this.filter);
            } else {
                this.spotifySongs = [];
            }
        },
        deleteSearch() {
            this.filter = '';
        },
        getType(trackID) {
            if (this.songs.some(song => song.id === trackID)) {
                return 'vote';
            } else {
                return 'propose';
            }
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
            if (this.currentTrack != null) {
                this.currentTrack.pause();
            }
            this.store.deleteCurrentTrackPlaying();
            this.$router.push('/llistatPerProposar');
        },
        vote(songId) {
            if (!this.isLoadingVote.state) {
                if (this.userSelectedSongsvotedSongs && this.userSelectedSongs.votedSongs.length == 2 && !this.userSelectedSongs.votedSongs.includes(songId)) {
                    this.modals.alreadyVotedModal = true;
                } else {
                    this.store.setIsLoadingVote({ state: true, selectedSong: songId });
                    socket.emit('castVote', this.store.getUser().token, songId);
                }
            }
        },

        getMp3(AudioPreviewURL, songId) {
            let track = this.spotifySongs.find(item => item.id == songId);
            track.preview_url = AudioPreviewURL;
            if (this.isWaitingToPlay) {
                this.playTrack(track);
                this.isWaitingToPlay = false;
            } else if (this.isWaitingToPropose) {
                this.proposeSong(track);
                this.isWaitingToPropose = false;
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
                if (track.preview_url != null) {
                    if (this.isPlaying) {
                        this.currentTrack.pause();
                        this.isPlaying = false;
                        store.deleteCurrentTrackPlaying();
                    }
                    this.currentTrack = new Audio(track.preview_url);
                    this.currentTrackId = track.id;
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    store.setCurrentTrackPlaying(track);
                } else {
                    socket.emit('getHtmlSpotify', track.id);
                    this.isWaitingToPlay = true;
                }
            }
        },

        proposeSong(track) {
            track.loading = true;
            this.postedSongId = track.id;
            if (track.preview_url == null) {
                socket.emit('getHtmlSpotify', track.id);
                this.isWaitingToPropose = true;
            } else {
                let artistList = [];
                track.artists.forEach(artist => {
                    // artistList.push(artist.name);
                    artistList.push({ name: artist.name })
                });
                let song = {
                    id: track.id,
                    name: track.name,
                    artists: artistList,
                    // date: track.album.release_date,
                    img: track.album.images[1].url,
                    preview_url: track.preview_url,
                    submitDate: new Date().toISOString(),
                    submittedBy: this.store.getUser().id,
                }
                socket.emit('postSong', this.store.getUser().token, song);
            }
        },

        isOverflowing(index) {
            let nameLength = 0;
            nameLength = this.filteredSongs[index].name ? this.filteredSongs[index].name.length : this.filteredSongs[index].name.length;
            return nameLength > 20;
        },

        searchBySongId(id) {
            return this.spotifySongs.find(item => item.id == id);
        },
    },
    watch: {
        songs: { // Each time songs change execute search() method
            handler: 'search',
            immediate: false,
        },
        postedSongStatus: {
            handler: function () {
                if (this.postedSongStatus.status == 'error') {
                    this.modals.proposeSongError = true;
                    this.searchBySongId(this.postedSongId).loading = false;
                } else {
                    this.searchBySongId(this.postedSongId).loading = false;
                    this.searchBySongId(this.postedSongId).proposed = true;
                    this.spotifySongs.splice(this.spotifySongs.findIndex(song => song.id === this.postedSongId), 1);
                }
            }
        },
        filter: {
            handler: 'getSongs',
            immediate: false,
        },
        'currentTrack': {
            handler: function () {
                this.currentTrack.onended = () => {
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                }
            }
        },
    },
    computed: {
        filteredSongs() {
            let array = this.songs;

            if (this.spotifySongs.length > 0) {
                // array = array.concat(this.spotifySongs);
            }

            let filtered = array.filter(song => {
                let songName = song.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                let filterText = this.filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                return songName.includes(filterText) ||
                    song.artists.some(artist => {
                        let artistName = artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        return artistName.includes(filterText);
                    });
            });

            switch (this.orderBy) {
                case '':
                    filtered.sort((a, b) => b.totalVotes - a.totalVotes);
                    break;
                case 'votes-desc':
                    filtered.sort((a, b) => b.totalVotes - a.totalVotes);
                    break;
                case 'votes-asc':
                    filtered.sort((a, b) => a.totalVotes - b.totalVotes);
                    break;
                case 'title-desc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'title-asc':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'artist-desc':
                    filtered.sort((a, b) => {
                        let aArtistNames = a.artists.map(artist => artist.name);
                        let bArtistNames = b.artists.map(artist => artist.name);
                        return bArtistNames[0].localeCompare(aArtistNames[0]);
                    });
                    break;
                case 'artist-asc':
                    filtered.sort((a, b) => {
                        let aArtistNames = a.artists.map(artist => artist.name);
                        let bArtistNames = b.artists.map(artist => artist.name);
                        return aArtistNames[0].localeCompare(bArtistNames[0]);
                    });
                    break;
                default:
                    break;
            }

            return filtered;
        },
        activeModal() {
            return this.modalComponent[this.mobileDetector];
        },
        activeSong() {
            return this.songComponent[this.mobileDetector];
        },
        activePlayer() {
            return this.activePlayer[this.mobileDetector];
        }
        
    },
}

</script>

<style scoped>
.song-slide-enter-active,
.song-slide-leave-active,
.song-slide-move {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.song-slide-enter-from,
.song-slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    /* transform: translateY(0); */
}

.delete-fade-enter-active,
.delete-fade-leave-active {
    transition: opacity 0.5s;
}

.delete-fade-enter-from,
.delete-fade-leave-to {
    opacity: 0;
}
</style>
