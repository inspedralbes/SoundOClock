<template>
    <div class="mt-8 w-[85%] h-fit z-[999]">
        <div v-if="selectedSongs">
            <!-- <div v-for="song in selectedSongs">{{ song }}</div> -->

            <div v-for="song in selectedSongs">
                <component :is="activeSong" :key="song.id" :track="song"
                    :currentTrackId="songStatus.currentTrackId" :isPlaying="songStatus.isPlaying" @play="playSong"
                    :type="'selected'" class="w-full" :bellId="song.bellId"/>
            </div>
        </div>

    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            store: useAppStore(),
            showedBells: null,
            selectedSongs: null,
            mobileDetector: this.$device.isMobile ? 1 : 0,
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
        }
    },
    async created() {
        // this.calculateNow();
        await comManager.getSelectedSongs();
        await comManager.getBells();
    },
    methods: {
        calculateNow() {
            // Get the current time
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();

            // Convert current time to a comparable format (HH:MM)
            const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
            console.log(currentTime)
            return currentTime;
        },
        calculateCurrentBell(now) {
            let lastIndex = -1;

            for (let i = 0; i < this.bells.length; i++) {
                if (this.bells[i].hour <= now) {
                    lastIndex = i;
                } else {
                    break;
                }
            }

            return lastIndex;

        },
        getAdjacentBells(i) {

            let showedBells = [];
            if (i > 0) {
                showedBells.push(this.bells[i - 1].id);
            }

            showedBells.push(this.bells[i].id);

            if (i < this.bells.length - 1) {
                showedBells.push(this.bells[i + 1].id);
            }

            return showedBells;
        },
        getShowedSongs(bellsId) {

            let showedSongs = [];
            for (let i = 0; i < this.finalSongsList.length; i++) {
                if (bellsId.includes(this.finalSongsList[i].bellId)) {
                    showedSongs.push(this.finalSongsList[i])
                }
            }

            console.log("SHOWED SONGS", showedSongs);
            return showedSongs;
        },
        linkSongsWithBells(songs) {

            for (let i = 0; i < songs.length; i++) {

                for (let j = 0; j < this.bells.length; j++) {

                    if (songs[i].bellId == this.bells[j].id) {
                        songs[i].hour = this.bells[j].hour;
                    }

                }

            }

            songs.sort((a, b) => {
                return a.hour.localeCompare(b.hour);
            });

            return songs;

        },
        calculateShowedBells() {

            const now = this.calculateNow();
            const currentBell = this.calculateCurrentBell(now);
            const showedBellsId = this.getAdjacentBells(currentBell);
            const showedSongs = this.getShowedSongs(showedBellsId);
            this.selectedSongs = this.linkSongsWithBells(showedSongs);

        },
        playSong(track) {
            this.store.playTrack(track);
        },

    },
    watch: {
        'bells'() {
            this.calculateShowedBells();
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
    }
}
</script>

<style scoped></style>