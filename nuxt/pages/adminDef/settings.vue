<template>
    <div class="flex flex-col justify-center !h-4/5 !grow-0">
        <div v-if="isLoading">
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
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg " for="showExplicit">
                    No deixar que les cançons marcades com a explicites per spotify es mostrin a la llista per
                    proposar
                </label>
                <ModularSwitch :value="settings.showExplicit" :canSwitch=true
                    @input="handleSwitch('showExplicit', $event)" class="w-16" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg" for="letProposeExplicit">
                    No deixar que les cançons marcades com a explicites per spotify siguin proposades
                </label>
                <ModularSwitch :value="settings.letProposeExplicit" :canSwitch=true
                    @input="handleSwitch('letProposeExplicit', $event)" class="w-16" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label class="text-lg" for="alertExplicit">
                    Alertar si una cançó marcada com a explicita per spotify es proposa
                </label>
                <ModularSwitch :value="settings.alertExplicit" :canSwitch=true
                    @input="handleSwitch('alertExplicit', $event)" class="w-16" />
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label for="theme" class="text-lg basis-1/5">
                    Duracio de la votacio
                </label>
                <span class="grow flex items-center justify-center">
                    <UButtonGroup class="w-1/4" orientation="horizontal">
                        <UButton @click="handleSwitch('isVoteInDays', true)" class="w-1/2 *:mx-auto"
                            :class="[isVoteInDays ? 'bg-blue-700' : '']" label="Dies" color="blue" />
                        <UButton @click="handleSwitch('isVoteInDays', false)" class="w-1/2 *:mx-auto"
                            :class="[!isVoteInDays ? 'bg-blue-700' : '']" label="Setmanes" color="blue" />
                    </UButtonGroup>
                </span>
                <span class="basis-1/5 flex">
                    <UInput class="ml-auto w-4/5 *:text-white" color="blue" type="number" name="theme"
                        v-model="settings.voteDuration" />
                </span>
            </div>
            <div class="flex items-center justify-between w-full py-2 h-20">
                <label for="theme" class="text-lg basis-1/5">
                    Duracio de la moderacio
                </label>
                <span class="grow flex items-center justify-center">
                    <UButtonGroup class="w-1/4" orientation="horizontal">
                        <UButton @click="handleSwitch('isModInDays', true)" class="w-1/2 *:mx-auto"
                            :class="[isModInDays ? 'bg-blue-700' : '']" label=" Dies" color="blue" />
                        <UButton @click="handleSwitch('isModInDays', false)" class="w-1/2 *:mx-auto"
                            :class="[!isModInDays ? 'bg-blue-700' : '']" label="Setmanes" color="blue" />
                    </UButtonGroup>
                </span>
                <span class="basis-1/5 flex">
                    <UInput class="ml-auto w-4/5 *:text-white" color="blue" type="number" name="theme"
                        v-model="settings.moderationDuration" />
                </span>
            </div>
        </div>
        <div v-if="!isLoading" class="flex align-center w-4/5 mx-auto basis-1/3">
            <UButton @click="postConf()" class="w-1/4 flex justify-center align-center ml-auto" color="green" size="xl">
                Guardar configuracio
            </UButton>
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
                voteDuration: 0,
                start_vote: null,
                end_vote: null,
                moderationDuration: 0,
                start_moderation: null,
                end_moderation: null,
                showExplicit: false,
                letProposeExplicit: false,
                alertExplicit: true,
                theme: "",
                teacher_email_key: "",
                student_email_key: "",
            },
            minDate: null,
            isVoteInDays: true,
            isModInDays: true,
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
                case 'isVoteInDays':
                    this.isVoteInDays = value;
                    break;
                case 'isModInDays':
                    this.isModInDays = value;
                    break;
            }
        },

        daySetter(days, minDateDays) {
            let initDate = new Date();
            let endDate = new Date();
            if (minDateDays != 0) {
                initDate.setDate(initDate.getDate() + minDateDays + 1);
            }
            endDate.setDate(initDate.getDate() + days);
            initDate = this.formatDateToLaravel(initDate);
            endDate = this.formatDateToLaravel(endDate);
            return { initDate, endDate };
        },

        formatDateToLaravel(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        },

        postConf() {
            let setVoteDate = {};
            let setModDate = {};
            if (this.settings.voteDuration != 0) {
                this.settings.voteDuration = this.isVoteInDays ? this.settings.voteDuration : this.settings.voteDuration * 7;
                setVoteDate = this.daySetter(this.settings.voteDuration, 0);
                this.settings.start_vote = setVoteDate.initDate;
                this.settings.end_vote = setVoteDate.endDate;
                if (this.settings.moderationDuration != 0) {
                    this.settings.moderationDuration = this.isModInDays ? this.settings.moderationDuration : this.settings.moderationDuration * 7;
                    setModDate = this.daySetter(this.settings.moderationDuration, this.settings.voteDuration);
                    this.settings.start_moderation = setModDate.initDate;
                    this.settings.end_moderation = setModDate.endDate;
                }
            }
            socket.emit('setSettings', this.store.getUser().token, this.settings);
        },

    },

    mounted() {
        socket.emit('getSettings', this.store.getUser().token);

        socket.on('sendSettings', (settings) => {
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