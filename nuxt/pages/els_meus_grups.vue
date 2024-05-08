<template>
    <div class="mt-6 mb-8 px-6 w-full md:w-3/4 lg:w-2/4 xl:w-2/5 md:mx-auto">
        <div class="h-[84vh] flex justify-center" v-if="loading">
            <Loader />
        </div>
        <div v-else>
            <h2 class="text-center text-2xl mb-4">ELS MEUS GRUPS</h2>
            <USelectMenu v-model="selectGroups.selected" :options="selectGroups.groups" option-attribute="abbreviation"
                class="mb-4" />
            <div v-for="group in selectGroups.groups">
                <div v-if="group.abbreviation == selectGroups.selected.abbreviation">
                    <div v-if="myUser.role_id == 5" class="flex flex-col gap-3">
                        <div v-for="user in group.usuaris"
                            class="h-16 flex flex-row justify-between items-center rounded-lg p-3 bg-[#383838] text-white">
                            <div class="overflow-x-hidden">
                                <p class="font-black truncate">{{ user.name }}</p>
                            </div>
                            <button v-if="user.role_id == 5" @click="reportUser(user)">
                                <span class="material-symbols-rounded text-4xl">
                                    report
                                </span>
                            </button>
                        </div>
                    </div>
                    <div v-else class="flex flex-col gap-3">
                        <div v-for="user in group.usuaris" class="w-full flex flex-col">
                            <button @click="user.isOpen = !user.isOpen"
                                class="h-16 flex flex-row justify-between items-center p-3 bg-[#383838] text-white"
                                :class="user.isOpen && user.role_id == 5 ? 'rounded-t-lg' : 'rounded-md'">
                                <div class="flex flex-row items-center gap-3">
                                    <div v-if="group.reports.some(report => report.userId == user.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                            fill="rgb(239 68 68)"
                                            class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                                        </svg>
                                    </div>
                                    <span>{{ user.name }}</span>
                                </div>
                                <span v-if="user.role_id == 5"
                                    class="i-heroicons-chevron-down-20-solid transform transition-transform duration-200"
                                    :class="user.isOpen ? 'rotate-180' : ''"></span>
                            </button>
                            <div v-if="user.isOpen && user.role_id == 5"
                                class="bg-white text-black rounded-b-lg p-2 transition-all ease-in-out duration-1000"
                                :class="user.isOpen ? 'h-full' : 'h-0'">
                                <button v-if="group.reports.some(report => report.userId == user.id)"
                                    class="flex flex-row align-items leading-10 gap-4" @click="userReportChecked(user)">
                                    <span class="material-symbols-rounded text-4xl">
                                        done
                                    </span>
                                    <span>MARCAR COM A REVISAT</span>
                                </button>
                                <button class="flex flex-row align-items leading-10 gap-4" @click="deleteUser(user)">
                                    <span class="material-symbols-rounded text-4xl">
                                        delete
                                    </span>
                                    <span>ELIMINAR DEL GRUP</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- REPORT USER DOESN'T BELONG TO A GROUP MODAL -->
    <UModal v-model="modals.reportUser" class="z-[9999]">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center">
                        <span class="material-symbols-rounded text-[2rem] text-yellow-500 mr-4">
                            warning
                        </span>
                        <h2 class="text-xl font-bold">Reportar usuari</h2>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="modals.reportUser = false" />
                </div>
            </template>

            <div>Vols reportar que l'usuari <span class="font-bold">{{ selectedUser.name }}</span> no pertany al grup <span
                    class="font-bold">{{ selectGroups.selected.abbreviation }}</span>?</div>

            <template #footer>
                <div class="flex justify-end">
                    <div class="flex justify-end space-x-4">
                        <UButton @click="submitReportUser()" color="red" class="px-4 py-2 text-sm">
                            Reporta
                        </UButton>
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>

    <!-- DELETE USER FROM A GROUP MODAL -->
    <UModal v-model="modals.deleteUser" class="z-[9999]">
        <UCard>
            <template #header>
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center">
                        <span class="material-symbols-rounded text-[2rem] text-yellow-500 mr-4">
                            warning
                        </span>
                        <h2 class="text-xl font-bold">Eliminar usuari del grup</h2>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="modals.deleteUser = false" />
                </div>
            </template>

            <div>Vols eliminar l'usuari <span class="font-bold">{{ selectedUser.name }}</span> del grup <span
                    class="font-bold">{{ selectGroups.selected.abbreviation }}</span>?</div>

            <template #footer>
                <div class="flex justify-end">
                    <div class="flex justify-end space-x-4">
                        <UButton @click="submitDeleteUser()" color="red" class="px-4 py-2 text-sm">
                            Eliminar
                        </UButton>
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>

    <ModularToast v-bind:serverResponse="serverResponse" time="10000" />
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            items: [{
                label: 'Getting Started',
                icon: 'i-heroicons-information-circle',
                defaultOpen: true,
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
            }, {
                label: 'Installation',
                icon: 'i-heroicons-arrow-down-tray',
                disabled: true,
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
            }],
            store: useAppStore(),
            loading: true,
            selectGroups: {
                groups: [],
                selected: null
            },
            selectedUser: null,
            modals: {
                reportUser: false,
                deleteUser: false,
            }
        }
    },
    methods: {
        addIsOpen() {
            console.log(this.selectGroups.groups);
            for (let i = 0; i < this.selectGroups.groups.length; i++) {

                for (let j = 0; j < this.selectGroups.groups[i].usuaris.length; j++) {
                    this.selectGroups.groups[i].usuaris[j].isOpen = false;
                }
            }

            console.log(this.selectGroups.groups);
        },
        reportUser(user) {
            this.selectedUser = user;
            this.modals.reportUser = true;
        },
        userReportChecked(user) {
            this.selectedUser = user;
            socket.emit('userReportChecked', this.store.getUser().token, this.selectedUser.id, this.selectGroups.selected.id);
            console.log(this.selectGroups)
            const i = this.selectGroups.selected.reports.findIndex((user) => user.userId == this.selectedUser.id);
            this.selectGroups.selected.reports.splice(i, 1);
        },
        deleteUser(user) {
            this.selectedUser = user;
            this.modals.deleteUser = true;
        },
        submitReportUser() {
            socket.emit('reportUser', this.store.getUser().token, this.selectedUser.id, this.selectGroups.selected.id);
            this.modals.reportUser = false;
        },
        submitDeleteUser() {
            socket.emit('deleteUserFromGroup', this.store.getUser().token, this.selectedUser.id, this.selectGroups.selected.id);
            this.modals.deleteUser = false;
            const i = this.selectGroups.selected.usuaris.findIndex((user) => user.id == this.selectedUser.id);
            this.selectGroups.selected.usuaris.splice(i, 1);
        }
    },
    async created() {
        this.loading = true;
        this.selectGroups.groups = await comManager.getUserGroups();
        this.addIsOpen();
        this.selectGroups.selected = this.selectGroups.groups[0];
        this.loading = false;
    },
    computed: {
        myUser() {
            return this.store.getUser();
        },
        serverResponse() {
            return this.store.getServerResponse();
        },
    }
}
</script>