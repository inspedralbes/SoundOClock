<template>
    <div>
        hello
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
        finalList: {
            handler: 'handleResults',
        },
    },
    methods: {
        handleResults() {
            console.log('bells', this.bells)
            console.log('finalSongsList', this.finalSongsList)
        },
    },
    computed: {
        bells() {
            return this.store.getBells();
        },
        finalSongsList() {
            return this.store.getFinalSongsList();
        },
    },
}
</script>

<style lang="scss" scoped></style>