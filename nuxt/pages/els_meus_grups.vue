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
                <div v-if="group.abbreviation == selectGroups.selected.abbreviation" class="flex flex-col gap-3">
                    <div v-for="user in group.usuaris"
                        class="h-16 grid grid-cols-12 items-center rounded-lg p-3 bg-[#383838] text-white">
                        <div class="col-span-10 text-start">
                            <p class="font-black truncate max-w-full">{{ user.name }}</p>
                        </div>
                        <div v-if="group.reports.some(report => report.userId == user.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                fill="rgb(239 68 68)" class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                            </svg>
                        </div>
                        <button class="col-span-2 justify-self-end" v-if="user.role_id == 4" @click="reportUser(user)">
                            <span class="material-symbols-rounded text-4xl">
                                report
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
                        @click="modals.reportModal = false" />
                </div>
            </template>

            <div>Vols reportar que l'usuari <span class="font-bold">{{ selectedUser.name }}</span> no pertany al grup <span
                    class="font-bold">{{ selectGroups.selected.abbreviation }}</span>?</div>

            <template #footer>
                <div class="flex justify-end">
                    <div class="flex justify-end space-x-4">
                        <UButton @click="submitData()" color="red" class="px-4 py-2 text-sm">
                            Reporta
                        </UButton>
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            selectGroups: {
                groups: [],
                selected: null
            },
            selectedUser: null,
            modals: {
                reportUser: false,
            }
        }
    },
    methods: {
        reportUser(user) {
            this.selectedUser = user;
            this.modals.reportUser = true;
        },
        submitData() {
            console.log("data submitted", this.selectedUser.id, this.selectGroups.selected.id);
            socket.emit('reportUser', this.store.getUser().token, this.selectedUser.id, this.selectGroups.selected.id);
            this.modals.reportUser = false;
        }
    },
    async created() {
        this.loading = true;
        this.selectGroups.groups = await comManager.getUserGroups();
        this.selectGroups.selected = this.selectGroups.groups[0];
        // this.formatData();
        this.loading = false;
    },
}
</script>