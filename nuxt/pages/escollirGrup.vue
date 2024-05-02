<template>
    <div class="w-80 mx-auto mt-6">
        <div class="title text-white text-center text-4xl font-bold my-5">
            <h1>Escull el teu Grup:</h1>
        </div>
        <div v-if="loading" class="loading">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center mb-5">
                <label for="grup">Grup:</label>
                <select name="grup" id="grup" v-model="selectedCategoryId"
                    class="w-80 p-3 rounded border-slate-400 border-2">
                    <option value="">-- Escull el teu grup --</option>
                    <option :value="category.id" v-for="category in categories" :key="category.id">
                        {{ category.abbreviation }}
                    </option>
                </select>
            </div>
            <div class="flex flex-col items-center justify-center">
                <label for="curs">Curs:</label>
                <select name="curs" id="curs" :disabled="!selectedCategoryId" v-model="selectedGroupId"
                    class="w-80 p-3 rounded border-slate-400 border-2">
                    <option value="">-- Escull el teu curs --</option>
                    <option :value="course.id" v-for="course in availableCourses" :key="course">{{ course.abbreviation
                        }}
                    </option>
                </select>
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
            postGroups: computed(() => this.store.getUser().groups),
        }
    },
    mounted() {
        let user = this.store.getUser();
        if (user.role_id < 4) {
            // User is a not a student (teacher, admin, etc.)
            comManager.getAllGroupsAndCategories().then((data) => {
                this.groups = data.allGroups;
                this.categories = data.allCategories;
                this.loading = false;
            });
        } else {
            // User is a student
            comManager.getPublicGroupsAndCategories().then((data) => {
                this.groups = data.publicGroups;
                this.categories = data.publicCategories;
                this.loading = false;
            });
        }
    },
    computed: {
        availableCourses() {
            return this.groups.filter(group => {
                return group.category_id === this.selectedCategoryId
            })
        }
    },

    methods: {
        storeGroup() {
            this.storeGroupsLoading = true;
            if (!this.postGroups.includes(this.selectedGroupId)) {
                this.postGroups = [this.selectedGroupId];
                let userId = this.store.getUser().id;
                let userToken = this.store.getUser().token;
                comManager.setUserGroups(userId, this.postGroups, userToken).then((data) => {
                    this.storeGroupsLoading = false;
                    // Maybe in a future consider to retrieve the user groups from the DB (data variable)
                    // and store them in the store

                    this.store.setUserGroups(this.postGroups);
                    this.$router.push('/llista_propostes');
                });
            }
        },
        checkCorrectOptions() {
            return !this.selectedGroupId || !this.selectedCategoryId;
        },
    }
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
</style>