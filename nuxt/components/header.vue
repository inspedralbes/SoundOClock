<template>
    <div class="header bg-slate-200 p-4">
        <div class="flex flex-row h-full">
            <div>soundo'clock</div>
            <img src="/img/soundoclock-logo-Photoroom.png" alt="" class="h-full">
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';

export default {
    data() {
        return {

        }
    },
    methods: {

    },
    created() {

    },
    computed: {

    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
.header {
    height: 15vh;
}
</style>