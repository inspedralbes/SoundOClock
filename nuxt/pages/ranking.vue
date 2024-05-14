<template>
    <h2 class="text-4xl text-white text-center font-black my-8">RANKING</h2>
    <div class="w-screen h-20" v-if="loading">
        <div class="mx-3 flex flex-col gap-2">
            <USkeleton class="h-11 w-full" v-for="i in 8" />
        </div>
    </div>
    <div v-if="!loading" class="mx-3">
        <UAccordion color="white" variant="solid" size="xl" :items="itemsAccordion">
            <template #item="item">
                <div v-if="item.item.songs.length == 0">
                    <UAlert title="No hi han cançons!" variant="outline" color="white" class="text-center" />
                </div>
                <div v-for="(song, index) in item.item.songs" :key="song.id" class="flex">
                    <div class="position flex justify-center items-center text-center text-white font-bold text-2xl">
                        {{ index + 1 }}
                    </div>

                    <component :is="activeSong" :key="song.id" :track="song" :currentTrackId="songStatus.currentTrackId"
                        :isPlaying="songStatus.isPlaying" @play="playSong" :type="'ranking'"
                        :isFirstPlace="index === 0" class="w-full justify-around" />
                </div>
            </template>
        </UAccordion>
    </div>
</template>

<script>

import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';
import { socket } from '../socket';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            groupedSongs: [],
            mostVotedSongs: [],
            toast: null,
            itemsAccordion: [],
            mobileDetector: this.$device.isMobile ? 1 : 0,
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
        }
    },
    created() {
        if (this.store.getClassGroups().length === 0) {
            socket.emit("getGroups");
        }
        comManager.getBells();
        comManager.getSortedVotedSongs();
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
        }
    },
    methods: {
        handleResults() {
            // Check if sortedVoted songs is loaded and set the groupedSongs
            if (this.sortedVotedSongs.length > 0 && this.groupedSongs.length === 0 && this.classGroups.length > 0) {
                let result = this.fillMissingGroups(this.sortedVotedSongs);
                this.groupedSongs = result;
            }
            // Check if bells is loaded and set the mostVotedSongs
            if (this.bells.length > 0 && this.groupedSongs.length > 0) {
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

            this.itemsAccordion = bells.map(bell => {
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
                        groupedData[song.id] = { id: song.id, votes: song.votes, name: song.name, img: song.img, artists: song.artists, preview_url: song.preview_url, explicit: song.explicit};
                    }
                });
                const resultArray = Object.values(groupedData);

                // Sort by votes
                resultArray.sort((a, b) => b.votes - a.votes);

                // Return an object with the bell name and the most voted songs
                return { label: this.formatHour(bell.hour), songs: resultArray.slice(0, 5) };
            })
        },
        formatHour(timeString) {
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
        playSong(track) {
            this.store.playTrack(track);
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
        activeSong() {
            return this.songComponent[this.mobileDetector];
        },
    }
}
</script>

<style scoped>
.position {
    width: 10%
}
</style>