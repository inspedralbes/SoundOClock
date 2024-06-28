<template>
    <div class="w-screen h-screen">
        <Loader />
    </div>

</template>

<script>
import axios from 'axios';
import { socket } from '@/socket';
import { useAppStore } from "@/stores/app";

export default {
    data() {
        return {

        }
    },
    created() {
        socket.emit('publicLogin');
    },
    methods: {
    },

}
</script>

<style scoped></style>

<!-- LOADER CSS QUE ESTA TO WAPO -->
<!-- https://uiverse.io/csozidev/curly-crab-48 -->