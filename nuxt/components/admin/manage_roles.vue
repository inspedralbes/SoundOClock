<template>
    <div>
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">ADMINISTRAR PERMISOS D'USUARI</h2>
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
            users: computed(() => store.getUsersAdminView()),
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
    },
}
</script>

<style scoped>
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