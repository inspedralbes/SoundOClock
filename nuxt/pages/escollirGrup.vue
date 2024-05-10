<template>
    <div class="w-80 mx-auto mt-6">
        <div class="title text-white text-center text-4xl font-bold my-5">
            <h1>Escull el teu Grup:</h1>
        </div>
        <div v-if="loading" class="loading">
            <Loader />
        </div>

        <div v-else>
            <div v-if="user.role_id === 5">
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
                    <select name="curs" id="curs" :disabled="!selectedCategoryId" v-model="selectedGroups"
                        class="w-80 p-3 rounded border-slate-400 border-2">
                        <option value="">-- Escull el teu curs --</option>
                        <option :value="course.id" v-for="course in availableCourses" :key="course">{{ course.abbreviation
                        }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-else>
                <h2 class="text-xl text-center">Pots escollir més d'un curs</h2>
                <div class="mt-4">
                    <div class="flex flex-col justify-center mb-5">
                        <label for="grup">Grup:</label>
                        <USelectMenu class="w-full" v-model="selectedCategoryId" :options="categories"
                            option-attribute="abbreviation" value-attribute="id" placeholder="-- Escull el teu grup --" />
                    </div>
                    <div class="flex flex-col justify-center mb-10">
                        <label for="curs">Curs:</label>
                        <USelectMenu class="w-full" :disabled="!selectedCategoryId" v-model="selectedGroups"
                            :options="availableCourses" option-attribute="abbreviation"
                            placeholder="-- Escull el teu curs --" multiple />
                    </div>
                    <div>
                        <h3 class="mb-3">CURSOS SELECCIONATS</h3>
                        <div v-if="!selectedGroups.length > 0" class="text-center">Encara no has seleccionat cap curs</div>
                        <div v-else class="flex flex-row flex-wrap gap-3">
                            <div v-for="group in selectedGroups"
                                class="w-fit px-3 py-2 bg-[#999] grow text-center rounded-full">{{
                                    group.abbreviation }}</div>
                        </div>
                    </div>
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
            selectedGroups: null,
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
        storeGroup() {
            this.storeGroupsLoading = true;
            let groups;

            if (typeof this.selectedGroups === "number") {
                groups = [this.selectedGroups]
            } else {
                groups = this.formatGroupsId();
            }
        
            let userId = this.store.getUser().id;
            let userToken = this.store.getUser().token;
            comManager.setUserGroups(userId, groups, userToken).then((data) => {
                this.storeGroupsLoading = false;
                // Maybe in a future consider to retrieve the user groups from the DB (data variable)
                // and store them in the store

                this.store.setUserGroups(groups);
                this.$router.push('/llista_propostes');
            });
        },
        formatGroupsId() {

            let groupsId = [];

            for (let i = 0; i < this.selectedGroups.length; i++) {
                groupsId.push(this.selectedGroups[i].id);
            }

            return groupsId;
        },
        checkCorrectOptions() {
            if (this.user.role_id === 5 ) {
                return !this.selectedGroups || !this.selectedCategoryId;
            } else {
                return !this.selectedGroups.length > 0 || !this.selectedCategoryId;
            }

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