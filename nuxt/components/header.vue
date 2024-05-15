<template>
    <div class="sticky top-0 left-0 right-0 z-[100] h-fit bg-slate-200 px-8 py-4">
        <div class="flex flex-row-reverse md:flex-row justify-between h-14 md:h-20">
            <!--LOGO AND BRANDNAME-->
            <div class="flex flex-row  items-center gap-4">
                <img v-if="$device.isDesktopOrTablet" src="/img/soundoclock-logo.svg" alt="" class="h-full">
                <div class="brand-name text-3xl md:text-4xl font-bold">sound<span>o'clock</span></div>
            </div>
            <!--MOBILE AND TABLET DESIGN-->
            <div v-if="$device.isMobileOrTablet" class="flex flex-row items-center gap-3 relative">
                <!--NAVBAR BURGER BUTTON-->
                <button class="flex flex-row items-center" @click="isSlideoverOpen = !isSlideoverOpen">
                    <span class="material-symbols-outlined text-black text-[2rem]">
                        menu
                    </span>
                </button>
                <!-- <button class="flex flex-row items-center" @click="feedback()">
>>>>>>> mobile-navbar
                    <span class="material-symbols-outlined text-black text-[2rem]">
                        unknown_document
                    </span>
                </button>
                <button class="flex flex-row items-center" @click="logout()">
                    <span class="material-symbols-outlined text-black text-[2rem]">
                        logout
                    </span>
                </button> -->
                <!-- <button @click="toggleDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 6l16 0" />
                        <path d="M4 12l16 0" />
                        <path d="M4 18l16 0" />
                    </svg>
                </button> -->
                <!--DROPDOWN-->
                <!-- <div class="dropdown flex flex-col gap-2 rounded border-[1px] border-gray-300 bg-white p-4 absolute top-[80px] md:top-[110px] right-[-20px] w-fit whitespace-nowrap shadow-md text-black z-[100]" :class="{'dropdown--displayed' : showDropdown}">
                    <button class="text-right">Tancar Sessió</button>
                </div> -->
            </div>
            <!--DESKTOP DESIGN-->
            <div v-else class="flex flex-row justify-center items-center gap-5 text-black text-lg">
                <NuxtLink class="leading-[5rem]" to="/llista_final">
                    Llista final
                </NuxtLink>
                <NuxtLink v-if="user.role_id <= 3" class="leading-[5rem]" to="/admin" @click="isLoading = true">
                    Administració
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="/llista_propostes">
                    Votacions
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="/ranking">
                    Ranking provisional
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="https://forms.gle/qKtFKNCgtQjXmpyNA">
                    Feedback
                </NuxtLink>
                <UDropdown class="h-14 w-14" :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                    :popper="{ placement: 'bottom-end', arrow: true }">
                    <!-- <UAvatar class="h-full w-full" size="lg" :src="store.getUser().picture" /> -->
                    <div class="h-full w-full rounded-full hover:border-2 hover:border-white">
                        <img v-if="isPickture" class="h-full w-full rounded-full" :src="store.getUser().picture" alt="">
                        <div v-else class="h-full w-full bg-gray-700 rounded-full">
                            <span
                                class="material-symbols-outlined text-5xl w-full h-full rounded-full flex justify-center items-center">
                                person
                            </span>
                        </div>
                    </div>
                    <template #item="{ item }">
                        <div class="flex justify-center items-center w-full !text-white">
                            <NuxtLink class="" :to="item.route">
                                {{ item.text }}
                            </NuxtLink>
                        </div>
                    </template>
                </UDropdown>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="loader fixed">
        <Loader />
    </div>

    <USlideover v-model="isSlideoverOpen" side="left" :ui="{ width: 'max-w-[75%]' }" class="z-[101]">
        <div class="p-4">
            <button class="float-right" @click="closeSlideover()">
                <span class="material-symbols-outlined">
                    close
                </span>
            </button>
        </div>
        <div class="px-0 flex-1">
            <navbar @close="closeSlideover()" />
        </div>
    </USlideover>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            store: useAppStore(),
            user: computed(() => this.store.getUser()),
            isLoading: false,
            isSlideoverOpen: false
        }
    },
    unmounted() {
        this.isLoading = false;
    },
    methods: {
        closeSlideover() {
            this.isSlideoverOpen = false;
        }
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
    computed: {
        items() {
            return [
                [{ text: 'El meu perfil', route: '/el_meu_perfil' }],
                [{ text: 'Els meus grups', route: '/els_meus_grups' }],
                [{ text: 'Tancar Sessió', route: '/logout' }]
            ]
        },
        isPickture() {
            if (this.store.getUser().picture) {
                return true;
            } else {
                return false;
            }

        }
    }
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
div>button:active,
div>a {
    background-color: var(--pedralbes-blue);
    background-image: linear-gradient(90deg, var(--pedralbes-blue), #af4261);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}

.dropdown {
    transition: transform 0.3s;
    transform: scaleY(0);
}

.dropdown--displayed {
    transform: scaleY(1);
}

.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    z-index: 100;
}
</style>