<template>
    <div>
        <button @click="executeScript()">Execute script</button>
    </div>
</template>

<script>

import { socket } from '@/socket';


export default {
    data() {
        return {
            pcStatus: false,
        }
    },
    mounted() {

        socket.emit('getPcStatus');

        socket.on('dirPCStatus', (data) => {
            this.pcStatus = data;
        });

    },
    methods: {
        executeScript() {
            socket.emit('sendBells');
        }
    }
}
</script>

<style scoped></style>