<template>
    <!-- <div :class="{ 'overflow-hidden max-h-dvh': (modals.alreadyVotedModal || modals.reportModal) }"> -->
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
    <h1 v-if="settings.theme" class="mx-auto text-4xl py-8 smallCaps w-full text-center">{{ 'La temàtica és: ' +
        settings.theme }}</h1>
    <div class="w-full flex flex-col justify-center items-center" :class="{ 'flex-col': $device.isMobile }">
        <div class="w-full flex flex-row justify-center items-center">
            <div class="relative w-[60%] m-2 text-center" :class="{ 'w-[90%]': $device.isMobile }">
                <input type="text"
                    :placeholder="settings.theme && settings.theme != '' ? 'La temàtica és: ' + settings.theme : 'Buscar...'"
                    class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    :class="{ '!py-2 !text-sm': $device.isMobile }" v-model="filter" @input="handleInput"
                    @keydown.enter.prevent="acceptInput">
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
            <div class="dropdown relative z-50">
                <button
                    class="w-[150px] appearance-none p-2 rounded-full border border-gray-300 focus:outline-none hover:border-blue-500 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    id="buttonFilters" @click="isFiltersOpen = !isFiltersOpen">
                    Filtres
                </button>
                <div v-if="isFiltersOpen" id="contentDropDownFilters"
                    class="absolute bg-neutral-700 overflow-auto h-96 w-40">

                    <!-- FILTRES PER GRUPS/CATEGORIES -->
                    <div id="filterGroup" class="flex flex-col">
                        <button class="hover:bg-neutral-600" @click="console.log('Tots els cursos')">
                            <strong>Tots els crusos</strong>
                        </button>

                        <div v-for="(category, index) in categories" class="flex flex-col">

                            <button class="hover:bg-neutral-600"
                                @click="console.log('categoria: ', category.abbreviation)">
                                {{ category.abbreviation }}
                            </button>
                        </div>

                    </div>

                    <!-- FILTRES PER HORA -->
                    <div id="filterBell" class="flex flex-col">
                        <button class="hover:bg-neutral-600" @click="filterBell = null">
                            <strong>Tots els horaris</strong>
                        </button>
                        <button class="hover:bg-neutral-600" v-for="bell in bells"
                            @click="filterBell = bell.id">
                            {{ formatTime(bell.hour) }}
                        </button>
                    </div>

                </div>
            </div>
        </div>
        <button @click="
            console.log('sortedSongs: ', sortedVotedSongs);
            console.log('classGroups: ', classGroups);
            console.log('categories: ', categories);
            console.log('bells: ', bells);
        ">
            AAAA
        </button>
        <div class="w-full flex flex-col justify-center items-center overflow-x-auto">
            <div id="buttonsFilterGroup"
                class="w-[70%] overflow-x-auto whitespace-nowrap flex flex-row"
            >
                <button 
                    v-for="(group, index) in classGroups"
                    class="w-[150px] appearance-none p-2 rounded-full border border-gray-300 focus:outline-none hover:border-blue-500 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ group.abbreviation }}
                </button>
            </div>
        </div>


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
        <component :is="activeSong" v-for=" track in filteredSongs " :key="track.id" :track="track"
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
        <component :is="activeSong" v-for=" track in spotifySongs " :key="track.id" :track="track"
            :currentTrackId="currentTrackId" :isPlaying="isPlaying" @play="playTrack" @propose="proposeSong($event)"
            :type="getType(track.id)" />
    </TransitionGroup>


    <!-- Modales -->
    <!-- Modal que avisa que ya se han efectuado las 2 votaciones -->
    <UModal v-model="modals.alreadyVotedModal" class="z-[9999] text-black">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center justify-between rounded-lg">
                    <div class="flex flex-row items-center">
                        <span class="material-symbols-rounded text-[2rem] text-red-500 mr-4">
                            error
                        </span>
                        <h2 class="text-xl font-bold">{{ serverResponse.title }}</h2>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="modals.alreadyVotedModal = false" />
                </div>
            </template>
            {{ serverResponse.message }}
        </UCard>
    </UModal>

    <!-- Modal de los reportes -->
    <UModal v-model="modals.reportModal" class="z-[9999] text-black">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center">
                        <span class="material-symbols-rounded text-[2rem] text-yellow-500 mr-4">
                            warning
                        </span>
                        <h2 class="text-xl font-bold">Reportar cançó</h2>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="modals.reportModal = false" />
                </div>
            </template>

            <p>Per quin motiu vols reportar la cançó <b>'{{ reportSongData.reportedSong.name }}'</b>?</p>
            <!-- <URadioGroup v-model="reportSongData.selectedOption" :options="reportSongData.options" class="mt-4">
            </URadioGroup> -->
            <div class="flex flex-col mt-4">
                <label v-for="( option, index ) in reportSongData.options " class="flex flex-row">
                    <input type="radio" v-model="reportSongData.selectedOption" :value="option" name="report-option">
                    <span class="ml-2">{{ option }}</span>
                </label>
            </div>

            <template #footer>
                <div class="flex justify-end">
                    <div class="flex justify-end space-x-4">
                        <UButton @click="modals.reportModal = false" variant="outline" class="px-4 py-2 text-sm">
                            Cancel·la
                        </UButton>
                        <UButton @click="reportTrack" color="red" class="px-4 py-2 text-sm" v-if="!isReportLoading">
                            Reporta
                        </UButton>
                        <UButton @click="reportTrack" color="red" class="px-4 py-2 text-sm" v-else loading>
                            Reporta
                        </UButton>
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>

    <!-- Modal de error al proponer mas de una cancion -->
    <UModal v-model="modals.proposeSongError" class="z-[9999] text-black">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center">
                        <span class="material-symbols-rounded text-[2rem] text-red-500 mr-4">
                            error
                        </span>
                        <h2 class="text-xl font-bold">{{ postedSongStatus.title }}</h2>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="modals.proposeSongError = false" />
                </div>
            </template>

            {{ postedSongStatus.message }}
        </UCard>
    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            settings: {},
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
            isFiltersOpen: false,
            orderBy: '',
            filterBell: null,
            filterGroup: null,
            groupedSongs: [],
            mostVotedSongsPerBell: [],
            userSelectedSongs: computed(() => this.store.userSelectedSongs),
            store: useAppStore(),
            currentTrack: null,
            postedSongStatus: computed(() => this.store.postedSongStatus),
            postedSongId: "",
            currentTrackId: null,
            isPlaying: false,
            mobileDetector: this.$device.isMobile ? 1 : 0,
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
            activePlayer: {
                0: resolveComponent('ModularPlayer'),
                1: resolveComponent('MobilePlayer'),
            },
            serverResponse: null,
            toast: null,
            isReportLoading: false,
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

        socket.on('sendSettings', (settings) => {
            console.log("settings", settings);
            if (settings != null) {
                this.settings = settings;
            }
        });

        socket.on('songReported', (data) => {
            this.modals.reportModal = false;
            this.isReportLoading = false;

            this.toast.add({
                title: 'Cançó reportada!',
                description: `${data.message}`,
                color: 'green',
            });
        });

        socket.on('reportError', (data) => {
            this.modals.reportModal = false;
            this.isReportLoading = false;

            this.toast.add({
                title: 'Error',
                description: `${data.message}`,
                color: 'red',
            });
        });
    },
    mounted() {
        comManager.getSongs();
        comManager.getBells();
        comManager.getUserSelectedSongs(this.store.getUser().id);

        comManager.getSortedVotedSongs();
        comManager.getPublicGroupsAndCategories().then((data) => {
            this.store.setClassGroups(data.publicGroups);
            this.store.setCategories(data.publicCategories);
        });
        socket.emit('getSettings', this.store.getUser().token);



        socket.on("voteError", (data) => {
            this.serverResponse = data;
            this.modals.alreadyVotedModal = true;
            this.isLoadingVote.state = false;
        })

        this.toast = useToast();
    },
    beforeUnmount() {
        if (this.currentTrack != null) {
            this.currentTrack.pause();
        }
        this.store.deleteCurrentTrackPlaying();
        socket.off("voteError");
        socket.off("searchResult");
        socket.off("sendHtmlSpotify");
        socket.off("sendSettings");
    },
    methods: {
        handleResults() {
            // Check if sortedVoted songs is loaded and set the groupedSongs
            if (this.sortedVotedSongs.length > 0 && this.groupedSongs.length === 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongs);
                this.groupedSongs = result;
                console.log('groupedSongs: ', this.groupedSongs);
            }
            // Check if bells is loaded and set the mostVotedSongs
            if (this.bells.length > 0 && this.groupedSongs.length > 0) {
                this.loading = false;
                this.mostVotedSongsPerBell = this.getMostVotedSongs(this.bells);
                console.log('mostVotedSongsPerBell: ', this.mostVotedSongsPerBell);
            }
        },
        fillMissingGroups(array) {
            let result = []
            let expectedGroup = 1
            let totalGroups = this.classGroups.length

            // Fill in the groups that are missing
            for (let i = 0; i < array.length; i++) {
                while (expectedGroup < parseInt(array[i].group)) {
                    result.push({ group: expectedGroup, songs: [] });
                    expectedGroup++;
                }
                result.push({ group: parseInt(array[i].group), songs: array[i].songs })
                expectedGroup = parseInt(array[i].group) + 1;
            }

            // If last group in the array isn't 11, fill in the remaining groups
            while (expectedGroup <= totalGroups) {
                result.push({ group: expectedGroup, songs: [] });
                expectedGroup++;
            }

            return result;
        },
        getMostVotedSongs(bells) {

            let mostVotedSongsPerBell = bells.map(bell => {
                let groups = bell.groups;
                let result = []
                for (let i = 0; i < groups.length; i++) {
                    let groupId = groups[i].id;
                    let groupSongs = this.groupedSongs.find(group => group.group === groupId);
                    if (groupSongs) {
                        result.push(...groupSongs.songs);
                    }
                }

                // Group by song id
                const groupedData = {};
                result.forEach(song => {
                    if (groupedData[song.id]) {
                        groupedData[song.id].votes += song.votes;
                    } else {
                        groupedData[song.id] = { id: song.id, votes: song.votes, name: song.name, img: song.img, artists: song.artists, preview_url: song.preview_url };
                    }
                });
                const resultArray = Object.values(groupedData);

                // Sort by votes
                resultArray.sort((a, b) => b.votes - a.votes);

                // Return an object with the bell name and the most voted songs
                return { ...bell, songs: resultArray.slice(0, 5) };
            })
            return mostVotedSongsPerBell;
        },
        formatTime(timeString) {
            // Assuming the time is in HH:MM:SS format and for today's date
            const [hours, minutes, seconds] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10));

            // Determine whether to show minutes based on their value
            const options = {
                hour: 'numeric',
                hour12: true
            };
            if (parseInt(minutes, 10) !== 0) {
                options.minute = '2-digit';  // Include minutes if they are non-zero
            }

            // Format the time in AM/PM format, possibly including minutes
            const formattedTime = date.toLocaleTimeString('en-US', options);

            return formattedTime;
        },
        getSongs() {
            if (this.filter != '') {
                socket.emit('searchSong', this.filter);
            } else {
                this.spotifySongs = [];
            }
        },
        handleInput(event) {
            const value = event.target.value;
            if (value.length > 3 || value === '') {
                this.filter = value;
                this.getSongs();
            }
        },
        acceptInput(event) {
            this.filter = event.target.value;
            this.getSongs();
        },
        deleteSearch() {
            this.filter = '';
            this.spotifySongs = [];
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
            this.isReportLoading = true;
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
                // if (this.userSelectedSongsvotedSongs && this.userSelectedSongs.votedSongs.length == 2 && !this.userSelectedSongs.votedSongs.includes(songId)) {
                //     this.modals.alreadyVotedModal = true;
                // } else {
                this.store.setIsLoadingVote({ state: true, selectedSong: songId });
                socket.emit('castVote', this.store.getUser().token, songId);
                // }
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
                    explicit: track.explicit,
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
        'currentTrack': {
            handler: function () {
                this.currentTrack.onended = () => {
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                }
            }
        },
        bells: {
            handler: 'handleResults',
        },
        sortedVotedSongs: {
            handler: 'handleResults',
        },
    },
    computed: {
        filteredSongs() {
            let array = this.songs;
            let filtered;

            // if (this.filter.length < 3) return array;
            if (this.filterBell){
                console.log('filterBell: ', this.filterBell);
                console.log('mostVotedSongsPerBell: ', this.mostVotedSongsPerBell);
                let bell = this.mostVotedSongsPerBell.find(bell => bell.id === this.filterBell);
                if(bell){
                    filtered = bell.songs;
                } else {
                    filtered = [];
                }
            }

            if(!this.filterBell && !this.filterGroup){
                filtered = array.filter(song => {
                    let songName = song.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    let filterText = this.filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
                    return songName.includes(filterText) ||
                        song.artists.some(artist => {
                            let artistName = artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                            return artistName.includes(filterText);
                        });
                });
            }

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
                default:
                    break;
            }

            return filtered;
        },
        activeSong() {
            return this.songComponent[this.mobileDetector];
        },
        activePlayer() {
            return this.activePlayer[this.mobileDetector];
        },
        bells() {
            return this.store.getBells();
        },
        sortedVotedSongs() {
            return this.store.getSortedVotedSongs();
        },
        classGroups() {
            return this.store.getClassGroups();
        },
        categories() {
            return this.store.getCategories();
        },
    },
}

</script>

<style scoped>
#contentDropDownFilters {
    border-radius: 10px;
    padding: 0.5rem;
}

#contentDropDownFilters::-webkit-scrollbar {
    width: 10px;
    /* Ancho de la barra de desplazamiento */
}

#contentDropDownFilters::-webkit-scrollbar-track {
    background: none;
    /* Hacemos transparente el fondo del riel */
}

#contentDropDownFilters::-webkit-scrollbar-thumb {
    background-color: #999;
    /* Color del pulgar */
    border-radius: 10px;
    /* Bordes redondos */
}

#contentDropDownFilters::-webkit-scrollbar-button {
    display: none;
    /* Ocultamos los botones de la barra de desplazamiento */
}

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

.smallCaps {
    font-variant: small-caps;
}
</style>
