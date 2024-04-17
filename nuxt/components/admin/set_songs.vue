<template>
    <h2 class="text-4xl text-white text-center font-black my-8">ESCOLLIR CANÇONS</h2>
    <div class="w-screen h-20" v-if="loading">
        <Loader />
    </div>
    <div v-if="!loading">
        <div class="flex flex-col gap-3 ml-20 mr-8">
            <div class="groups-bells-container rounded-lg">
                <div class="schedule-container text-white text-center gap-4 p-4">
                    <div v-for="(bell, index) in bells"
                        class="item bg-gray-400 rounded-lg p-4 flex flex-col gap-4 min-h-96">
                        <div class="text-lg p-3 rounded-lg hour-item">{{ bell.hour.substring(0, 5) }}</div>
                        <div v-if="bell.groups.length > 0" v-for="song in getMostVotedSongs(bell.groups)" :key="song.id"
                            class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-4 relative">

                            {{ song.name }} - {{ song.votes }}

                        </div>
                        <div v-else class="text-xl grow flex items-center justify-center">
                            <span>SENSE CANÇONS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <Transition name="fade">
        <ModularModal v-if="modals.submitRelations" type="warning" msg="Desar" title="Desar configuració timbres"
            @confirm="submitData()" @close="modals.submitRelations = false">
            <template #title>
                <h2>Desar configuració timbres</h2>
            </template>
<template #content>
                <p>Estàs segur que vols desar la configuració dels timbres?</p>
            </template>
</ModularModal>
</Transition>

<Transition name="fade">
    <ModularModal v-if="modals.bellsWithoutGroups" type="error" title="Hi ha timbres sense grup assignat"
        @close="modals.bellsWithoutGroups = false">
        <template #title>
                <h2>Hi ha timbres sense grup assignat</h2>
            </template>
        <template #content>
                <p>Totes les franges horàries han de tenir com a mínim un grup assignat.</p>
            </template>
    </ModularModal>
</Transition> -->
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
        }
    },
    created() {
        comManager.getBells();
        comManager.getSortedVotedSongs();
    },
    watch: {
        bells: {
            handler: 'setLoadingFalse',
        },
        sortedVotedSongs: {
            handler: 'logSortedVotedSongs',
        }
    },
    methods: {
        setLoadingFalse() {
            if (this.bells.length > 0) {
                this.loading = false;
            }
        },
        logSortedVotedSongs() {
            if (this.sortedVotedSongs.length > 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongs);
                console.log("result", result)
                this.groupedSongs = result;
            }
        },
        fillMissingGroups(array) {
            let result = []
            let expectedGroup = 1
            let totalGroups = this.classGroups.length
            console.log("totalGroups", totalGroups)

            // Fill in the groups that are missing
            for (let i = 0; i < array.length; i++) {
                while (expectedGroup < parseInt(array[i].group)) {
                    result.push({ group: expectedGroup, songs: [] });
                    expectedGroup++;
                }
                // result.push(array[i]);
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
        getMostVotedSongs(groups) {
            let result = []
            for (let i = 0; i < groups.length; i++) {
                let groupId = groups[i].id;
                let groupSongs = this.groupedSongs.find(group => group.group === groupId);
                // console.log("songs", ...groupSongs.songs);
                result.push(...groupSongs.songs);
            }
            console.log("result", result)
            // return result

            // Group by song id
            const groupedData = {};
            result.forEach(song => {
                if (groupedData[song.id]) {
                    groupedData[song.id].votes += song.votes;
                } else {
                    groupedData[song.id] = { id: song.id, votes: song.votes, title: song.name, img: song.img, artist: song.artist, previewUrl: song.previewUrl };
                }
            });
            const resultArray = Object.values(groupedData);

            // Sort by votes
            resultArray.sort((a, b) => b.votes - a.votes);

            console.log("resultArray", resultArray)
            return resultArray;
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
        }
    }
}
</script>

<style scoped>
.schedule-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
</style>