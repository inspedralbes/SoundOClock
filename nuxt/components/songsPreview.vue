<template>
    <div class="w-[85%] h-fit max-h-56 z-[999]">
        <div v-if="selectedSongs">
            <div class="px-2 title">ÚLTIMES CANÇONS SONANT</div>
            <div class="max-h-56 overflow-y-scroll">
                <div v-for="song in selectedSongs">
                    <component :is="activeSong" :key="song.id" :track="song" :currentTrackId="songStatus.currentTrackId"
                        :isPlaying="songStatus.isPlaying" @play="playSong" :type="'selected'" class="w-full"
                        :bellId="song.bellId" :isNext="nextBellId === song.bellId" />
                </div>
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
            nextBellId: null,
            mobileDetector: this.$device.isMobile ? 1 : 0,
            songComponent: {
                0: resolveComponent('Song'),
                1: resolveComponent('MobileSong'),
            },
        }
    },
    async created() {
        await comManager.getSelectedSongs();
        await comManager.getBells();
    },
    methods: {
        /**
         * Calculate the current time and format it as a string in "HH:MM" format.
         *
         * This method retrieves the current date and time, extracts the hour and minute components,
         * formats them to always be two digits (padding with a leading zero if necessary), and 
         * returns the formatted time as a string.
         *
         * @returns {string} - The current time in "HH:MM" format.
         */
        calculateNow() {
            // Get the current time
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();

            // Convert current time to a comparable format (HH:MM)
            const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
            return currentTime;
        },
        /**
         * Determine the most recent bell that has rung up to the current time.
         *
         * This method iterates through a list of bell times and finds the index of the last bell 
         * that has a time less than or equal to the provided current time.
         *
         * @param {string} now - The current time in "HH:MM" format.
         * @returns {number} - The index of the most recent bell that has rung. Returns -1 if no bells have rung yet.
         */
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
        /**
         * Get the IDs of the bell at the given index and its adjacent bells.
         *
         * This method retrieves the IDs of the bell at the specified index, as well as the IDs of the
         * preceding and following bells if they exist. It returns an array containing these IDs.
         *
         * @param {number} i - The index of the current bell in the `bells` array.
         * @returns {Array<string>} - An array of bell IDs, including the ID of the bell at index `i` 
         * and the IDs of its adjacent bells if they exist.
         */
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
        /**
         * Retrieve songs associated with the given bell IDs.
         *
         * This method filters the `finalSongsList` array to find songs that are associated with any 
         * of the bell IDs provided in the `bellsId` array. It returns an array of these songs.
         *
         * @param {Array<string>} bellsId - An array of bell IDs for which the corresponding songs are to be retrieved.
         * @returns {Array<Object>} - An array of song objects that are associated with the given bell IDs.
         */
        getShowedSongs(bellsId) {

            let showedSongs = [];
            for (let i = 0; i < this.finalSongsList.length; i++) {
                if (bellsId.includes(this.finalSongsList[i].bellId)) {
                    showedSongs.push(this.finalSongsList[i])
                }
            }

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
            this.nextBellId = this.findNextBell(now, this.selectedSongs);

        },
        findNextBell(now, songs) {

            let bellId = null

            for (let i = 0; i < songs.length; i++) {
                if (songs[i].hour > now) {
                    bellId = songs[i].bellId;
                }
            }

            return bellId;
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

<style scoped>
.title {
    --text-divider-gap: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 0.9375rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.title::before,
.title::after {
    content: '';
    height: 1px;
    background-color: silver;
    flex-grow: 1;
}

.title::before {
    margin-right: var(--text-divider-gap);
}

.title::after {
    margin-left: var(--text-divider-gap);
}
</style>