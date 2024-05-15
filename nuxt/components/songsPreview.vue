<template>
    <div class="bg-gray-400 min-w-40 h-80">
        <div v-if="selectedSongs">
            <div v-for="song in selectedSongs">{{ song }}</div>
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
            
        }

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
        }
    }
}
</script>

<style scoped></style>