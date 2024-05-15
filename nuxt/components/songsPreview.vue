<template>
    <div class="bg-gray-400 min-w-40 h-20">
        {{ bells.length }}
        <div v-for="bell in bells">{{ bell.hour }}</div>
        
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
        // this.bells = await comManager.getSelectedSongs();
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
                showedBells.push(this.bells[i - 1]);
            }

            showedBells.push(this.bells[i]);

            if (i < this.bells.length - 1) {
                showedBells.push(this.bells[i + 1]);
            }

            return showedBells;
        },
        calculateShowedBells() {

            const now = this.calculateNow();
            const currentBell = this.calculateCurrentBell(now);
            this.showedBells =  this.getAdjacentBells(currentBell);
            console.log("adjacentBells", this.showedBells);
        }

    },
    watch: {
        'bells'() {
            this.calculateShowedBells();
        },
    },
    computed: {
        bells() {
            // console.log(this.store.getBells());
            return this.store.getBells();
        }
    }
}
</script>

<style scoped></style>