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
        <div class="mt-20 mx-auto bg-black h-96 w-2/4 rounded-xl relative" ref="logContainer">
            <div v-if="logs.length > 0" @click="cleanLogs" class="absolute top-2 right-6 cursor-pointer">
                <span class="material-symbols-rounded">
                    delete
                </span>
            </div>
            <div class="h-full w-full overflow-y-auto flex flex-col-reverse">
                <div class="flex flex-col justify-end">
                    <div v-for="log in logs" class="ml-2">
                        {{ log }}
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-20 w-2/4 mx-auto flex justify-between">
            <button class="rounded border-2 p-2 bg-green-500 hover:bg-green-700 w-1/4" @click="executeScript()">
                Colocar cançons
            </button>
            <button class="rounded border-2 p-2 bg-green-500 hover:bg-green-700 w-1/4" @click="restartPc()">
                Reiniciar Maquina
            </button>
            <button class="rounded border-2 p-2 bg-green-500 hover:bg-green-700 w-1/4" @click="downloadSongs()">
                Descarregar cançons
            </button>
        </div>
    </div>
</template>

<script>

import { socket } from '@/socket';

import comManager from '@/communicationManager.js';


export default {
    data() {
        return {
            pcStatus: false,
            pcLogs: [],
            toast: null,
        }
    },
    mounted() {

        socket.emit('getPcStatus');

        socket.on('dirPCStatus', (data) => {
            this.pcStatus = data;
        });

        socket.on('sendPcDirLogs', (data) => {
            let array = data.split('\n');
            // this.pcLogs.push(array);

            this.pcLogs = this.pcLogs.concat(array);

            // Mover el scroll al final del contenedor de logs
            this.$nextTick(() => {
                this.$refs.logContainer.scrollTop = this.$refs.logContainer.scrollHeight;
            });
        });

        this.toast = useToast();
    },
    computed: {
        logs() {
            return this.pcLogs;
        }
    },
    methods: {
        executeScript() {
            if (this.pcStatus) {
                socket.emit('sendBells');
            } else {
                this.toast.add({
                    title: 'ERROR!',
                    description: 'El PC no està connectat',
                    color: 'red',
                });
            }
        },
        restartPc() {
            if (this.pcStatus) {
                socket.emit('restartPcReq');
            } else {
                this.toast.add({
                    title: 'ERROR!',
                    description: 'El PC no està connectat',
                    color: 'red',
                });
            }
        },
        downloadSongs() {
            comManager.downloadSongs();
        },
        cleanLogs() {
            this.pcLogs = [];
        }
    },
    beforeDestroy() {
        socket.off('dirPCStatus');
        socket.off('sendPcDirLogs');
    }
}
</script>
