<template>
    <div class="ml-20 flex flex-col">
        <div class="mt-20 w-3/4 mx-auto flex justify-center items-center">
            <div class="flex items-center">
                <p class="inline">
                    Estat del PC Direcció:
                </p>
                <span class="ml-2 inline-block h-4 w-4 rounded-full"
                    :class="[pcStatus ? 'bg-green-500' : 'bg-red-500']"></span>
            </div>
        </div>
        <div class="mt-20 mx-auto bg-black h-96 w-2/4 rounded-xl">
            <span class="w-full h-full flex flex-col justify-end">
                {{ pcLogs }}
            </span>

        </div>
        <div class="mt-20 w-2/4 mx-auto flex justify-between">
            <button class="rounded border-2 p-2 bg-green-500 hover:bg-green-700 w-1/4" @click="executeScript()">
                Execute script
            </button>
            <button class="rounded border-2 p-2 bg-green-500 hover:bg-green-700 w-1/4">
                Descarregar cançons
            </button>
        </div>
    </div>
</template>

<script>

import { socket } from '@/socket';


export default {
    data() {
        return {
            pcStatus: false,
            pcLogs: ''
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