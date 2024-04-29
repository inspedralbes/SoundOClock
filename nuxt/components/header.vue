<template>
    <div class="sticky top-0 left-0 right-0 z-[100] h-fit bg-slate-200 px-8 py-4">
        <div class="flex flex-row justify-between h-14 md:h-20">
            <!--LOGO AND BRANDNAME-->
            <div class="flex flex-row  items-center gap-4">
                <img v-if="$device.isDesktopOrTablet" src="/img/soundoclock-logo.svg" alt="" class="h-full">
                <div class="brand-name text-3xl md:text-4xl font-bold">sound<span>o'clock</span></div>
            </div>
            <!--MOBILE AND TABLET DESIGN-->
            <div v-if="$device.isMobileOrTablet" class="flex flex-row items-center relative">
                <!--NAVBAR BURGER BUTTON-->
                <button @click="toggleDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 6l16 0" />
                        <path d="M4 12l16 0" />
                        <path d="M4 18l16 0" />
                    </svg>
                </button>
                <!--DROPDOWN-->
                <!-- <div class="dropdown flex flex-col gap-2 rounded border-[1px] border-gray-300 bg-white p-4 absolute top-[80px] md:top-[110px] right-[-20px] w-fit whitespace-nowrap shadow-md text-black z-[100]" :class="{'dropdown--displayed' : showDropdown}">
                    <button class="text-right">Tancar Sessió</button>
                </div> -->
            </div>
            <!--DESKTOP DESIGN-->
            <div v-else class="flex flex-row justify-center gap-8 text-black text-lg">
                <button @click="logout()">Tancar Sessió</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '../communicationManager';

export default {
    data() {
        return {
            showDropdown: false
        }
    },
    methods: {
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        logout() {
            navigateTo({ path: '/logout' });
        }
    },
    created() {

    },
    computed: {

    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
.header {
    height: 15vh;
}

.brand-name {
    color: black;
}

.brand-name>span,
div>button:hover,
div>button:active {
    background-color: var(--pedralbes-blue);
    background-image: linear-gradient(90deg, var(--pedralbes-blue), #af4261);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
}

.dropdown {
    transition: transform 0.3s;
    transform: scaleY(0);
}

.dropdown--displayed {
    transform: scaleY(1);
}
</style>