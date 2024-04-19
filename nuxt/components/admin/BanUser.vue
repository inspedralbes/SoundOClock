<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">BLOQUEJAR USUARIS</h2>
        <div class="m-8" v-if="users.length === 0">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-row mt-8">
                <div class="users-container w-1/3 ml-20 overflow-y-auto">
                    <!-- Buscador amb buto de filtres -->
                    <div class="sticky top-0 h-10 w-full flex flex-col justify-center justify-between ml-auto mr-auto gap-1 mb-2">
                        <div class="flex flex-row gap-2 h-10" >
                            <input type="text" placeholder="Busca..." v-model="search"
                                class="h-full w-full items-center rounded-lg p-3 border-2 border-white">
                            <button @click="isDropdownMenuOpen = !isDropdownMenuOpen"
                                class="h-full w-10 flex justify-center items-center rounded-lg bg-[#383838] border-2 border-white">
                                <span class="material-symbols-outlined text-white">
                                    tune
                                </span>
                            </button>

                        </div>
                        <div class="sticky top-0 w-full left-0">
                        <div id="dropdown-menu" :class="{ 'hidden': !isDropdownMenuOpen, 'block': isDropdownMenuOpen }"
                            class="bg-[#383838] border-2 border-white rounded-lg shadow-lg">
                            <ul class="bg-[#383838] rounded-lg">
                                <li class="hover:bg-black rounded-lg w-full p-1"><button
                                        class="rounded-lg w-full p-1 hover:bg-black text-left"
                                        @click="filter = 'Tots', isDropdownMenuOpen = !isDropdownMenuOpen">Tots</button>
                                </li>
                                <li v-for="group, index in classGroups" :key="group.id"
                                    @click="filter = group.id, isDropdownMenuOpen = !isDropdownMenuOpen"
                                    class="rounded-lg w-full p-1 hover:bg-black">
                                    <button class="rounded-lg w-full p-1 hover:bg-black text-left">{{
                                        group.abbreviation }}</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>

                    

                    <div class="width flex flex-col justify-center ml-auto mr-auto gap-3">
                        <button v-for="user in filteredUsers" @click="selectUser(user)"
                            class="h-16 flex flex-row justify-between items-center rounded-lg p-3"
                            :class="user === selectedUser ?'user-item--selected':'user-item--not-selected'">
                            <div class="flex flex-row items-center gap-2">
                                <div class="song-data text-start">
                                    <p class="font-black basis-1/3">{{ user.name }}</p>
                                </div>
                            </div>
                            <div v-if="user.vote_banned_until || user.propose_banned_until">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                    fill="rgb(239 68 68)"
                                    class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="w-2/3 text-white text-center ml-4 mr-4">
                    <UserDetails v-bind:user="selectedUser" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { getUsers } from '../../communicationManager';

export default {
    data() {
        return {
            loading: true,
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
    },
    mounted() {
        this.loading = true;
        getUsers();
        this.loading = false;
    },
    computed: {
        users() {
            return this.store.getUsersAdminView();
        },
        selectedUser() {
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

<style scoped>
.sticky-search-bar {
    position: sticky;
    top: 0;
    padding: 10px;
}

.users-container {
    height: 85vh;
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

.contenidor-img {
    position: relative;
    max-width: 20%;
    min-width: fit-content;
    height: 100%;
    width: fit-content;
}

.contenidor-img>button {
    display: none;
}

.contenidor-img:hover>button>svg {
    width: 80%;
    height: auto;
}

.contenidor-img:hover>button {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    background-color: rgb(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 100;
}

.song-data {
    max-width: 100%;
    min-width: 5%;
}

.song-data>p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.contenidor-butons {
    max-width: 20%;
    min-width: fit-content;
    align-self: center;
    margin-left: auto;
}

img {
    width: 60px;
    height: 60px;
}
</style>