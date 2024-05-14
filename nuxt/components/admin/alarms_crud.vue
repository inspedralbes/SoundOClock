<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">RELACIONAR GRUPS AMB TIMBRES</h2>
        <div class="m-8" v-if="loading">
            <Loader />
        </div>
        <div v-else>

            <div class="flex flex-col gap-3 mt-8 ml-20 mr-8">
                <div class="bg-gray-400 rounded-lg users-container p-4">
                    <div class="grid grid-cols-12">
                        <span class="text-lg font-bold col-span-8">GRUPS DISPONIBLES</span>
                        <input type="text" placeholder="Busca un grup..." :value="search" @input="search = $event.target.value;"
                            class="col-span-4 h-full w-full items-center rounded-lg p-3 border-2 border-white">
                    </div>
                    <div class="flex flex-row gap-3 py-4 overflow-x-auto">
                        <div v-if="filteredClassGroups().length > 0" v-for="group in filteredClassGroups()"
                            class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-4"
                            draggable="true" @dragstart="startDrag($event, group)">
                            {{ group.abbreviation }}
                        </div>
                        <div v-else class="w-full h-20 flex flex-row justify-center items-center rounded-lg p-4">
                            NO HI HA GRUPS QUE COINCIDEIXEN AMB LA CERCA
                        </div>
                    </div>
                </div>
                <div class="groups-bells-container rounded-lg">
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
    <div class="btn-container fixed bottom-0 w-full flex justify-center items-center">
        <UButton size="xl" class="w-96 flex justify-center" @click="saveBellsGroupsRelation">Desar Timbres</UButton>
    </div>

    <UModal v-model="modals.bellsWithoutGroups">
        <UAlert icon="i-heroicons-x-circle-16-solid" color="red" variant="subtle" title="ERROR"
            description="Totes les franges horàries han de tenir com a mínim un grup assignat." class="p-6" />
    </UModal>

    <UModal v-model="modals.submitRelations">
        <div>
            <UAlert title="Estàs segur/a que vols desar la configuració dels timbres?"
                icon="i-heroicons-exclamation-triangle-16-solid" color="orange" variant="subtle" class="p-6">
                <template #title="{ title }">
                    <span v-html="title" />
                </template>
                <template #description>
                    <div class="mt-2 flex gap-2">
                        <UButton size="md" color="red" @click="closeConfirmationModal">Enrere</UButton>
                        <UButton size="md" color="primary" @click="submitData">Continuar</UButton>
                    </div>
                </template>
            </UAlert>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
                @click="closeConfirmationModal" />
        </div>
    </UModal>

    <ModularToast v-bind:serverResponse="serverResponse" time="10000" />
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
            search: "",
        }
    },
    created() {
        if (this.store.getBells().length <= 0) {
            this.store.setLoadingAdminComponent(true);
            comManager.getBells();
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
            this.closeConfirmationModal();
            socket.emit('updateBellsGroupsRelations', this.store.getUser().token, bells);
        },
        closeConfirmationModal() {
            this.modals.submitRelations = false;
        },
        filteredClassGroups() {
            let filteredClassGroups = this.classGroups;

            if (this.search.trim() !== '') {
                filteredClassGroups = filteredClassGroups.filter((group) => {
                    return group.abbreviation.toLowerCase().includes(this.search.toLowerCase());
                });
            } else {
                filteredClassGroups = this.classGroups;
            }
            return filteredClassGroups;
        },
    },
    computed: {
        loading() {
            return this.store.getLoadingAdminComponent();
        },
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

.groups-bells-container {
    background-color: rgb(56, 56, 56);
}

.pedralbes-button {
    background-color: var(--pedralbes-blue);
}

.btn-container {
    background-color: rgba(0, 0, 0, 0.5);
    height: 5rem;
    box-shadow: 0px -5px 10px 0px rgba(0, 0, 0, 0.5);
}
</style>