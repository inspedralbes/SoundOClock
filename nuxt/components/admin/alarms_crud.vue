<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">RELACIONAR GRUPS AMB TIMBRES</h2>
        <div class="m-8" v-if="loading">
            <Loader />
        </div>
        <div v-else>

            <div class="flex flex-col gap-3 mt-8 ml-20 mr-8 mb-24">
                <div class="bg-gray-400 rounded-lg users-container p-4">
                    <div class="flex justify-between">
                        <span class="text-lg font-bold col-span-8">GRUPS DISPONIBLES</span>
                        <div class="flex gap-3">
                            <UButton size="xl" class="flex justify-center hour-item px-5" color="blue"
                                @click="modals.useTemplate = true">Utilitzar plantilla</UButton>
                            <UButton size="xl" class="flex justify-center px-5" color="orange"
                                @click="cleanGroups">Natejar Grups</UButton>
                            <input type="text" placeholder="Busca un grup..." :value="search"
                                @input="search = $event.target.value;"
                                class="col-span-4 h-full w-full items-center rounded-lg p-3 border-2 border-white">
                        </div>
                    </div>
                    <div class="flex flex-row gap-3 py-4 overflow-x-auto">
                        <div v-if="loadings.classGroups" class="flex justify-center items-center gap-3">
                            <USkeleton class="w-40 h-20" v-for="i in 25" />
                        </div>
                        <div v-if="filteredClassGroups().length > 0 && !loadings.classGroups"
                            v-for="group in filteredClassGroups()"
                            class="group-item min-w-40 h-20 flex flex-row justify-center items-center rounded-lg p-4"
                            draggable="true" @dragstart="startDrag($event, group)">
                            {{ group.abbreviation }}
                        </div>
                        <div v-if="filteredClassGroups().length === 0 && !loadings.classGroups"
                            class="w-full h-20 flex flex-row justify-center items-center rounded-lg p-4">
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
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-x">
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
    <div class="btn-container fixed bottom-0 w-full flex justify-center items-center gap-5">
        <UButton size="xl" class="w-48 flex justify-center" @click="saveBellsGroupsRelation">Desar Timbres</UButton>
        <UButton size="xl" class="w-48 flex justify-center hour-item" color="blue" @click="modals.saveTemplate = true">
            Desar Plantilla</UButton>
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
                        <UButton size="md" color="red" @click="modals.submitRelations = false">Enrere</UButton>
                        <UButton size="md" color="primary" @click="submitData">Continuar</UButton>
                    </div>
                </template>
            </UAlert>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
                @click="modals.submitRelations = false" />
        </div>
    </UModal>

    <UModal v-model="modals.saveTemplate">
        <div>
            <UCard>
                <template #header>
                    <span>Guardar la plantilla de grups associats als timbres?</span>
                </template>

                <UForm :validate="validateStoreTemplate" class="space-y-4" @submit="saveBellsGroupsTemplate">
                    <UFormGroup label="Nom Plantilla" name="name">
                        <UInput v-model="formTemplateName" autocomplete="off" placeholder="e.g. Professorat" />
                    </UFormGroup>
                    <div class="mt-2 flex gap-2">
                        <UButton size="md" color="red" @click="modals.saveTemplate = false">Enrere</UButton>
                        <UButton size="md" color="primary" type="submit" v-if="!loadings.saveBellsGroupsRelation">
                            Guardar</UButton>
                        <UButton size="md" color="primary" v-else loading>Guardar</UButton>
                    </div>
                </UForm>
            </UCard>
        </div>
    </UModal>

    <UModal v-model="modals.useTemplate">
        <div>
            <UCard>
                <template #header>
                    <span>Selecciona una plantilla</span>
                </template>

                <div v-if="templates.length === 0">
                    <UAlert icon="i-heroicons-x-circle-16-solid" color="orange" variant="subtle" title="ATENCIÓ"
                        description="No hi ha cap plantilla guardada." class="p-4" />
                </div>

                <UForm :validate="validateUseTemplate" class="space-y-4" @submit="useBellsGroupsTemplate" v-else>
                    <UFormGroup label="Plantilles:" name="template">
                        <div v-for="template of templates" :key="template.name"
                            class="flex items-center justify-between">
                            <URadio v-model="selectedTemplate" class="my-2" v-bind="getSelectOption(template)" />
                            <UIcon name="i-heroicons-trash-20-solid" class="text-xl cursor-pointer text-red-400"
                                @click="deleteTemplate(template._id)" v-if="loadings.deleteTemplate !== template._id" />
                            <div class="loader-track" v-if="loadings.deleteTemplate === template._id"></div>
                        </div>
                    </UFormGroup>

                    <div class="mt-2 flex gap-2">
                        <UButton size="md" color="red" @click="modals.useTemplate = false">Enrere</UButton>
                        <UButton size="md" color="primary" type="submit" v-if="!loadings.saveBellsGroupsRelation">
                            Utilitzar plantilla</UButton>
                        <UButton size="md" color="primary" v-else loading>Utilitzar plantilla</UButton>
                    </div>
                </UForm>


            </UCard>
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
            store: useAppStore(),
            classGroups: computed(() => store.getClassGroups()),
            modals: {
                submitRelations: false,
                bellsWithoutGroups: false,
                saveTemplate: false,
                useTemplate: false,
            },
            search: "",
            formTemplateName: "",
            loadings: {
                saveBellsGroupsRelation: false,
                classGroups: true,
                deleteTemplate: null,
            },
            toast: null,
            templates: [],
            selectedTemplate: null,
        }
    },
    created() {
        if (this.store.getBells().length <= 0) {
            this.store.setLoadingAdminComponent(true);
            comManager.getBells();
        }
        if (this.store.getClassGroups().length == 0) {
            socket.emit("getGroups");
        } else {
            this.loadings.classGroups = false;
        }
        this.getBellsGroupsTemplate();
    },
    mounted() {
        this.toast = useToast();
    },
    watch: {
        bells: { // Each time bells change execute createRelationsStructure() method
            handler: 'createRelationsStructure',
        },
        classGroups: {
            handler: 'handleClassGroupsChange',
        },
    },
    methods: {
        handleServerResponse() {

        },
        handleClassGroupsChange() {
            if (this.classGroups.length > 0) {
                this.loadings.classGroups = false;
            }
        },
        getBellsGroupsTemplate() {
            comManager.getBellsGroupsTemplate()
                .then((data) => {
                    this.templates = data;
                });
        },
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
            this.modals.submitRelations = false
            socket.emit('updateBellsGroupsRelations', this.store.getUser().token, bells);
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
        saveBellsGroupsTemplate() {
            const bellsGroupsRelations = this.bells.map((bell) => {
                return {
                    id: bell.id,
                    hour: bell.hour,
                    groups: bell.groups.map((group) => group.id),
                }
            });

            const template = {
                name: this.formTemplateName,
                bellsGroups: bellsGroupsRelations,
            }

            this.loadings.saveBellsGroupsRelation = true;
            comManager.storeBellsGroupsTemplate(template)
                .then((data) => {
                    if (data.status === 'success') {
                        this.toast.add({
                            title: 'Plantilla guardada',
                            description: 'La plantilla s\'ha guardat correctament.',
                            color: 'green',
                        });
                    } else {
                        this.toast.add({
                            title: 'Error',
                            description: 'Hi ha hagut un error al guardar la plantilla.',
                            color: 'red',
                        });
                    }
                    this.loadings.saveBellsGroupsRelation = false;
                    this.formTemplateName = "";
                    this.modals.saveTemplate = false;
                    this.getBellsGroupsTemplate();
                });
        },
        validateStoreTemplate() {
            const errors = []
            if (!this.formTemplateName) errors.push({ path: 'name', message: 'El nom és obligatori' })
            return errors
        },
        validateUseTemplate() {
            const errors = []
            if (!this.selectedTemplate) errors.push({ path: 'template', message: 'Has de seleccionar una plantilla' })
            return errors
        },
        getSelectOption(template) {
            return {
                label: template.name,
                value: template.name,
            }
        },
        useBellsGroupsTemplate() {
            const template = this.templates.find((template) => template.name === this.selectedTemplate);

            for (let i = 0; i < this.bells.length; i++) {
                // Fill the bell groups with the template groups
                this.bells[i].groups = template.bellsGroups.find((bell) => bell.id === this.bells[i].id).groups.map((groupId) => {
                    // Find the group object with the id (because in mongo we only store the id of the group)
                    return this.classGroups.find((group) => group.id === groupId);
                });
            }

            this.modals.useTemplate = false;
        },
        deleteTemplate(templateId) {
            this.loadings.deleteTemplate = templateId;
            comManager.deleteBellsGroupsTemplate(templateId)
                .then((data) => {
                    if (data.status === 'success') {
                        this.toast.add({
                            title: 'Plantilla eliminada',
                            description: 'La plantilla s\'ha eliminat correctament.',
                            color: 'green',
                        });
                    } else {
                        this.toast.add({
                            title: 'Error',
                            description: 'Hi ha hagut un error al eliminar la plantilla.',
                            color: 'red',
                        });
                    }
                    this.getBellsGroupsTemplate();
                    this.loadings.deleteTemplate = null;
                });
        },
        cleanGroups() {
            for (let i = 0; i < this.bells.length; i++) {
                this.bells[i].groups = [];
            }
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

/* HTML: <div class="loader"></div> */
.loader-track {
    width: 20px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffffff;
    --_m:
        conic-gradient(#0000 10%, #000),
        linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
}

@keyframes l3 {
    to {
        transform: rotate(1turn)
    }
}
</style>