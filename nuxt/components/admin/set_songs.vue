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
                        <div class="text-lg p-3 rounded-lg hour-item mb-2">{{ bell.hour.substring(0, 5) }}</div>
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
        <UButton size="xl" class="px-48" @click="openModal">Guardar</UButton>
    </div>
    <UModal v-model="isModalOpen">
        <div>
            <div v-if="isError">
                <UAlert icon="i-heroicons-x-circle-16-solid" color="red" variant="subtle" title="ERROR!"
                    description="Cada franja horaria ha de tindre una cançó seleccionada." class="p-6" />
            </div>
            <div v-else>
                <UAlert title="Estàs segur/a?" icon="i-heroicons-exclamation-triangle-16-solid" color="orange"
                    variant="subtle" class="p-6">
                    <template #title="{ title }">
                        <span v-html="title" />
                    </template>
                    <template #description>
                        <div>
                            Una vegada guardades les cançons, s'enviaran a la màquina de campanes.
                        </div>
                        <div class="mt-2 flex gap-2">
                            <UButton size="md" color="red" @click="closeModal">Enrere</UButton>
                            <UButton size="md" color="primary" @click="storeSongs">Continuar</UButton>
                        </div>
                    </template>
                </UAlert>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
                @click="isModalOpen = false" />
        </div>
    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            groupedSongs: [],
            mostVotedSongs: [],
            isSelected: {},
            selectedSongs: [],
            toast: null,
            isModalOpen: false,
            isError: false,
        }
    },
    created() {
        comManager.getBells();
        comManager.getSortedVotedSongs();
    },
    mounted() {
        this.toast = useToast();
    },
    watch: {
        bells: {
            handler: 'setLoadingFalse',
        },
        sortedVotedSongs: {
            handler: 'handleSortedVotedSongs',
        }
    },
    methods: {
        setLoadingFalse() {
            if (this.bells.length > 0 && this.groupedSongs.length > 0) {
                this.loading = false;
                this.getMostVotedSongs(this.bells);
            }
        },
        handleSortedVotedSongs() {
            if (this.sortedVotedSongs.length > 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongs);
                this.groupedSongs = result;
                if (this.bells.length > 0) {
                    this.loading = false;
                    this.getMostVotedSongs(this.bells);
                }
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
                        groupedData[song.id] = { id: song.id, votes: song.votes, name: song.name, img: song.img, artists: song.artists, preview_url: song.preview_url };
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

            // If the song is not selected on another bell, set it as selected
            if (this.isSelected[bell] === songId) {
                this.isSelected[bell] = null;
            } else {
                this.isSelected[bell] = songId;
            }
        },
        openModal() {
            // Check that each bell has a song selected
            let numBells = 0;
            for (const key in this.isSelected) {
                numBells++;
                if (!this.isSelected[key]) {
                    this.isError = true;
                    this.isModalOpen = true;
                    return;
                }
            }
            if (numBells !== this.bells.length) {
                this.isError = true;
                this.isModalOpen = true;
                return;
            }
            this.isError = false;
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        storeSongs() {
            this.isModalOpen = false;
            // this.loading = true;

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
                songs.push({ bellId: key, songId: this.isSelected[key], name: song.name, artists: song.artists, img: song.img, preview_url: song.preview_url });
                // songs.push({ bellId: key, songId: this.isSelected[key] });
            }

            comManager.downloadSongs(songs).then(() => {
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
        }
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
    }
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