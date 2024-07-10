<template>
    <ModularAdminLayout title="Usuaris">
        <div class="flex justify-between space-x-4 w-full" v-if="loading">
            <div class="flex flex-col w-1/3 space-y-0.5">
                <USkeleton v-for="i in 20" class="h-10" />
            </div>
            <USkeleton class="h-auto w-2/3" />
        </div>
        <div v-else>
            <div v-if="users.length === 0" class="w-full">
                <p class="text-center text-xl">No hi ha cap usuari registrat a l'aplicació.</p>
            </div>
            <div v-else>
                <UserDetails v-bind:user="currentSelectedUser" />
            </div>
        </div>
        <!-- <div v-if="loading" class="loading">
            <Loader />
        </div>
        <div v-else>
            <div v-if="users.length === 0" class="w-full">
                <p class="text-center text-xl">No hi ha cap usuari registrat a l'aplicació.</p>
            </div>
            <div class="flex flex-row mt-8">

                <div class="w-2/3 text-white text-center ml-4 mr-4">
                    <UserDetails v-bind:user="currentSelectedUser" />
                </div>
            </div>
        </div> -->
    </ModularAdminLayout>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';
import UserDetails from '~/components/UserDetails.vue';

export default {
    data() {
        return {
            // currentSelectedUser: null,
            search: "",
            filter: "Tots",
            isDropdownMenuOpen: false,
            classGroups: computed(() => this.store.getClassGroups()),
            users: computed(() => this.store.getUsersAdminView()),
        }
    },
    methods: {
        selectUser(selectedUser) {
            this.store.setAdminSelectedUser(selectedUser);
        },
        isSelected(user) {
            let style = "user-item--not-selected";

            if (user == this.currentSelectedUser) {
                style = "user-item--selected";
            }

            return style;
        },
    },
    created() {
        if (this.store.getUsersAdminView().length <= 0) {
            this.store.setLoadingAdminComponent(true);
            comManager.getUsers();
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
            let filteredUsers;

            if (this.filter !== "Tots") {
                filteredUsers = this.users.filter((user) => {
                    return user.groups.some(grupo => grupo.id === this.filter);
                });
            } else {
                filteredUsers = this.users;
            }

            if (this.search.trim() !== '') {
                filteredUsers = filteredUsers.filter((user) => {
                    return user.name.toLowerCase().includes(this.search.toLowerCase());
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

<style scoped></style>