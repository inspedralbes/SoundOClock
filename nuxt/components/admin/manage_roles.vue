<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">ADMINISTRAR PERMISOS D'USUARI</h2>
        <div class="m-8" v-if="users.length === 0">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-row mt-8">
                <div class="users-container w-1/3 ml-20 overflow-y-auto pr-2">

                    <SearchWithFilters :filters="classGroups" :filterValue="(filter) => filter.abbreviation" @search="search = $event" @filter="filter = $event" />

                    <div class="width flex flex-col justify-center ml-auto mr-auto gap-3">
                        <button v-for="user in filteredUsers" @click="selectUser(user)"
                            class="h-16 flex flex-row justify-between items-center rounded-lg p-3"
                            :class="isSelected(user)">
                            <div class="flex flex-row items-center gap-2">
                                <div class="song-data text-start">
                                    <p class="font-black basis-1/3">{{ user.name }}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="w-2/3 text-white text-center ml-4 mr-4">
                    <AdminUserRolesDetails v-bind:user="currentSelectedUser" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { socket } from '@/socket';

export default {
    data() {
        const store = useAppStore();
        return {
            search: "",
            filter: "Tots",
            classGroups: computed(() => store.getClassGroups()),
            users: computed(() => store.getUsersAdminView()),
            roles: computed(() => store.getRoles()),
            currentSelectedUser: null,
        }
    },
    created() {
        this.currentSelectedUser = this.users[0];
    },
    methods: {
        selectUser(selectedUser) {
            this.currentSelectedUser = selectedUser;
        },
        isSelected(user) {
            let style = "user-item--not-selected";

            if (user.id == this.currentSelectedUser.id) {
                style = "user-item--selected";
            }

            return style;
        },
        refreshUsersList() {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id == this.currentSelectedUser.id) {
                    this.currentSelectedUser = this.users[i];
                }
            }
        }
    },
    computed:{
        loading() {
            return this.store.getLoadingAdminComponent();
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
    watch: {
        users: {
            handler: 'refreshUsersList',
        },
    },
}
</script>

<style scoped>

.users-container {
    height: 85vh;
}

/* Estilos para la barra de desplazamiento en navegadores webkit (Chrome, Safari, etc.) dentro del contenedor .users-container */
/* Estilos para la barra de desplazamiento vertical */
.users-container::-webkit-scrollbar {
  width: 10px; /* Grosor de la barra de desplazamiento vertical */
}

.users-container::-webkit-scrollbar-thumb {
  background-color: #888; /* Color del "pulgar" de la barra de desplazamiento */
  border-radius: 5px; /* Bordes redondeados del "pulgar" */
}

/* Estilos para el fondo de la barra de desplazamiento */
.users-container::-webkit-scrollbar-track {
  background-color: transparent; /* Color del fondo de la barra de desplazamiento (transparente) */
}

/* Estilos para la barra de desplazamiento horizontal */
.users-container::-webkit-scrollbar-horizontal {
  height: 10px; /* Grosor de la barra de desplazamiento horizontal */
}

/* Pseudo-clase hover para el "pulgar" */
.users-container::-webkit-scrollbar-thumb:hover {
  background-color: #bdbdbd; /* Cambiar el color del "pulgar" al pasar el mouse sobre él */
}


.user-item--not-selected {
    background-color: rgb(56, 56, 56);
    color: white;
}

.user-item--selected {
    background-color: white;
    color: rgb(56, 56, 56);
}

.user-item>*:last-child {
    justify-self: flex-end;
}
</style>