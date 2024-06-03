<template>
    <div>
        <div class="mt-6">
            <div class="title text-white text-center text-4xl font-bold my-5">
                <h1 v-if="user.role_id === 5">Escull el teu grup i el teu curs</h1>
                <h1 v-else>Escull els teus grups i cursos</h1>
                <h3 class="text-xl font-normal" v-if="user.role_id != 5">Si ets professor, moderador o administrador,
                    pots
                    triar diversos grups i
                    diversos cursos</h3>
            </div>
            <div v-if="loading" class="loading">
                <Loader />
            </div>

            <div v-else class="flex flex-col justify-center items-center">
                <div class="w-1/2">
                    <UDivider label="Grups" size="md" class="mt-8 mb-2" />
                    <USelectMenu size="xl" searchable v-model="selectedCategories" :options="categories"
                        option-attribute="abbreviation" :multiple="user.role_id != 5"
                        placeholder="-- Selecciona els teus grups --" searchable-placeholder="Busca el teu grup..." />
                    <div class="flex flex-wrap mt-2" v-if="user.role_id != 5">
                        <UButton v-for="category in selectedCategories" color="black" :label="category.abbreviation"
                            icon="i-heroicons-x-mark-20-solid" class="m-1 ml-0" @click="deleteCategory(category)">
                        </UButton>
                    </div>
                    <UDivider label="Cursos" size="md" class="mt-8 mb-2" :disabled="selectedCategories.length <= 0" />
                    <USelectMenu size="xl" searchable v-model="selectedGroups" :options="getGroups"
                        option-attribute="abbreviation" :multiple="user.role_id != 5"
                        placeholder="-- Selecciona els teus cursos --" searchable-placeholder="Busca el teu curs..." />
                    <div class="flex flex-wrap mt-2" v-if="user.role_id != 5">
                        <UButton v-for="group in selectedGroups" color="black" :label="group.abbreviation"
                            icon="i-heroicons-x-mark-20-solid" class="m-1 ml-0" @click="deleteGroup(group)">
                        </UButton>
                    </div>
                </div>
                <div class="mt-6 w-80">
                    <button @click="storeGroup" class="btn flex justify-center p-3 bg-green-600 rounded w-full"
                        :disabled="checkCorrectOptions()">
                        <span v-if="storeGroupsLoading" class="py-1">
                            <Loader />
                        </span>
                        <span v-else>Següent</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
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
            disabled: true,
            selectedCategoryId: '',
            selectedGroupId: '',
            storeGroupsLoading: false,
            selectedGroups: [],
            selectedCategories: [],
        }
    },
    mounted() {
        if (this.user.role_id < 4) {
            // User is a not a student (teacher, admin, etc.)
            comManager.getAllGroupsAndCategories().then((data) => {
                this.groups = data.allGroups;
                this.categories = data.allCategories;
                this.selectedGroups = [];
                this.loading = false;
            });
        } else {
            // User is a student
            comManager.getPublicGroupsAndCategories().then((data) => {
                this.groups = data.publicGroups;
                this.categories = data.publicCategories;
                this.selectedGroups = '';
                this.loading = false;
            });
        }
    },
    computed: {
        user() {
            return this.store.getUser();
        },
        getGroups() {
            if (this.user.role_id === 5) return this.selectedCategories.flatMap(category => category.groups) || [];
            return this.selectedCategories.flatMap(category => toRaw(category).groups || []);
        }
    },
    methods: {
        storeGroup() {
            this.storeGroupsLoading = true;
            let groups = [];
            if (this.user.role_id === 5) {
                groups = this.selectedGroups.id;
            } else {
                groups = this.selectedGroups.map(group => group.id);
            }
            let userId = this.store.getUser().id;
            let userToken = this.store.getUser().token;
            comManager.setUserGroups(userId, groups, userToken).then((data) => {
                this.storeGroupsLoading = false;

                this.store.setUserGroups(groups);
                this.$router.push('/llista_propostes');
            });
        },
        checkCorrectOptions() {
            if (this.user.role_id === 5) {
                return !this.selectedGroups || !this.selectedCategories;
                // return !this.selectedGroups || !this.selectedCategoryId;
            } else {
                // return !this.selectedGroups.length > 0 || !this.selectedCategoryId;
                return !this.selectedGroups.length > 0 || !this.selectedCategories.length > 0;
            }
        },
        deleteCategory(category) {
            this.selectedCategories = this.selectedCategories.filter((item) => item.id !== category.id);
            this.selectedGroups = this.selectedGroups.filter((group) => group.category_id !== category.id);
        },
        deleteGroup(group) {
            this.selectedGroups = this.selectedGroups.filter((item) => item.id !== group.id);
        },
        updateSelectedGroups() {
            if (this.user.role_id === 5) this.selectedGroups = [];
            const validGroups = this.getGroups || [];
            if (Array.isArray(this.selectedGroups)) {
                this.selectedGroups = this.selectedGroups.filter(group =>
                    validGroups.some(validGroup => validGroup.id === group.id)
                );
            } else {
                this.selectedGroups = [];
            }
        },

    },
    watch: {
        selectedCategories: {
            handler(newVal, oldVal) {
                // Update selectedGroups based on the current selectedCategories
                this.updateSelectedGroups();
            },
            deep: true,
        },
    },
}
</script>

<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.btn:disabled {
    background-color: #999;
    cursor: not-allowed;
}

.appear-enter-active,
.appear-leave-active {
    transition: opacity 0.5s;
}

.appear-enter-from,
.appear-leave-to {
    opacity: 0;
}
</style>