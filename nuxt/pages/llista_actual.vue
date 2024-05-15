<template>
    <h2 class="text-4xl text-white text-center font-black mt-8 mb-4">LLISTA ACTUAL</h2>
    <div v-if="loading">
        <div class="w-screen mt-4 mb-5" v-if="loading">
            <div class="mx-3 flex flex-col gap-5">
                <USkeleton class="h-24 w-full" v-for="i in 8" />
            </div>
        </div>
    </div>
    <div v-else>
        <div v-for="song in formattedSongs">
            <component :is="activeSong" :key="song.song.id" :track="song.song"
                :currentTrackId="songStatus.currentTrackId" :isPlaying="songStatus.isPlaying" @play="playSong"
                :type="'selected'" class="w-full" :bellId="song.bellId" :isNext="nextBellId === song.bellId" />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            formattedSongs: [],
            nextBellId: null,
            mobileDetector: this.$device.isMobile ? 1 : 0,
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
        }
    },
    created() {
        if (this.store.getBells().length === 0) {
            comManager.getBells();
        }
        if (this.store.getFinalSongsList().length === 0) {
            comManager.getSelectedSongs();
        }
    },
    watch: {
        bells: {
            handler: 'handleResults',
        },
        finalSongsList: {
            handler: 'handleResults',
        },
    },
    methods: {
        handleResults() {
            if (this.bells.length > 0 && this.finalSongsList.length > 0) {

                // Get the song that will be played on each bell
                const formattedSongs = this.bells.map(bell => {
                    const song = this.finalSongsList.find(song => song.bellId === bell.id);
                    return {
                        bellId: bell.id,
                        bellHour: bell.hour,
                        groups: bell.groups,
                        song: song,
                    }
                });

                // Now get the next bell that will ring
                this.nextBellId = this.findNextBell(formattedSongs);
                this.formattedSongs = formattedSongs;
                this.loading = false;
            }
        },
        playSong(track) {
            this.store.playTrack(track);
        },
        findNextBell(times) {
            // Get the current time
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentSeconds = now.getSeconds();

            // Format current time as a string to compare with the array items
            const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;

            // Filter the times array to only include times that are later than the current time
            const futureTimes = times.filter(time => time.bellHour > currentTimeString);

            // Find the earliest time that is still later than the current time
            const nextTime = futureTimes.length > 0 ? futureTimes.reduce((a, b) => a.bellHour < b.bellHour ? a : b) : null;

            // If there are no future times today, optionally find the earliest time as it will be the next day's time
            return nextTime.bellId || times[0].bellId;
        },
    },
    computed: {
        bells() {
            return this.store.getBells();
        },
        finalSongsList() {
            return this.store.getFinalSongsList();
        },
        songStatus() {
            return this.store.getSongStatus();
        },
        activeSong() {
            return this.songComponent[this.mobileDetector];
        },
    },
}
</script>

<style lang="scss" scoped></style>