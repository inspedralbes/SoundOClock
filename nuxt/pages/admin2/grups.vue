<template>
    <ModularAdminLayout title="Gestió dels grups">
        <div v-if="isLoading" class="flex flex-col m-4">
            <USkeleton v-for="i in 5" class="h-10 my-0.5 w-full" />
        </div>
        <div class="m-4" v-else>
            <UAccordion color="sky" variant="soft" size="xl" :items="itemsAccordion">
                <template #item="item">
                    <div class="grid titles mx-4 text-gray-200" v-if="item.item.groups.length > 0">
                        <span>ID</span>
                        <span>Abreviatura</span>
                        <span>Grup</span>
                        <span>Public</span>
                        <span>Accions</span>
                    </div>
                    <div v-if="item.item.groups.length == 0">
                        <UAlert title="No hi han grups en aquesta categoria!" variant="outline" color="white"
                            class="text-center" />
                    </div>
                    <div v-for="group in item.item.groups" class="mx-4" v-else>
                        <div class="grid group text-gray-200">
                            <span class="flex items-center">{{ group.id }}</span>
                            <input type="text" v-model="group.abbreviation" :disabled="!group.editing">
                            <input type="text" v-model="group.name" :disabled="!group.editing">
                            <ModularSwitch :value="group.is_public" :canSwitch="group.editing"
                                @input="handleSwitch(group, $event)" />
                            <span v-if="!group.editing">
                                <button class="edit button" @click="startEditing(group)">Editar</button>
                                <button class="delete button"
                                    @click="openModal('deleteGroup', group.id)">Eliminar</button>
                            </span>
                            <span v-else>
                                <button class="save button" @click="saveEdit(group)">Guardar</button>
                                <button class="delete button" @click="cancelEdit(group)">Cancel·lar</button>
                            </span>
                        </div>
                    </div>
                </template>
            </UAccordion>
            <div class="flex justify-center mt-5 gap-3">
                <UButton @click="openModal('createCategory', null)" class="w-1/3 flex justify-center" color="white"
                    variant="outline" size="xl">
                    Crear Categoria
                </UButton>
                <UButton @click="openModal('createGroup', null)" class="w-1/3 flex justify-center" color="white"
                    variant="outline" size="xl">Crear Grup</UButton>
            </div>
        </div>
    </ModularAdminLayout>

    <ModularModal :open="modals.deleteGroup" title="Eliminar grup" @confirm="deleteGroup"
        @close="modals.deleteGroup = false" msg="Eliminar">
        <template #title>
            <h2>Eliminar grup</h2>
        </template>
        <template #content>
            <p>Estàs segur que vols eliminar aquest grup?</p>
        </template>
    </ModularModal>
    <UModal v-model="modals.createCategory">
        <h2 class="text-2xl text-center text-bold text-gray-600 mt-5">Crear Categoria</h2>
        <UForm :validate="validate" :state="formState" class="space-y-4 m-5" @submit="onSubmitCategory">
            <UFormGroup label="Nom" name="name">
                <UInput v-model="formState.name" />
            </UFormGroup>

            <UFormGroup label="Abreviatura" name="abbreviation">
                <UInput v-model="formState.abbreviation" />
            </UFormGroup>

            <UFormGroup label="Public" name="isPublic">
                <UToggle v-model="formState.is_public" />
            </UFormGroup>

            <UButton type="submit">
                Crear
            </UButton>
        </UForm>
    </UModal>
    <UModal v-model="modals.createGroup">
        <h2 class="text-2xl text-center text-bold text-gray-600 mt-5">Crear Grup</h2>
        <UForm :validate="validate" :state="formState" class="space-y-4 m-5" @submit="onSubmitGroup">
            <UFormGroup label="Nom" name="name">
                <UInput v-model="formState.name" />
            </UFormGroup>

            <UFormGroup label="Abreviatura" name="abbreviation">
                <UInput v-model="formState.abbreviation" />
            </UFormGroup>

            <UFormGroup label="Categoria" name="category">
                <USelect v-model="formState.category" placeholder="Selecciona categoria..."
                    :options="getCategories()" />
            </UFormGroup>

            <UFormGroup label="Public" name="isPublic">
                <UToggle v-model="formState.is_public" />
            </UFormGroup>

            <UButton type="submit">
                Crear
            </UButton>
        </UForm>
    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '@/socket';
import comManager from '~/communicationManager';

export default {
    data() {
        return {
            isLoading: true,
            store: useAppStore(),
            selectedGroup: null,
            groupCategories: [],
            groups: [],
            itemsAccordion: [],
            toast: null,
            modals: {
                deleteGroup: false,
                deleteCategory: false,
                createCategory: false,
                createGroup: false,
            },
            formState: {
                name: '',
                abbreviation: '',
                is_public: 1,
                category: null,
            },
        }
    },
    created() {
        this.refreshData();
    },
    mounted() {
        this.toast = useToast();
    },
    methods: {
        openModal(name, id) {
            this.modals[name] = true;
            this.formState = {
                name: '',
                abbreviation: '',
                is_public: true,
                category: null,
            }
            this.selectedGroup = id;
        },
        startEditing(group) {
            group.editing = true
            // Set other groups to not editing
            this.itemsAccordion = this.itemsAccordion.map((category) => {
                category.groups = category.groups.map((g) => {
                    if (g.id !== group.id && g.editing) {
                        g.editing = false
                    }
                    return g
                })
                return category
            })
        },
        cancelEdit(group) {
            Object.assign(group, this.groups[group.id - 1]);
            group.editing = false;
        },
        deleteGroup() {
            socket.emit('deleteGroup', this.store.getUser().token, this.selectedGroup);
            // Remove group from itemsAccordion
            this.itemsAccordion = this.itemsAccordion.map((category) => {
                category.groups = category.groups.filter((group) => group.id !== this.selectedGroup)
                return category
            })
        },
        saveEdit(group) {
            group.editing = false;
            socket.emit('updateGroup', this.store.getUser().token, group);
            // Update group in itemsAccordion
            this.itemsAccordion = this.itemsAccordion.map((category) => {
                category.groups = category.groups.map((g) => {
                    if (g.id === group.id) {
                        return group
                    }
                    return g
                })
                return category
            })
            this.toast.add({
                title: 'Success!',
                description: 'El grup s\'ha actualitzat correctament!',
                color: 'green',
            });
        },
        handleSwitch(group, value) {
            switch (value) {
                case true:
                    value = 1;
                    break;
                case false:
                    value = 0;
                    break;
            }
            group.is_public = value;
        },
        validate(state) {
            const errors = []
            if (!state.name) errors.push({ path: 'name', message: 'El nom és obligatori' })
            if (!state.abbreviation) errors.push({ path: 'abbreviation', message: 'La abreviatura és obligatòria' })
            return errors
        },
        getCategories() {
            return this.groupCategories.map((category) => {
                return { label: category.name, value: category.id }
            })
        },
        refreshData() {
            this.isLoading = true
            comManager.getAllGroupsAndCategories()
                .then((data) => {
                    this.groupCategories = data.allCategories
                    this.groups = data.allGroups

                    // Fill itemsAccordion with data from the API
                    this.itemsAccordion = this.groupCategories.map((category) => {
                        return { label: `${category.id}. ${category.name} (${category.abbreviation})`, groups: category.groups, id: category.id }
                    })
                    this.isLoading = false
                })
        },
        onSubmitCategory(event) {
            const data = {
                name: event.data.name,
                abbreviation: event.data.abbreviation,
                is_public: event.data.is_public ? 1 : 0,
            }
            this.modals.createCategory = false
            this.isLoading = true

            comManager.createGroupCategory(this.store.getUser().token, data)
                .then((res) => {
                    this.toast.add({
                        title: 'Success!',
                        description: 'La categoria s\'ha creat correctament!',
                        color: 'green',
                    });
                })
                .catch((err) => {
                    this.toast.add({
                        title: 'Error!',
                        description: 'Hi ha hagut un error al crear la categoria!',
                        color: 'red',
                    });
                })
                .finally(() => {
                    this.refreshData()
                })
        },
        onSubmitGroup(event) {
            const data = {
                name: event.data.name,
                abbreviation: event.data.abbreviation,
                is_public: event.data.is_public ? 1 : 0,
                category_id: event.data.category,
            }
            this.modals.createGroup = false
            this.isLoading = true

            comManager.createGroup(this.store.getUser().token, data)
                .then((res) => {
                    this.toast.add({
                        title: 'Success!',
                        description: 'El grup s\'ha creat correctament!',
                        color: 'green',
                    });
                })
                .catch((err) => {
                    this.toast.add({
                        title: 'Error!',
                        description: 'Hi ha hagut un error al crear el grup!',
                        color: 'red',
                    });
                })
                .finally(() => {
                    this.refreshData()
                })
        },
    },
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: .1fr .3fr 1fr .2fr .5fr;
    gap: 5px;
    padding: 1rem;
}

.titles {
    font-weight: bold;
    border-bottom: 1px solid;
    border-top: 1px solid;
    backdrop-filter: blur(10px);
    top: 0;
    position: sticky;
    z-index: 1001;
}

input {
    padding: 5px;
    border-radius: 5px;
    border: none;
    width: 100%;
}

input:disabled {
    color: gray;
}

.group {
    border-bottom: 1px solid gray;

}

.button {
    padding: 5px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: white;
    width: 40%;
    margin: 5px;
}

button.edit {
    background-color: var(--pedralbes-blue);
}

button.delete {
    background-color: #E03616;
}

button.save {
    background-color: #63C132;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

span {
    text-align: center
}
</style>