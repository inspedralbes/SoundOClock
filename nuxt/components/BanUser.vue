<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">BLOQUEJAR USUARIS</h2>
        <div class="m-8" v-if="users.length === 0">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-row mt-8">
                <div class="users-container w-1/3 ml-20 overflow-y-auto">
                    <div class="width flex flex-col justify-center ml-auto mr-auto gap-3">
                        <button v-for="user in users" @click="selectUser(user)"
                            class="h-16 flex flex-row justify-between items-center rounded-lg p-3"
                            :class="isSelected(user)">
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
                    <UserDetails v-bind:user="currentSelectedUser" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
// import { getUsers } from '../communicationManager';

export default {
    data() {
        return {
            currentSelectedUser: null
        }
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
    },
    created() {
        this.currentSelectedUser = this.users[0];
    },
    computed: {
        users() {
            return this.store.getUsersAdminView();
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
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