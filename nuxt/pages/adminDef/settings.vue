<template>
    <div>
        <h1>Configuracio</h1>
        <div>
            <div v-if="!isLoading" class="flex flex-col items-center justify-center w-4/5 p-4 mx-auto">
                <div class="flex items-center justify-between w-full mb-4">
                    <label for="theme" class="text-lg basis-1/2">Escull la temàtica</label>
                    <span class="basis-1/2 flex ">
                        <input class="ml-auto w-1/2 border-2 border-gray-300 p-2 rounded" type="text" name="theme"
                            v-model="settings.theme">
                    </span>
                </div>
                <div class="flex items-center justify-between w-full mb-4">
                    <label class="text-lg " for="showExplicit">No deixar que les cançons marcades com a
                        explicites per spotify es mostrin a la llista per proposar</label>
                    <ModularSwitch :value="settings.showExplicit" :canSwitch=true
                        @input="handleSwitch('showExplicit', $event)" class="w-16" />
                </div>
                <div class="flex items-center justify-between w-full mb-4">
                    <label class="text-lg" for="letProposeExplicit">No deixar que les cançons marcades com
                        a
                        explicites per spotify siguin proposades</label>
                    <ModularSwitch :value="settings.letProposeExplicit" :canSwitch=true
                        @input="handleSwitch('letProposeExplicit', $event)" class="w-16" />
                </div>
                <div class="flex items-center justify-between w-full mb-4">
                    <label class="text-lg" for="alertExplicit">Alertar si una cançó marcada com a
                        explicita
                        per spotify es proposa</label>
                    <ModularSwitch :value="settings.alertExplicit" :canSwitch=true
                        @input="handleSwitch('alertExplicit', $event)" class="w-16" />
                </div>
                <div class="flex items-center justify-center w-full gap-4 text-center">
                    <div class="w-1/2 ml-4">
                        <p class="text-lg mb-2">selecciona la duracio de les votacions</p>
                        <VDatePicker :min-date='new Date()' v-model.range="newVotingSettings" :color="selectedColor"
                            mode="date" expanded />
                    </div>
                    <div class="w-1/2 mr-4">
                        <p class="text-lg mb-2">selecciona la duracio de la moderacio</p>
                        <div class="relative">
                            <div v-if="!minDate" class="absolute h-full w-full z-10">
                                <div class="absolute top-0 left-0 w-full h-full bg-gray-600 opacity-50"></div>
                                <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                    <p class="text-2xl">Selecciona primer les dates de votacions</p>
                                </div>
                            </div>
                            <VDatePicker :min-date='new Date(minDate)' v-model.range="newModerationSettings"
                                :color="selectedColor" mode="date" expanded />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <Loader />
            </div>
        </div>
    </div>
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';
export default {

    data() {
        return {
            isLoading: true,
            settings: {
                start_vote: null,
                end_vote: null,
                start_moderation: null,
                end_moderation: null,
                showExplicit: false,
                letProposeExplicit: false,
                alertExplicit: true,
                theme: '',
                teacher_email_key: null,
                student_email_key: null,
            },
            newVotingSettings: {
                start: '',
                end: '',
            },
            newModerationSettings: {
                start: '',
                end: '',
            },
            setFalse: false,
            minDate: null,
        };
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
    },

    computed: {
        isVotingDateSet() {
            return this.settings.votingEndDate || this.newVotingSettings.end ? true : false;
        },
        votingEndDate() {
            if (this.settings.end_vote) {
                console.log(this.settings.end_vote);
                this.newVotingSettings.start = this.settings.start_vote;
                this.newVotingSettings.end = this.settings.end_vote;
            } else {
                console.log(this.settings.end_vote);
                console.log(this.settings);
                console.log('no voting end date');
                this.minDate = false;
            }
            if (this.settings.end_moderation) {
                this.newModerationSettings.start = this.settings.start_moderation;
                this.newModerationSettings.end = this.settings.end_moderation;
            }
        },
    },

    watch: {
        newVotingSettings: {
            handler: function () {
                if (this.newVotingSettings.end) {
                    let endDate = new Date(this.newVotingSettings.end);
                    endDate.setDate(endDate.getDate() + 1);
                    this.minDate = endDate;
                }
            },
            deep: true
        },
        isLoading: {
            handler: function () {
                if (!this.isLoading && this.settings) {
                    this.votingEndDate;
                }
            },
            deep: true
        }
    },

    mounted() {
        socket.emit('getSettings', this.store.getUser().token);

        socket.on('sendSettings', (settings) => {
            console.log(settings);
            if (settings.length != 0) {
                this.settings = settings[0];
            }
            this.isLoading = false;
        });
    },

    setup() {
        const store = useAppStore();
        return { store };
    },
}

</script>

<style scoped></style>