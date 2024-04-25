<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">RELACIONAR GRUPS AMB TIMBRES</h2>
        <div class="m-8" v-if="bells.length === 0">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-col gap-3 mt-8 ml-20 mr-8">
                <div class="bg-gray-400 rounded-lg users-container p-4">
                    <span class="text-lg font-bold">GRUPS DISPONIBLES</span>
                    <div class="flex flex-row gap-3 py-4 overflow-x-auto">
                        <div v-for="group in classGroups"
                            class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-4"
                            draggable="true" @dragstart="startDrag($event, group)">
                            {{ group.abbreviation }}
                        </div>
                    </div>
                </div>
                <div class="groups-bells-container rounded-lg">
                    <button class="pedralbes-button w-fit text-white font-bold mt-4 ml-4 py-2 px-4 rounded"
                        @click="saveBellsGroupsRelation()">DESAR TIMBRES</button>

                    <div class="text-white text-center flex flex-row gap-4 p-4 overflow-x-auto">
                        <div v-for="bell in bells" class="bg-gray-400 rounded-lg p-4 flex flex-col gap-4 min-h-96"
                            @drop="onDrop($event, bell)" @dragenter.prevent @dragover.prevent>
                            <div class="text-lg min-w-40 h-20 p-6 rounded-lg hour-item">{{ bell.hour.substring(0, 5) }}
                            </div>
                            <div v-if="bell.groups.length > 0" v-for="group in bell.groups"
                                class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-4 relative">
                                <span>{{ group.abbreviation }}</span>
                                <button
                                    class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold rounded-full p-1 absolute top-2 right-2"
                                    @click="deleteGroup(bell, group)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M18 6l-12 12" />
                                        <path d="M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div v-else class="px-6 pb-10 text-xl grow width-150 flex justify-center items-center">
                                <span class="text-center">SENSE GRUPS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModularModal :open="modals.submitRelations" type="warning" msg="Desar" title="Desar configuració timbres"
        @confirm="submitData()" @close="modals.submitRelations = false">
        <template #title>
            <h2>Desar configuració timbres</h2>
        </template>
        <template #content>
            <p>Estàs segur que vols desar la configuració dels timbres?</p>
        </template>
    </ModularModal>

    <ModularModal :open="modals.bellsWithoutGroups" type="error" title="Hi ha timbres sense grup assignat"
        @close="modals.bellsWithoutGroups = false">
        <template #title>
            <h2>Hi ha timbres sense grup assignat</h2>
        </template>
        <template #content>
            <p>Totes les franges horàries han de tenir com a mínim un grup assignat.</p>
        </template>
    </ModularModal>

    <ModularToast v-bind:serverResponse="serverResponse" time="10000"/>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';
import { socket } from '@/socket';

export default {
    data() {
        const store = useAppStore();
        return {
            classGroups: computed(() => store.getClassGroups()),
            modals: {
                submitRelations: false,
                bellsWithoutGroups: false,
            },
        }
    },
    created() {
        if (this.store.getBells().length <= 0) {
            console.log("entro bells");
            this.loading = true;
            comManager.getBells();
            this.loading = false;
        }
    },
    watch: {
        bells: { // Each time bells change execute createRelationsStructure() method
            handler: 'createRelationsStructure',
        },
    },
    methods: {
        startDrag(event, group) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('groupId', group.id);
        },
        onDrop(event, bell) {
            const groupId = event.dataTransfer.getData('groupId');
            const group = this.classGroups.find((group) => group.id == groupId);
            if (!bell.groups.find((group) => group.id == groupId)) {
                bell.groups.push(group);
            }
        },
        deleteGroup(bell, group) {
            // Busca el grup a la llista de grups associada al timbre
            const index = bell.groups.indexOf(group);

            // Si es troba el grup, eliminar-lo
            if (index > -1) {
                bell.groups.splice(index, 1);
            }
        },
        saveBellsGroupsRelation() {
            let isSubmittable = true;
            for (let i = 0; i < this.bells.length; i++) {
                if (this.bells[i].groups <= 0) {
                    isSubmittable = false;
                    break;
                }
            }
            if (isSubmittable) {
                this.modals.submitRelations = true;
            } else {
                this.modals.bellsWithoutGroups = true;
            }
        },
        submitData() {
            const bells = { bells: this.bells };
            socket.emit('updateBellsGroupsRelations', this.store.getUser().token, bells);
        }
    },
    computed: {
        bells() {
            let bells = this.store.getBells();
            for (let i = 0; i < bells.length; i++) {
                for (let j = 0; j < bells[i].groups.length; j++) {
                    delete bells[i].groups[j].pivot;
                }
            }
            return bells;
        },
        serverResponse() {
            return this.store.getServerResponse();
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
.groups-container {
    background-color: rgb(56, 56, 56);
}

.group-item {
    background-color: rgb(56, 56, 56);
    color: white;
}

.hour-item {
    background-color: var(--pedralbes-blue);
    color: white;
}

.width-150 {
    width: 150px;
}

/* .group-item:hover,
.group-item:active {
    background-color: white;
    color: rgb(56, 56, 56);
} */

.groups-bells-container {
    background-color: rgb(56, 56, 56);
}

.pedralbes-button {
    background-color: var(--pedralbes-blue);
}
</style>