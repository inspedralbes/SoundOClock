<template>

    <div v-if="loading" class="loading">
        <Loader />
    </div>
    <div v-else class="flex flex-col w-full h-full">

        <h1 class="w-full h-fit m-5 text-center text-4xl cursor-default">Afegir-te/treure't de grups </h1>

        <div class="flex flex-row w-full h-full">
            <div class="w-full h-full">
                <div class="w-[80%] h-full pl-20">
                    <div class="flex flex-col justify-center mb-5">
                        <label for="grup">Grup:</label>
                        <USelectMenu v-model="selectedCategoryId" :options="categories" option-attribute="abbreviation"
                            value-attribute="id" placeholder="-- Escull el teu grup --" />
                    </div>
                    <div class="flex h-full flex-col">
                        <label for="curs">Curs:</label>
                        <ul class="h-[60vh] overflow-auto">
                            <li v-for="(group, index) in availableCourses" :key="group.id + `key`">
                                <div class="flex flex-row gap-2 items-center mb-2">
                                    <div class="checkbox-wrapper-39">
                                        <label>
                                            <input type="checkbox" :value="group.id" @change="updateSelected(group)"
                                                :name="group.id + `name`" :id="group.id + `id`"
                                                :checked="selectedGroups.includes(group)">
                                            <span class="checkbox"></span>
                                        </label>
                                    </div>
                                    <div class="no-select">{{ group.abbreviation }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="w-full flex flex-col justify-between">
                <div class="w-full pr-20">
                    <div class="flex flex-row mb-3 content-center justify-between">
                        <h3>CURSOS SELECCIONATS</h3>
                        <button class="hover:font-semibold hover:text-blue-500"
                            @click="restartSelectedGroups()">Reiniciar</button>
                    </div>
                    <div v-if="!selectedGroups.length > 0" class="text-center">Encara no has seleccionat cap curs
                    </div>
                    <div v-else class="flex flex-row flex-wrap gap-3">
                        <div v-for="group in selectedGroups"
                            class="w-fit px-3 py-2 bg-[#999] grow text-center rounded-full cursor-default">
                            {{ group.abbreviation }}
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-row justify-between pr-20">
                    <UButton color="red">Cancel·lar canvis</UButton>
                    <UButton color="green" @click="this.modals.confirmChanges = true">Confirmar canvis
                    </UButton>
                </div>
            </div>
        </div>
    </div>

    <UModal v-model="this.modals.confirmChanges">
        <div>
            <UAlert title="Estàs segur/a que vols aplicar els canvis?" icon="i-heroicons-exclamation-triangle-16-solid"
                color="orange" variant="subtle" class="p-6">
                <template #title="{ title }">
                    <span v-html="title" />
                </template>
                <template #description>
                    <div class="mt-2 flex justify-between gap-2">
                        <UButton size="md" color="red" @click="modals.confirmChanges = false">Enrere</UButton>
                        <UButton size="md" color="primary" :loading="storeGroupsLoading" @click="storeGroups()">Continuar</UButton>
                    </div>
                </template>
            </UAlert>
        </div>

    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '@/communicationManager'

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            groups: [],
            categories: [],
            selectedCategoryId: '',
            storeGroupsLoading: false,
            selectedGroups: [],
            modals: {
                confirmChanges: false,
            },
        }
    },

    mounted() {

        comManager.getAllGroupsAndCategories().then((data) => {
            this.groups = data.allGroups;
            this.categories = data.allCategories;
            this.user.groups.forEach((group) => {
                this.selectedGroups.push(this.groups.find((grup) => grup.id === group));
            });
            this.loading = false;
        });

    },
    computed: {
        availableCourses() {
            return this.groups.filter(group => {
                return group.category_id === this.selectedCategoryId
            })
        },
        user() {
            return this.store.getUser();
        }
    },
    methods: {
        updateSelected(groupUpdate) {
            if (this.selectedGroups.includes(groupUpdate)) {
                this.selectedGroups = this.selectedGroups.filter((group) => group !== groupUpdate);
            } else {
                this.selectedGroups.push(groupUpdate);
            }
        },
        restartSelectedGroups() {
            this.selectedGroups = [];
            this.user.groups.forEach((group) => {
                this.selectedGroups.push(this.groups.find((grup) => grup.id === group));
            });
        },
        formatArray(array) {
            return array.map((item) => {
                return item.id;
            });
        },
        storeGroups() {
            this.storeGroupsLoading = true;

            let userId = this.store.getUser().id;
            let groups = this.formatArray(this.selectedGroups);
            let userToken = this.store.getUser().token;
            
            comManager.setUserGroups(userId, groups, userToken).then(() => {
                this.storeGroupsLoading = false;
                this.modals.confirmChanges = false;
                this.$router.push('/els_meus_grups');
            });
        }
    }
}
</script>

<style scoped>
.checkbox-wrapper-39 *,
.checkbox-wrapper-39 *::before,
.checkbox-wrapper-39 *::after {
    box-sizing: border-box;
}

.checkbox-wrapper-39 label {
    display: block;
    width: 35px;
    height: 35px;
    cursor: pointer;
}

.checkbox-wrapper-39 input {
    visibility: hidden;
    display: none;
}

.checkbox-wrapper-39 input:checked~.checkbox {
    transform: rotate(45deg);
    width: 14px;
    margin-left: 12px;
    border-color: #24c78e;
    border-top-color: transparent;
    border-left-color: transparent;
    border-radius: 0;
}

.checkbox-wrapper-39 .checkbox {
    display: block;
    width: inherit;
    height: inherit;
    border: 3px solid #434343;
    border-radius: 6px;
    transition: all 0.375s;
}

.no-select {
    user-select: none;
    /* Evita que el texto sea seleccionable */
    -webkit-user-select: none;
    /* Safari */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
}

.fixed-bottom {
    position: fixed;
    bottom: 50px;
    /* Puedes ajustar esta distancia según necesites */
    left: 95%;
    transform: translateX(-50%);
}
</style>