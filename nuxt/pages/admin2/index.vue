<template>
    <ModularAdminLayout title="Usuaris">
        <div class="flex justify-between space-x-4 w-full m-4" v-if="loading">
            <div class="flex flex-col w-1/3 space-y-0.5">
                <USkeleton v-for="i in 20" class="h-10" />
            </div>
            <USkeleton class="h-auto w-2/3" />
        </div>
        <div v-else class="m-4 flex flex-row space-x-8">
            <div v-if="users.length === 0" class="w-full">
                <p class="text-center text-xl">No hi ha cap usuari registrat a l'aplicació.</p>
            </div>
            <div v-else>
                <div class="width flex flex-col justify-center ml-auto mr-auto gap-3">
                    <div class="relative text-center w-full flex flex-row">
                        <input type="text" placeholder="Busca els usuaris per nom..."
                            class="w-full h-10 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-sky-500 bg-[#1F1F1F]"
                            v-model="filter">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 material-symbols-rounded">
                            search
                        </span>
                        <Transition name="delete-fade">
                            <button v-if="filter" @click="deleteSearch"
                                class="absolute h-full inset-y-0 right-0 flex items-center justify-center mr-16">
                                <span class="material-symbols-rounded p-1 hover:bg-gray-400/[.25] rounded-full">
                                    Close
                                </span>
                            </button>
                        </Transition>
                        <button
                            class="px-2 h-10 w-fit ml-2 bg-[#1F1F1F] flex items-center justify-center rounded-lg border border-gray-300 focus:outline-none hover:border-sky-500 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            id="buttonFilters" @click="isFiltersSlideOpen = !isFiltersSlideOpen">
                            <span class="material-symbols-outlined text-white">
                                tune
                            </span>
                        </button>
                    </div>
                    <UButton :color="isSelected(user) ? 'black' : 'sky'" :variant="isSelected(user) ? 'solid' : 'soft'"
                        v-if="filteredUsers.length != 0" v-for="user in filteredUsers" @click="selectUser(user)"
                        class="flex justify-between">
                        <p class="text-lg">{{ user.name }}</p>
                        <UIcon v-if="user.vote_banned_until || user.propose_banned_until"
                            name="i-heroicons-exclamation-circle-20-solid" class="w-10 h-10 text-red-500" />
                    </UButton>
                    <p v-if="filteredUsers.length === 0">No s'han trobat usuaris amb aquests filtres</p>
                </div>
            </div>
            <UserDetails v-bind:user="currentSelectedUser" />
        </div>
    </ModularAdminLayout>

    <!-- SLIDEOVER DE LOS FILTROS -->
    <USlideover v-model="isFiltersSlideOpen" class="z-[9999]">
        <UCard class="flex flex-col flex-1"
            :ui="{ body: { base: 'flex-1', background: 'bg-stone-800', }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <Placeholder class="h-full" />
            <div class="bg-stone-800 p-4 rounded-lg">
                <div class="flex items-center justify-between pb-2 border-b border-gray-700">
                    <h3 class="text-2xl font-semibold text-white">
                        FILTRES
                    </h3>
                    <button @click="isFiltersSlideOpen = false"
                        class="h-8 w-8 flex items-center justify-center hover:bg-stone-600 rounded-full p-2">
                        <span class="i-heroicons-x-mark-20-solid h-5 w-5" aria-hidden="true"></span>
                    </button>
                </div>
                <div class="pt-4">
                    <div class="flex items-center justify-between pb-2">
                        <h1 class="text-xl text-white">
                            Ordre
                        </h1>
                        <div class="flex space-x-4">
                            <button @click="orderBy = 'name'"
                                :class="{ 'font-semibold text-sky-500 bg-sky-600': orderBy === 'name' }"
                                class="py-2 px-4 rounded-md bg-gray-700 hover:bg-sky-600 text-white transition duration-300 ease-in-out">
                                Nom
                            </button>
                            <button @click="orderBy = 'group'"
                                :class="{ 'font-semibold text-sky-500 bg-sky-600': orderBy === 'group' }"
                                class="py-2 px-4 rounded-md bg-gray-700 hover:bg-sky-600 text-white transition duration-300 ease-in-out">
                                Grup
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="classGroups.length > 0" class="pt-4">
                    <div class="flex items-center justify-between pb-2">
                        <h1 class="text-xl text-white">
                            Grups
                        </h1>
                        <button @click="selectGroup(null)"
                            class="py-2 px-4 rounded-md bg-gray-700 hover:bg-sky-600 text-white transition duration-300 ease-in-out"
                            :class="{ 'font-semibold text-sky-500 bg-sky-600': filterGroup == null }">
                            Tots
                        </button>
                    </div>
                    <div class="flex flex-wrap -mx-2">
                        <div v-for="(group, index) in classGroups" :key="index" class="w-32 px-2 mb-2">
                            <button @click="selectGroup(group.id)"
                                :class="filterGroup === group.id ? 'border-sky-600 text-sky-500 bg-sky-600' : ''"
                                class="py-2 px-4 w-full rounded-full border border-gray-300 bg-gray-700 hover:bg-sky-600 text-white transition duration-300 ease-in-out">
                                {{ group.abbreviation }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </UCard>
    </USlideover>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';
import UserDetails from '~/components/UserDetails.vue';

export default {
    data() {
        return {
            // currentSelectedUser: null,
            filter: "",
            isDropdownMenuOpen: false,
            classGroups: computed(() => this.store.getClassGroups()),
            users: computed(() => this.store.getUsersAdminView()),
            isFiltersSlideOpen: false,
            filterGroup: null,
            orderBy: '',
            classGroups: computed(() => this.store.getClassGroups()),
            categories: computed(() => this.store.getCategories()),
        }
    },
    methods: {
        selectUser(selectedUser) {
            this.store.setAdminSelectedUser(selectedUser);
        },
        isSelected(user) {
            return user == this.currentSelectedUser;
        },
        deleteSearch() {
            this.filter = '';
        },
        cleanFilters() {
            this.filterBell = null;
            this.filterGroup = null;
            this.orderBy = '';
        },
        selectGroup(groupId) {
            this.filterGroup = groupId;
        }
    },
    created() {
        if (this.store.getUsersAdminView().length <= 0) {
            this.store.setLoadingAdminComponent(true);
            comManager.getUsers();
            comManager.getAllGroupsAndCategories().then((data) => {
                this.store.setClassGroups(data.allGroups);
                this.store.setCategories(data.allCategories);
            });
        }
    },
    computed: {
        loading() {
            return this.store.getLoadingAdminComponent();
        },
        currentSelectedUser() {
            return this.store.getAdminSelectedUser();
        },
        filteredUsers() {
            let filteredUsers = this.users;

            // Filtrado por grupo
            if (this.filterGroup) {
                filteredUsers = filteredUsers.filter(user =>
                    user.groups.some(group => group.id === this.filterGroup)
                );
            }

            // Filtrado por nombre
            if (this.filter) {
                const normalizeString = (str) => {
                    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                };

                const filterNormalized = normalizeString(this.filter);

                filteredUsers = filteredUsers.filter(user =>
                    normalizeString(user.name).includes(filterNormalized)
                );
            }

            // Ordenamiento
            if (this.orderBy) {
                filteredUsers.sort((a, b) => {
                    if (this.orderBy === 'name') {
                        return a.name.localeCompare(b.name);
                    } else if (this.orderBy === 'group') {
                        // Assuming 'group' is an array of objects and you want to compare by a specific property
                        // Modify 'a.group' and 'b.group' according to your actual data structure
                        return a.group[0].name.localeCompare(b.group[0].name); // Example: sorting by the name property of the first group
                    }
                });
            }

            return filteredUsers;
        },

    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
.delete-fade-enter-active,
.delete-fade-leave-active {
    transition: opacity 0.5s;
}

.delete-fade-enter-from,
.delete-fade-leave-to {
    opacity: 0;
}
</style>