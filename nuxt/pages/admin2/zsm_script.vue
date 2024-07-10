<template>
    <ModularAdminLayout title="Gestió de la megafonía">
        <div class="m-4">
            <!-- PC Status -->
            <div class="flex justify-center items-center mb-8">
                <div class="flex items-center space-x-2">
                    <p class="text-lg text-white">
                        Estat del PC Direcció:
                    </p>
                    <span :class="[pcStatus ? 'bg-green-500' : 'bg-red-500']" class="h-4 w-4 rounded-full"></span>
                </div>
            </div>

            <!-- Terminal -->
            <div class="bg-black rounded-xl shadow-lg overflow-hidden mb-8">
                <div class="bg-gray-800 text-white p-3 flex justify-between items-center">
                    <div class="flex items-center text-gray-500 terminal">
                        <span class="material-symbols-rounded mr-2">terminal</span>
                        <span class="text-base font-semibold">Terminal</span>
                    </div>
                    <div v-if="logs.length > 0" @click="cleanLogs"
                        class="cursor-pointer hover:text-red-500 transition-colors">
                        <span class="material-symbols-rounded">delete</span>
                    </div>
                </div>
                <div class="h-96 overflow-y-auto p-3 bg-black">
                    <div class="flex flex-col-reverse">
                        <div v-for="log in logs" class="terminal text-green-400 font-mono whitespace-pre-line mb-2">
                            {{ log }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
                <button
                    class="flex items-center justify-center rounded p-3 bg-sky-500 hover:bg-blue-700 w-1/4 text-white transition-colors"
                    @click="executeScript()">
                    <span class="material-symbols-rounded mr-2">playlist_add</span>
                    Col·locar cançons
                </button>
                <button
                    class="flex items-center justify-center rounded p-3 bg-red-500 hover:bg-red-700 w-1/4 text-white transition-colors"
                    @click="restartPc()">
                    <span class="material-symbols-rounded mr-2">refresh</span>
                    Reiniciar màquina
                </button>
                <button
                    class="flex items-center justify-center rounded p-3 bg-primary-500 hover:bg-primary-700 w-1/4 text-white transition-colors"
                    @click="downloadSongs()">
                    <span class="material-symbols-rounded mr-2">cloud_download</span>
                    Descarregar cançons
                </button>
            </div>
        </div>
    </ModularAdminLayout>
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
<style>
.terminal {
    font-family: 'Courier New', Courier, monospace;
}
</style>