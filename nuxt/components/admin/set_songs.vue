<template>
    <h2 class="text-4xl text-white text-center font-black my-8">ESCOLLIR CANÇONS</h2>
    <div class="w-screen h-20" v-if="loading">
        <Loader />
    </div>
    <div v-if="!loading">
        <div class="flex flex-col gap-3 ml-20 mr-8 mb-4">
            <div class="groups-bells-container rounded-lg">
                <div class="schedule-container text-white text-center gap-2 p-2">
                    <div v-for="(bell, index) in bells" class="item bg-gray-400 rounded-lg p-2 h-96 flex flex-col">
                        <div class="text-lg p-3 rounded-lg hour-item mb-2 flex items-center justify-between">
                            <div class="w-full flex flex-col items-start">
                                {{ bell.hour.substring(0, 5) }}
                                <div class="flex flex-row text-sm">
                                    <p v-for="group, index in bell.groups">
                                        <span v-if="index !== 0">, </span>
                                        {{ group.abbreviation }}
                                    </p>
                                </div>
                            </div>
                            <span class="material-symbols-rounded text-4xl cursor-pointer" @click="openAddModal(index)">
                                add_circle
                            </span>
                        </div>
                        <div class="gap-2 flex flex-col overflow-auto">
                            <MobileSong v-for="song in mostVotedSongs[index]" :track="song"
                                :currentTrackId="songStatus.currentTrackId" :isPlaying="songStatus.isPlaying"
                                :bell="bell" :type="'admin'" @play="playSong" @setSelected="setSelected"
                                :isSelected="isSelected[bell.id] === song.id">
                            </MobileSong>
                        </div>
                        <div v-if="!mostVotedSongs[index].length > 0"
                            class="text-xl grow flex items-center justify-center">
                            <span>SENSE CANÇONS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="btn-container fixed bottom-0 w-full flex justify-center items-center">
        <UButton size="xl" class="w-96 flex justify-center" @click="openModal">Guardar</UButton>
    </div>
    <UModal v-model="modals.errorModal">
        <UAlert icon="i-heroicons-x-circle-16-solid" color="red" variant="subtle" title="ERROR!"
            description="Cada franja horaria ha de tindre una cançó seleccionada." class="p-6" />
    </UModal>
    <UModal v-model="modals.confirmationModal">
        <div>
            <UAlert title="Estàs segur/a d'elegir aquestes cançons?" icon="i-heroicons-exclamation-triangle-16-solid"
                color="orange" variant="subtle" class="p-6">
                <template #title="{ title }">
                    <span v-html="title" />
                </template>
                <template #description>
                    <div class="mt-2 flex gap-2">
                        <UButton size="md" color="red" @click="closeModal">Enrere</UButton>
                        <UButton size="md" color="primary" @click="storeSongs">Continuar</UButton>
                    </div>
                </template>
            </UAlert>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
                @click="modals.confirmationModal = false" />
        </div>
    </UModal>

    <!-- Afegir cançons directament a un timbre -->
    <UModal v-model="modals.addModal">
        <div class="p-4">
            <h2 class="text-2xl text-center mb-4">Busca una cançó</h2>
            <div class="relative m-2 text-center">
                <input type="text"
                    class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    v-model="search" @input="handleInput" @keydown.enter.prevent="acceptInput">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded">
                    search
                </span>
                <Transition name="delete-fade">
                    <button v-if="search" @click="deleteSearch">
                        <span class="absolute inset-y-0 right-0 flex items-center pr-3 material-symbols-rounded">
                            Close
                        </span>
                    </button>
                </Transition>
            </div>
            <div class="h-96 overflow-auto">
                <Song v-for="song in spotifySongs" :key="song.id" :track="song" :currentTrackId="currentTrackId"
                    :isPlaying="isPlaying" @play="playTrack" :type="'admin_set_song'" @propose="addSong"
                    :songWaitingToPlay="songWaitingToPlay">
                </Song>
            </div>
        </div>
    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';
import { socket } from '@/socket';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            groupedSongs: null,
            mostVotedSongs: [],
            isSelected: {},
            selectedSongs: [],
            toast: null,
            isError: false,
            modals: {
                errorModal: false,
                confirmationModal: false,
                addModal: false
            },
            search: '',
            spotifySongs: [],
            selectedBellIndex: null,
            currentTrack: null,
            currentTrackId: null,
            isPlaying: false,
            postedSongId: "",
            isWaitingToAdd: false,
            songWaitingToPlay: null,
        }
    },
    created() {
        comManager.getBells();
        comManager.getSortedVotedSongs();
        if (this.store.getClassGroups().length === 0) {
            socket.emit("getGroups");
        }
        // Get provisional selected songs
        socket.emit('updateProvisionalSelectedSongs', null, null);

        socket.on('searchResult', (results) => {
            this.spotifySongs = results;
        });

        socket.on('provisionalSelectedSongsUpdated', (selectedSongs) => {
            this.isSelected = selectedSongs;
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
        this.toast = useToast();
    },
    watch: {
        bells: {
            handler: 'handleResults',
        },
        sortedVotedSongs: {
            handler: 'handleResults',
        },
        classGroups: {
            handler: 'handleResults',
        },
    },
    methods: {
        handleResults() {
            // Check if sortedVoted songs is loaded and set the groupedSongs
            if (this.sortedVotedSongs.length > 0 && !this.groupedSongs && this.classGroups.length > 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongs);
                this.groupedSongs = result;
            }
            // Check if bells is loaded and set the mostVotedSongs
            if (this.bells.length > 0 && this.groupedSongs && this.groupedSongs.length > 0) {
                this.loading = false;
                this.getMostVotedSongs(this.bells);
            }
        },
        fillMissingGroups(array) {
            let result = []

            for (let i = 0; i < this.classGroups.length; i++) {

                let group = array.find(group => parseInt(group.group) === i + 1);

                if (group) {
                    result.push({ group: parseInt(group.group), songs: group.songs });
                } else {
                    result.push({ group: i + 1, songs: [] });
                }
            }

            return result;
        },
        getMostVotedSongs(bells) {

            this.mostVotedSongs = bells.map(bell => {
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
                        groupedData[song.id] = { id: song.id, votes: song.votes, explicit: song.explicit, name: song.name, img: song.img, artists: song.artists, preview_url: song.preview_url };
                    }
                });
                const resultArray = Object.values(groupedData);

                // Sort by votes
                resultArray.sort((a, b) => b.votes - a.votes);

                return resultArray;
            })
        },
        playSong(track) {
            this.store.playTrack(track)
        },
        setSelected(bell, songId) {
            // Check first that the song is not already selected on another bell
            // for (const key in this.isSelected) {
            //     if (this.isSelected[key] === songId && key != bell) {
            //         this.toast.add({
            //             title: 'Error',
            //             description: 'No es poden repetir cançons en diferents campanes.',
            //             color: 'red',
            //         });
            //         return;
            //     }
            // }

            // Update the selected song
            socket.emit('updateProvisionalSelectedSongs', bell, songId)
        },
        openModal() {
            // Check that each bell has a song selected
            let numBells = 0;
            for (const key in this.isSelected) {
                numBells++;
                if (!this.isSelected[key]) {
                    this.modals.errorModal = true;
                    return;
                }
            }
            if (numBells !== this.bells.length) {
                this.modals.errorModal = true;
                return;
            }
            this.modals.confirmationModal = true;
        },
        closeModal() {
            this.modals.confirmationModal = false;
        },
        storeSongs() {
            this.modals.confirmationModal = false;
            const token = this.store.getUser().token;

            let songs = [];
            for (const key in this.isSelected) {
                // Find the song object
                let song = null;
                for (let i = 0; i < this.mostVotedSongs.length; i++) {
                    song = this.mostVotedSongs[i].find(song => song.id === this.isSelected[key]);
                    if (song) {
                        break;
                    }
                }
                songs.push({ bellId: key, id: this.isSelected[key], name: song.name, artists: song.artists, img: song.img, preview_url: song.preview_url });
            }

            comManager.storeSelectedSongs(token, songs).then(() => {
                this.toast.add({
                    title: 'Cançons guardades',
                    description: 'Les cançons s\'han guardat correctament.',
                    color: 'green',
                });
            }).catch(() => {
                this.toast.add({
                    title: 'Error',
                    description: 'Hi ha hagut un error al guardar les cançons.',
                    color: 'red',
                });
            });
        },
        deleteSearch() {
            this.search = '';
            this.spotifySongs = [];
        },
        handleInput(event) {
            const value = event.target.value;
            if (value.length > 3 || value === '') {
                this.search = value;
                this.getSongs();
            }
        },
        acceptInput(event) {
            this.search = event.target.value;
            this.getSongs();
        },
        getSongs() {
            if (this.search != '') {
                socket.emit('searchSong', this.search);
            } else {
                this.spotifySongs = [];
            }
        },
        openAddModal(index) {
            this.selectedBellIndex = index;
            this.modals.addModal = true;
        },
        getMp3(AudioPreviewURL, songId) {
            let track = this.spotifySongs.find(item => item.id == songId);
            track.preview_url = AudioPreviewURL;
            if (this.songWaitingToPlay) {
                this.playTrack(track);
                this.songWaitingToPlay = null;
            } else if (this.isWaitingToAdd) {
                this.addSong(track);
                this.isWaitingToAdd = false;
            }
        },
        playTrack(track) {
            if (this.currentTrackId == track.id) {
                if (this.isPlaying) {
                    this.currentTrack.pause();
                    this.isPlaying = false;
                    this.store.deleteCurrentTrackPlaying();
                } else {
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    this.store.setCurrentTrackPlaying(track);
                }
            } else {
                if (track.preview_url != null) {
                    if (this.isPlaying) {
                        this.currentTrack.pause();
                        this.isPlaying = false;
                        this.store.deleteCurrentTrackPlaying();
                    }
                    this.currentTrack = new Audio(track.preview_url);
                    this.currentTrackId = track.id;
                    this.currentTrack.load();
                    this.currentTrack.play();
                    this.isPlaying = true;
                    this.store.setCurrentTrackPlaying(track);
                } else {
                    this.songWaitingToPlay = track.id;
                    socket.emit('getHtmlSpotify', track.id);
                }
            }
        },
        addSong(track) {
            track.loading = true;
            this.postedSongId = track.id;
            if (track.preview_url == null) {
                socket.emit('getHtmlSpotify', track.id);
                this.isWaitingToAdd = true;
            } else {
                let artistList = [];
                track.artists.forEach(artist => {
                    artistList.push({ name: artist.name })
                });
                let song = {
                    id: track.id,
                    name: track.name,
                    artists: artistList,
                    img: track.album.images[1].url,
                    preview_url: track.preview_url,
                    explicit: track.explicit,
                    submitDate: new Date().toISOString(),
                    submittedBy: this.store.getUser().id,
                }

                // Add song to the bell
                this.mostVotedSongs[this.selectedBellIndex].unshift(song);

                // Close modal and clear search
                this.searchBySongId(this.postedSongId).loading = false;
                this.searchBySongId(this.postedSongId).proposed = true;
                this.search = '';
                this.spotifySongs = [];
                this.modals.addModal = false;

                if (this.currentTrack) {
                    this.currentTrack.pause();
                }
                this.isPlaying = false;
                this.currentTrackId = null;
                this.currentTrack = null;

                // Notify the user
                this.toast.add({
                    title: 'Cançó afegida!',
                    description: 'La cançó s\'ha afegit correctament.',
                    color: 'green',
                });
            }
        },
        searchBySongId(id) {
            return this.spotifySongs.find(item => item.id == id);
        },
    },
    computed: {
        bells() {
            return this.store.getBells();
        },
        sortedVotedSongs() {
            return this.store.getSortedVotedSongs();
        },
        classGroups() {
            return this.store.getClassGroups();
        },
        songStatus() {
            return this.store.getSongStatus();
        },
    },
}
</script>

<style scoped>
.schedule-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.group-item {
    background-color: rgb(56, 56, 56);
    color: white;
}

.hour-item {
    background-color: var(--pedralbes-blue);
}

.groups-bells-container {
    background-color: rgb(56, 56, 56);
}

.btn-container {
    background-color: rgba(0, 0, 0, 0.5);
    height: 5rem;
    box-shadow: 0px -5px 10px 0px rgba(0, 0, 0, 0.5);
}
</style>