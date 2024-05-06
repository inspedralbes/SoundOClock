<template>
    <div class="mt-6 mb-8 px-6 w-full md:w-3/4 lg:w-2/4 xl:w-2/5 md:mx-auto">
        <div class="h-[84vh] flex justify-center" v-if="loading">
            <Loader />
        </div>
        <div v-else>
            <h2 class="text-center text-2xl mb-4">ELS MEUS GRUPS</h2>
            <USelectMenu v-model="selectGroups.selected" :options="selectGroups.groups" class="mb-4" />
            <div v-for="group in groups">
                <div v-if="group.abbreviation == selectGroups.selected" class="flex flex-col gap-3">
                    <div v-for="user in group.usuaris"
                        class="h-16 grid grid-cols-12 items-center rounded-lg p-3 bg-[#383838] text-white">
                        <div class="col-span-10 text-start">
                            <p class="font-black truncate max-w-full">{{ user.name }}</p>
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
    <UModal v-model="modals.reportUser" class="z-[9999] text-black">
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

            <div>Vols reportar que l'usuari <span class="font-bold">{{ selectedUser.name }}</span> no pertany al grup <span class="font-bold">{{ selectGroups.selected }}</span>?</div>

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
import comManager from '../communicationManager';

export default {
    data() {
        return {
            loading: true,
            groups: null,
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
        formatData() {
            this.selectGroups.groups = [];
            for (let i = 0; i < this.groups.length; i++) {
                this.selectGroups.groups.push(this.groups[i].abbreviation);
            }

            this.selectGroups.selected = this.selectGroups.groups[0];
        },
        reportUser(user) {
            this.selectedUser = user;
            this.modals.reportUser = true;
        },
        submitData() {
            console.log("data submitted");
            this.modals.reportUser = false;
        }
    },
    async created() {
        this.loading = true;
        this.groups = await comManager.getUserGroups();
        this.formatData();
        this.loading = false;
    },
}
</script>