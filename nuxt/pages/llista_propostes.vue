<template>
    <div v-if="checkVotingState === 'vote'">
        <!-- Reproductor -->
        <component :is="activePlayer" :type="getType(currentTrackId)" @pause="playTrack($event)" @vote="vote($event.id)"
            @report="report($event)" @propose="proposeSong($event)" />


        <!-- Barra de busqueda -->
        <h1 v-if="settings.theme" class="mx-auto text-4xl py-8 smallCaps w-full text-center">{{ 'La temàtica és: ' +
            settings.theme }}</h1>
        <div class="w-full flex flex-row justify-center items-center" :class="{ 'flex-col': $device.isMobile }">
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
                    {{ this.filterBell ? formatTime(bells.find((bell) => bell.id === this.filterBell).hour) : 'Filtres'
                    }}
                </button>
                <div v-if="isFiltersOpen" id="contentDropDownFilters"
                    class="absolute bg-neutral-700 overflow-auto h-96 w-40">

                    <!-- FILTRES PER ORDRE -->
                    <div id="filterOrderby" class="flex flex-col">
                        <button class="hover:bg-neutral-600 pt-[7px]" @click="orderBy = ''">
                            <strong>Ordenar per</strong>
                        </button>
                        <button :class="orderBy === 'votes-desc' ? 'bg-neutral-600' : 'hover:bg-neutral-600'"
                            @click="orderBy = 'votes-desc'">
                            Més votades
                        </button>
                        <button :class="orderBy === 'votes-asc' ? 'bg-neutral-600' : 'hover:bg-neutral-600'"
                            @click="orderBy = 'votes-asc'">
                            Menys votades
                        </button>
                    </div>

                    <!-- FILTRES PER HORA -->
                    <div id="filterBell" class="flex flex-col">
                        <button class="hover:bg-neutral-600 pt-[7px]" @click="selectBell(null)">
                            <strong>Tots els horaris</strong>
                        </button>
                        <button class="pb-[3px]"
                            :class="filterBell === bell.id ? 'bg-neutral-600' : 'hover:bg-neutral-600'"
                            v-for="bell in bells" @click="selectBell(bell.id)" :key="'bell' + bell.hour">
                            {{ formatTime(bell.hour) }}
                        </button>
                    </div>

                </div>
            </div>
        </div>
        <div class="w-full flex flex-col items-center overflow-x-auto min-h-20">
            <div id="buttonsFilterGroup" class="overflow-x-auto whitespace-nowrap flex flex-row pt-2 pb-2 gap-2">
                <button :class="filterGroup === null ? 'bg-neutral-800' : ''"   
                    class="appearance-none pl-4 pr-4 p-2 rounded-full border border-gray-300 focus:outline-none hover:border-blue-700 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="selectGroup(null)">
                    Tots els grups
                </button>
                <button v-for="(group, index) in groupsAvailable" @click="selectGroup(group.id)"
                    :class="filterGroup === group.id ? 'bg-neutral-800' : ''"
                    class="appearance-none pl-4 pr-4 p-2 rounded-full border border-gray-300 focus:outline-none hover:border-blue-700 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ group.abbreviation }}
                </button>
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
    </div>
    <div v-else>
        <div>
            <h2 class="text-center text-3xl font-bold mt-4">Votació de la temàtica "{{ settings.theme }}" finalitzada
            </h2>
            <p class="text-center">Gràcies per participar. Ara estem en procés de moderació.</p>
        </div>
    </div>
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
    <UModal v-model="modals.alreadyVotedModal" class="z-[9999]">
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
    <UModal v-model="modals.reportModal" class="z-[9999]">
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
    <UModal v-model="modals.proposeSongError" class="z-[9999]">
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
            settings: computed(() => this.store.settings),
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

        socket.emit('getSettings', this.store.getUser().token);

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
            if (this.sortedVotedSongsByGroups.length > 0 && this.groupedSongs.length === 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongsByGroups);
                this.groupedSongs = result;
            }
            // Check if bells is loaded and set the mostVotedSongs
            if (this.bells.length > 0 && this.groupedSongs.length > 0) {
                this.loading = false;
                this.mostVotedSongsPerBell = this.getMostVotedSongs(this.bells);
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
                    let groupSongs = this.sortedVotedSongsByGroups.find(group => parseInt(group.group) === groupId);
                    if (groupSongs) {
                        result.push(...groupSongs.songs);
                    }
                }

                // Group by song id
                const groupedData = {};
                result.forEach(song => {
                    if (groupedData[song.id]) {
                        groupedData[song.id].totalVotes += song.votes;
                    } else {
                        groupedData[song.id] = { id: song.id, totalVotes: song.votes, name: song.name, img: song.img, artists: song.artists, preview_url: song.preview_url };
                    }
                });
                const resultArray = Object.values(groupedData);

                // Sort by votes
                resultArray.sort((a, b) => b.totalVotes - a.totalVotes);

                // Return an object with the bell name and the most voted songs
                return { ...bell, songs: resultArray.slice(0, 5) };
            })
            return mostVotedSongsPerBell;
        },
        formatTime(hourString) {
            // Parseamos la cadena de tiempo en un objeto Date
            let parsedTime = new Date("2000-01-01T" + hourString);

            // Obtenemos las horas y minutos del objeto Date
            let hours = parsedTime.getHours();
            let minutes = parsedTime.getMinutes().toString().padStart(2, '0'); // Siempre queremos que los minutos tengan dos dígitos

            // Formateamos la hora en el formato deseado
            let formattedHour = hours.toString();
            if (hours < 10) {
                formattedHour = "" + formattedHour; // Agregamos un 0 si las horas son menores que 10
            }

            return formattedHour + ":" + minutes;
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
        selectBell(bellId) {
            this.filterBell = bellId;
            this.filterGroup = null
        },
        selectGroup(groupId) {
            this.filterGroup = groupId;
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
        sortedVotedSongsByGroups: {
            handler: 'handleResults',
        },
    },
    computed: {
        filteredSongs() {
            let array = this.songs;
            let filtered = [];


            filtered = array.filter(song => {
                let songName = song.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                let filterText = this.filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                return songName.includes(filterText) ||
                    song.artists.some(artist => {
                        let artistName = artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        return artistName.includes(filterText);
                    });
            });

            if (this.filterBell) {
                let bell = this.mostVotedSongsPerBell.find(bell => bell.id === this.filterBell);
                if (bell) {
                    filtered = bell.songs;

                } else {
                    filtered = [];
                }
            }
            if (this.filterGroup) {
                let filteredByGroup = this.sortedVotedSongsByGroups.find(group => parseInt(group.group) === this.filterGroup);

                if (!filteredByGroup) {
                    filtered = [];
                } else {
                    // forEach song in songs of filteredByGroup, add the attribute totalVotes with the same value of votes
                    filteredByGroup.songs.forEach(song => {
                        song.totalVotes = song.votes;
                    });

                    filtered = filteredByGroup.songs;
                }
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
        sortedVotedSongsByGroups() {
            return this.store.getSortedVotedSongs();
        },
        classGroups() {
            return this.store.getClassGroups();
        },
        groupsAvailable() {
            let groupsAvailable

            if (this.filterBell === null) {
                return this.classGroups;
            }

            if (this.filterBell) {
                // get groups from bell
                groupsAvailable = this.mostVotedSongsPerBell.find(bell => bell.id === this.filterBell).groups;
            }

            return groupsAvailable;
        },
        categories() {
            return this.store.getCategories();
        },
        checkVotingState() {
            let today = new Date();
            let startVote = new Date(this.settings.start_vote);
            let endVote = new Date(this.settings.end_vote);
            let startMod = new Date(this.settings.start_moderation);
            let endMod = new Date(this.settings.end_moderation);
            if (today <= endVote) {
                return "vote";
            } else if (today > startMod && today <= endMod) {
                return "mod";
            } else {
                return "none";
            }
        }
    },
}

</script>

<style scoped>
#buttonsFilterGroup{
    width: calc(60% + 150px);
}
#buttonsFilterGroup::-webkit-scrollbar {
    height: 12px;
    /* Altura de la barra de desplazamiento */
}

#buttonsFilterGroup::-webkit-scrollbar-track {
    background-color: transparent;
}

#buttonsFilterGroup::-webkit-scrollbar-thumb {
    background-color: #888;
    /* Color del botón de la barra de desplazamiento */
    border-radius: 5px;
    /* Radio de borde del botón de la barra de desplazamiento */
}

#buttonsFilterGroup::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* Color del botón de la barra de desplazamiento al pasar el mouse */
    cursor: grab;
}

#buttonsFilterGroup::-webkit-scrollbar-thumb:active {
    background-color: #333;
    /* Color del botón de la barra de desplazamiento cuando está siendo activo */
    cursor: grabbing;
}


#contentDropDownFilters {
    border-radius: 10px;
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

#contentDropDownFilters::-webkit-scrollbar-thumb:hover {
    background-color: #666;
    /* Color del pulgar al pasar el mouse */
    cursor: grab;
}

#contentDropDownFilters::-webkit-scrollbar-thumb:active {
    background-color: #333;
    /* Color del pulgar cuando está siendo activo */
    cursor: grabbing;
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
