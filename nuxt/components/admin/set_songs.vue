<template>
    <h2 class="text-4xl text-white text-center font-black my-8">ESCOLLIR CANÇONS</h2>
    <div class="w-screen h-20" v-if="loading">
        <Loader />
    </div>
    <div v-if="!loading">
        <div class="flex flex-col gap-3 ml-20 mr-8 mb-4">
            <div class="groups-bells-container rounded-lg">
                <div class="schedule-container text-white text-center gap-2 p-2">
                    <div v-for="(bell, index) in bells"
                        class="item bg-gray-400 rounded-lg p-2 h-96 flex flex-col">
                        <div class="text-lg p-3 rounded-lg hour-item mb-2">{{ bell.hour.substring(0, 5) }}</div>
                        <div class="gap-2 flex flex-col overflow-auto">
                            <div v-if="mostVotedSongs[index].length > 0" v-for="song in mostVotedSongs[index]"
                                :key="song.id"
                                class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-2 relative flex flex-row items-center gap-2"
                                :class="{ selected: checkIsSelected(bell.id, song.id) }">

                                <div class="contenidor-img">
                                    <img :src="song.img" :alt="song.title + '_img'" class="rounded-lg">
                                    <button @click="playTrack(song.id)" class="rounded-lg"
                                        :class="{ playingC: isPlayingCheck(song.id), noPlaying: !isPlayingCheck(song.id) }">
                                        <!-- fer amb computed la classe -->
                                        <span v-if="currentTrackId === song.id && isPlaying"
                                            class="material-symbols-rounded">
                                            pause
                                        </span>
                                        <span v-else class="material-symbols-rounded">
                                            play_arrow
                                        </span>
                                    </button>
                                </div>

                                <div class="song-data">
                                    <p class="font-black basis-1/2">{{ song.title }}</p>
                                    <p class="basis-1/2">Vots: {{ song.votes }}</p>
                                </div>

                                <div @click="setSelected(bell.id, song.id)">
                                    <span v-if="!checkIsSelected(bell.id, song.id)"
                                        class="material-symbols-rounded text-5xl text-green-600 cursor-pointer symbol">
                                        check_circle
                                    </span>
                                    <span v-else class="material-symbols-rounded text-5xl cursor-pointer symbol">
                                        emoji_events
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-if="!mostVotedSongs[index].length > 0" class="text-xl grow flex items-center justify-center">
                            <span>SENSE CANÇONS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
            groupedSongs: [],
            mostVotedSongs: [],
            isSelected: {},
            toast: null
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
                console.log("result", result)
                this.groupedSongs = result;
                if(this.bells.length > 0) {
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
                    if(groupSongs) {
                        result.push(...groupSongs.songs);
                    }
                }

                // Group by song id
                const groupedData = {};
                result.forEach(song => {
                    if (groupedData[song.id]) {
                        groupedData[song.id].votes += song.votes;
                    } else {
                        groupedData[song.id] = { id: song.id, votes: song.votes, title: song.title, img: song.img, artist: song.artist, previewUrl: song.previewUrl };
                    }
                });
                const resultArray = Object.values(groupedData);

                // Sort by votes
                resultArray.sort((a, b) => b.votes - a.votes);

                return resultArray;
            })
            console.log("mostVotedSongs", this.mostVotedSongs)
        },
        playTrack(id) {
            if (this.currentTrackId == id) {
                if (this.isPlaying) {
                    this.store.pauseSong();
                } else {
                    this.store.playSong();
                }
            } else {
                if (this.currentTrack) {
                    this.store.pauseSong();
                }
                socket.emit('getHtmlSpotify', id);
            }
        },
        isPlayingCheck(id) {
            return this.isPlaying && this.currentTrackId == id;
        },
        checkIsSelected(bell, songId) {
            return this.isSelected[bell] === songId;
        },
        setSelected(bell, songId) {
            // Check first that the song is not already selected on another bell
            for (const key in this.isSelected) {
                if (this.isSelected[key] === songId && key != bell) {
                    this.toast.add({
                        title: 'Error',
                        description: 'No es poden repetir cançons en diferents campanes.',
                        color: 'red',
                    });
                    return;
                }
            }

            // If the song is not selected on another bell, set it as selected
            if (this.isSelected[bell] === songId) {
                this.isSelected[bell] = null;
            } else {
                this.isSelected[bell] = songId;
            }
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
        currentTrackId() {
            return this.store.getSongStatus().currentTrackId;
        },
        currentTrack() {
            return this.store.getSongStatus().currentTrack;
        },
        isPlaying() {
            return this.store.getSongStatus().isPlaying;
        }
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

.save-button {
    background-color: var(--pedralbes-blue);
}

.selected {
    background-color: rgb(253 224 71);
    color: rgb(56, 56, 56);
}

.symbol {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/** RAUL */

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

.contenidor-img>button>span {
    font-size: 40px;
    color: white;
}

.contenidor-img>button>svg {
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

.playingC {
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
    flex-direction: column;
    overflow: hidden;
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

img {
    width: 60px;
    height: 60px;
}

.noPlaying {
    display: none;
}
</style>