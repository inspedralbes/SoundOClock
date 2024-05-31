<template>
    <div class="flex flex-col justify-center !h-4/5 !grow-0">
        <div class="h-screen flex justify-center" v-if="isLoading">
            <Loader />
        </div>
        <div v-else
            class="divide-y last:border-0 flex flex-col items-center justify-around grow w-4/5 py-2 mx-auto basis-2/3">
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label for="theme" class="text-lg basis-1/2">
                    Escull la temàtica
                </label>
                <span class="basis-1/3 flex">
                    <UInput class="ml-auto w-4/5 *:text-white" color="blue" variant="outline" placeholder="Temàtica"
                        type="text" name="theme" v-model="settings.theme" />
                </span>
            </div>
            <div class="flex items-center justify-between w-full py-2 h-fit">
                <label for="themeDesc" class="text-lg basis-1/2">
                    Descripció de la temàtica (opcional)
                </label>
                <span class="basis-1/3 flex">
                    <UTextarea class="ml-auto w-4/5 *:text-white" color="blue" variant="outline"
                        placeholder="Descripcio de la Temàtica" type="text" name="themeDesc"
                        v-model="settings.themeDesc" />
                </span>
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg " for="showExplicit">
                    No deixar que les cançons marcades com a explicites per spotify es mostrin a la llista per
                    proposar
                </label>
                <UToggle v-model="settings.showExplicit" on-icon="i-heroicons-check-20-solid"
                    off-icon="i-heroicons-x-mark-20-solid" color="sky" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg" for="letProposeExplicit">
                    No deixar que les cançons marcades com a explicites per spotify siguin proposades
                </label>
                <UToggle v-model="settings.letProposeExplicit" :disabled="settings.showExplicit"
                    on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" color="sky" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg" for="alertExplicit">
                    Alertar si una cançó marcada com a explicita per spotify es proposa
                </label>
                <UToggle v-model="settings.alertExplicit"
                    :disabled="settings.showExplicit || settings.letProposeExplicit"
                    on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" color="sky" />
                <!-- <ModularSwitch :value="settings.alertExplicit" :canSwitch=true
                    @input="handleSwitch('alertExplicit', $event)" class="w-16" /> -->
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label for="theme" class="text-lg basis-1/5">
                    Duracio de la votacio
                </label>
                <UDateRangePicker :initialStartDate="formatDate(settings.start_vote)"
                    :initialEndDate="formatDate(settings.end_vote)" @rangeSelected="selectVotingRange($event)" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label for="theme" class="text-lg basis-1/5">
                    Duracio de la moderació
                </label>
                <UDateRangePicker :initialStartDate="formatDate(settings.start_moderation)"
                    :initialEndDate="formatDate(settings.end_moderation)"
                    @rangeSelected="selectModerationRange($event)" />
            </div>
        </div>
        <div v-if="!isLoading" class="flex align-center w-4/5 mx-auto basis-1/3">
            <UButton @click="modals.showSave = true" :disabled="isWaiting"
                class="w-1/4 flex justify-center align-center ml-auto" color="green" size="xl">
                <p v-if="!isWaiting">
                    Guardar configuració
                </p>
                <Loader v-else />
            </UButton>
        </div>
        <UModal v-model="modals.showSave" class="z-[9999]">
            <UCard>
                <template #header>
                    <div class="flex flex-row items-center justify-between rounded-lg">
                        <div class="flex flex-row items-center">
                            <span class="material-symbols-rounded text-[2rem] text-yellow-500 mr-4">
                                warning
                            </span>
                            <h2 class="text-xl font-bold">Vols guardar la configuració?</h2>
                        </div>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="modals.showSave = false" />
                    </div>
                </template>
                Al guardar la configuració, vols que reiniciar les votacions i moderacions actuals?

                <template #footer>
                    <div class="flex flex-row justify-between">
                        <div>
                            <UButton variant="ghost" color="gray" @click="modals.showSave = false">Cancel·lar</UButton>
                        </div>
                        <div class="flex flex-row">
                            <div class="mr-2">
                                <UButton color="red" @click="postConf(1)">Guardar i eliminar</UButton>
                            </div>
                            <div>
                                <UButton @click="postConf(0)">Guardar</UButton>
                            </div>
                        </div>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';
import comManager from '@/communicationManager.js';
export default {

    data() {
        return {
            isLoading: true,
            isWaiting: false,
            modals: {
                showSave: false,
            },
            settings: {
                start_vote: null,
                end_vote: null,
                moderationDuration: 0,
                start_moderation: null,
                end_moderation: null,
                showExplicit: false,
                letProposeExplicit: false,
                alertExplicit: true,
                theme: "",
                themeDesc: "",
                teacher_email_key: "",
                student_email_key: "",
            },
            voteHasChanged: false,
            modHasChanged: false,
            unformattedEndingVote: null,
            toast: null,
        };
    },

    computed: {
    },

    methods: {
        handleSwitch(target, value) {
            switch (target) {
                case 'showExplicit':
                    this.settings.showExplicit = value;
                    break;
                case 'letProposeExplicit':
                    this.settings.letProposeExplicit = value;
                    break;
                case 'alertExplicit':
                    this.settings.alertExplicit = value;
                    break;
            }
        },
        formatDateToLaravel(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        },
        formatDate(dateString) {
            // Separar el año, mes y día del string de fecha
            const [year, month, day] = dateString.split('-');
            // Crear un objeto de tipo Date usando los valores obtenidos
            const dateObject = new Date(year, month - 1, day);
            return dateObject; // Devolver el objeto Date
        },
        postConf(event) {

            // if (this.settings.voteDuration != 0) {
            // this.settings.voteDuration = this.isVoteInDays ? this.settings.voteDuration : this.settings.voteDuration * 7;
            // setVoteDate = this.daySetter(this.settings.voteDuration, 0);
            // this.settings.start_vote = setVoteDate.initDate;
            // this.settings.end_vote = setVoteDate.endDate;
            // if (this.settings.moderationDuration != 0) {
            //     this.settings.moderationDuration = this.isModInDays ? this.settings.moderationDuration : this.settings.moderationDuration * 7;
            //     setModDate = this.daySetter(this.settings.moderationDuration, this.settings.voteDuration);
            //     this.settings.start_moderation = setModDate.initDate;
            //     this.settings.end_moderation = setModDate.endDate;
            // }
            // }
            this.isWaiting = true;
            this.modals.showSave = false;


            socket.emit('setSettings', this.store.getUser().token, this.settings);

            if (event === 1) {
                socket.emit('deleteVotes');
                // socket.emit('deleteModerations', this.store.getUser().token);
            }
        },
        selectVotingRange(duration) {
            this.voteHasChanged = true;
            this.settings.start_vote = this.formatDateToLaravel(duration.start);
            this.settings.end_vote = this.formatDateToLaravel(duration.end);
        },
        selectModerationRange(duration) {
            this.modHasChanged = true;
            this.settings.start_moderation = this.formatDateToLaravel(duration.start);
            this.settings.end_moderation = this.formatDateToLaravel(duration.end);
        },
    },

    mounted() {
        socket.emit('getSettings', this.store.getUser().token);

        socket.on('sendSettings', (settings) => {
            this.isLoading = false;
            if (settings && !settings.message) {
                this.settings = settings;
            }
        });

        socket.on('getSettingsError', (error) => {
            this.isLoading = false;
            this.toast.add({
                title: 'Error al carregar la configuració',
                description: 'Hi ha hagut un error al carregar la configuració.',
                color: 'red',
            });
        });

        socket.on('settingsUpdated', (message) => {
            this.isWaiting = false;
            this.toast.add({
                title: 'Configuració guardada!',
                description: 'La configuració ha estat guardada correctament.',
                color: 'green',
            });
        });

        socket.on('settingsUpdateError', (error) => {
            this.isWaiting = false;
            this.toast.add({
                title: 'Error al guardar la configuració',
                description: 'Hi ha hagut un error al guardar la configuració.',
                color: 'red',
            });
        });

        this.toast = useToast();
    },

    beforeUnmount() {
        socket.off('sendSettings');
        socket.off('getSettingsError');
        socket.off('settingsUpdated');
        socket.off('settingsUpdateError');
    },

    setup() {
        const store = useAppStore();
        return { store };
    },
    watch: {
        'settings.showExplicit'(newValue) {
            if (newValue) {
                this.settings.letProposeExplicit = false;
                this.settings.alertExplicit = false;
            }
        },
        'settings.letProposeExplicit'(newValue) {
            if (newValue) {
                this.settings.alertExplicit = false;
            }
        },
    }
}

</script>

<style scoped></style>