<template>
    <div class="m-4 md:w-2/4 lg:w-2/5 xl:w-1/3 md:mx-auto">
        <div class="h-[84vh] flex justify-center" v-if="!userData">
            <Loader />
        </div>
        <div v-else>
            <h2 class="text-center text-2xl font-black">EL MEU PERFIL</h2>
            <div class="mt-6">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-3 rounded-full h-full aspect-[1/1] flex justify-center items-center"
                        :class="backgroundColor(userData.role_id)">
                        <div class="w-fit h-fit" v-html="icon(userData.role_id)"></div>
                    </div>
                    <div class="col-span-9 flex flex-col justify-around text-sm">
                        <div>{{ userData.name }}</div>
                        <div>{{ userData.email }}</div>
                        <div>{{ name(userData.role_id) }}</div>
                    </div>
                </div>
                <div class="mt-6">
                    <div class="flex flex-row justify-between">
                        <span class="font-black">ELS MEUS GRUPS</span>
                        <UButton v-if="userData.role_id != 5" class="hover:cursor-pointer" color="cyan" variant="outline" to="/afegir-grup" :ui="{ rounded: 'rounded-full' }" >Afegir-me grup</UButton>
                    </div>
                    <div class="mt-2">
                        <div v-if="!userData.groups > 0" class="text-center">NO ESTÀS EN CAP GRUP</div>
                        <div v-else class="flex flex-row flex-wrap gap-3">
                            <NuxtLink v-for="group in userData.groups" to="/els_meus_grups"
                                class="w-fit px-3 py-2 bg-[#999] grow text-center rounded-full">{{
                                    group.abbreviation }}</NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="mt-6">
                    <span class="font-black">LES MEVES SANCIONS</span>
                    <div class="mt-2">
                        <div v-if="!userData.vote_banned_until && !userData.propose_banned_until" class="text-center">NO
                            TENS CAP SANCIÓ VIGENT</div>
                        <div v-else class="flex flex-col flex-wrap gap-3">
                            <div v-if="userData.vote_banned_until" class="grid grid-cols-12 gap-4">
                                <div class="col-span-2 h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                        fill="rgb(239 68 68)"
                                        class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                                    </svg>
                                </div>
                                <div class="col-span-10 flex flex-col justify-center">
                                    <div>NO POTS VOTAR CANÇONS</div>
                                    <div>FINS EL {{ formatDate(userData.vote_banned_until) }}</div>
                                </div>
                            </div>
                            <div v-if="userData.propose_banned_until" class="grid grid-cols-12 gap-4">
                                <div class="col-span-2 h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                        fill="rgb(239 68 68)"
                                        class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                                    </svg>
                                </div>
                                <div class="col-span-10 flex flex-col justify-center">
                                    <div>NO POTS PROPOSAR CANÇONS</div>
                                    <div>FINS EL {{ formatDate(userData.propose_banned_until) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';
import { formatDate } from '../utils';

export default {
    data() {
        return {
            store: useAppStore(),
            userData: null
        }
    },
    methods: {
        backgroundColor(roleId) {

            let style;

            switch (roleId) {
                case 2:
                    style = "bg-indigo-300";
                    break;
                case 3:
                    style = "bg-orange-300";
                    break;
                case 4:
                    style = "bg-rose-300";
                    break;
                case 5:
                    style = "bg-sky-300";
                    break;
                default:
                    return "bg-sky-300";
            }

            return style;
        },
        icon(roleId) {
            let icon;

            switch (roleId) {
                case 2:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='3.5em'  height='3.5em'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-settings'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z' /><path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' /></svg>";
                    break;
                case 3:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='3.5em'  height='3.5em'  viewBox='0 0 24 24'  fill='currentColor'  class='icon icon-tabler icons-tabler-filled icon-tabler-shield-check'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z' /></svg>";
                    break;
                case 4:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='3.5em'  height='3.5em'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-book-2'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z' /><path d='M19 16h-12a2 2 0 0 0 -2 2' /><path d='M9 8h6' /></svg>";
                    break;
                case 5:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='3.5em'  height='3.5em'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-school'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M22 9l-10 -4l-10 4l10 4l10 -4v6' /><path d='M6 10.6v5.4a6 3 0 0 0 12 0v-5.4' /></svg>";
                    break;
            }

            return icon;

        },
        name(roleId) {
            let name;

            switch (roleId) {
                case 1:
                    name = "Personal tècnic";
                    break;
                case 2:
                    name = "Administració";
                    break;
                case 3:
                    name = "Moderació";
                    break;
                case 4:
                    name = "Professorat";
                    break;
                case 5:
                    name = "Alumnat";
                    break;
            }

            return name;
        },
        formatDate(date) {
            return formatDate(date);
        },
    },
    async created() {
        this.loading = true;
        this.userData = await comManager.getUserInfo(this.store.getUser().token);
        this.loading = false;
    },
    computed: {
        user() {
            return this.store.getUser();
        }
    }
}

</script>

<style></style>