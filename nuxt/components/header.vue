<template>
    <div class="sticky top-0 left-0 right-0 z-[100] h-fit bg-[#1F1F1F]"
        :class="{ 'px-12': $device.isDesktopOrTablet, 'px-4': $device.isMobileOrTablet }">
        <div class="flex flex-row-reverse md:flex-row justify-between items-center md:h-20">

            <!--MOBILE DESIGN-->
            <div v-if="$device.isMobileOrTablet" class="flex items-center justify-between gap-3 relative w-full py-5">
                <!--BURGER BUTTON-->
                <button class="flex items-center" @click="isSlideoverOpen = !isSlideoverOpen">
                    <span class="material-symbols-outlined text-[2rem]">
                        menu
                    </span>
                </button>
                <!--APP NAME-->
                <NuxtLink :to="'/llista_propostes'">
                    <div class="brand-name text-3xl md:text-4xl font-bold">sound<span>o'clock</span></div>
                </NuxtLink>
                <!--PROFILE IMG -->
                <div class="flex justify-center items-center">
                    <UDropdown class="h-10 w-10" :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                        :popper="{ placement: 'bottom-end', arrow: true }">
                        <div class="h-full w-full rounded-full hover:border-2 hover:border-white">
                            <img v-if="isPicture" class="h-full w-full rounded-full" :src="store.getUser().picture"
                                alt="">
                            <div v-else class="h-full w-full bg-gray-700 rounded-full">
                                <span
                                    class="material-symbols-outlined text-5xl w-full h-full rounded-full flex justify-center items-center">
                                    person
                                </span>
                            </div>
                        </div>
                        <template #item="{ item }">
                            <div class="flex justify-center items-center w-full">
                                <NuxtLink class="text-white" :to="item.route">
                                    {{ item.text }}
                                </NuxtLink>
                            </div>
                        </template>
                    </UDropdown>
                </div>
            </div>

            <!--DESKTOP DESIGN-->
            <!--LOGO -->
            <NuxtLink :to="'/llista_propostes'" class="h-14 w-14" v-if="$device.isDesktopOrTablet">
                <img src="/img/soundoclock-logo-bw.png" alt="" class="h-full w-full">
            </NuxtLink>
            <!--LINKS -->
            <div v-if="$device.isDesktopOrTablet" class="flex flex-row justify-between items-center gap-8 text-lg">
                <NuxtLink v-if="user.role_id <= 3" class="leading-[5rem]" to="/admin" @click="isLoading = true">
                    Administració
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="/llista_final" :class="{'text-blue-300': isRouteActive('llista_final')}">
                    Llista final
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="/llista_propostes" :class="{'text-blue-300': isRouteActive('llista_propostes')}">
                    Votacions
                </NuxtLink>
                <NuxtLink class="leading-[5rem]" to="/ranking" :class="{'text-blue-300': isRouteActive('ranking')}">
                    Ranking provisional
                </NuxtLink>
            </div>
            <!-- PROFILE IMG -->
            <div class="flex justify-center items-center h-14 w-14" v-if="$device.isDesktopOrTablet">
                <UDropdown class="h-full w-full" :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                    :popper="{ placement: 'bottom-end', arrow: true }">
                    <div class="h-full w-full rounded-full hover:border-2 hover:border-white">
                        <img v-if="isPicture" class="h-full w-full rounded-full" :src="store.getUser().picture" alt="">
                        <div v-else class="h-full w-full bg-gray-700 rounded-full">
                            <span
                                class="material-symbols-outlined text-5xl w-full h-full rounded-full flex justify-center items-center">
                                person
                            </span>
                        </div>
                    </div>
                    <template #item="{ item }">
                        <div class="flex justify-center items-center w-full">
                            <NuxtLink class="text-white" :to="item.route">
                                {{ item.text }}
                            </NuxtLink>
                        </div>
                    </template>
                </UDropdown>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="loader">
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
        },
        isRouteActive(routeName) {
            return this.$route.name === routeName;
        }
    },
    computed: {
        items() {
            return [
                [{ text: 'El meu perfil', route: '/el_meu_perfil' }],
                [{ text: 'Els meus grups', route: '/els_meus_grups' }],
                [{ text: 'Tancar Sessió', route: '/logout' }]
            ]
        },
        isPicture() {
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
    color: white !important;
    font-weight: 100;
}

.brand-name>span {
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
    position: fixed;
    top: 50%;
    left: 50%;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    z-index: 100;
}
</style>