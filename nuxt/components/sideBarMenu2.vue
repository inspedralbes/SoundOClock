<template>
    <div class="ml-2 pr-2 my-2 w-1/6 fixed left-0 overflow-y-auto flex flex-col justify-between border-e border-gray-500"
        style="height: calc(100vh - 1rem);">
        <div>
            <div class="mb-4 w-full bg-white rounded-md">
                <img src="/img/logo.jpg" alt="Logo" class="p-2 w-2/3" />
            </div>
            <UAccordion :items="accordion" multiple color="sky" variant="solid" size="xl">
                <template #usuaris>
                    <div class="mx-4">
                        <UVerticalNavigation :links="sidebar.usuaris_links" :ui="vNavUI" />
                    </div>
                </template>
                <template #songs>
                    <div class="mx-4">
                        <UVerticalNavigation :links="sidebar.songs_links" :ui="vNavUI" />
                    </div>
                </template>
                <template #other>
                    <div class="mx-4">
                        <UVerticalNavigation :links="sidebar.other_links" :ui="vNavUI" />
                    </div>
                </template>
            </UAccordion>
        </div>
        <div class="gap-y-4">
            <UButton icon="i-heroicons-cog-6-tooth" class="w-full mb-1.5" size="xl" color="sky" variant="solid"
                label="Configuració" :trailing="false" />
            <UButton icon="i-heroicons-backward-solid" class="w-full mb-1.5" size="xl" color="sky" variant="ghost"
                label="Tornar a Inici" :trailing="false" />
            <UButton icon="i-heroicons-arrow-left-start-on-rectangle-solid" class="w-full mb-1.5" size="xl" color="sky"
                variant="ghost" label="Sortir" :trailing="false" />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            store: useAppStore(),
            sidebar: {
                usuaris_links: [
                    {
                        label: 'Usuaris',
                        to: '/admin2'
                    },
                    {
                        label: 'Rols i permisos',
                        // to: '/getting-started/installation'
                    },
                ],
                songs_links: [
                    {
                        label: 'Horaris de Reproducció',
                        // to: '/getting-started/installation'
                    },
                    {
                        label: 'Cançons Bloquejades',
                        // to: '/getting-started'
                    },
                    {
                        label: 'Informes de Cançons',
                        // to: '/getting-started/installation'
                    },
                    {
                        label: 'Programació de Cançons',
                        // to: '/getting-started'
                    },
                    {
                        label: 'Gestió de Megafonia',
                        // to: '/getting-started'
                    },
                ],
                other_links: [
                    {
                        label: 'Gestió de Grups',
                        // to: '/getting-started/installation'
                    },
                ]
            },
            accordion: [
                {
                    label: `Gestió d'usuaris`,
                    icon: 'i-heroicons-user-group',
                    slot: 'usuaris',
                    defaultOpen: true,
                },
                {
                    label: `Gestió de cançons`,
                    icon: 'i-heroicons-musical-note',
                    slot: 'songs',
                    defaultOpen: true,
                },
                {
                    label: `Altres gestions`,
                    icon: 'i-heroicons-ellipsis-vertical',
                    slot: 'other',
                    defaultOpen: true,
                },
            ],
            vNavUI: {
                label: 'text-base',
                wrapper: 'border-s border-gray-200 dark:border-gray-500 space-y-2',
                base: 'group block border-s -ms-px leading-6 before:hidden',
                padding: 'p-0 ps-4',
                rounded: '',
                font: '',
                ring: '',
                active: 'text-primary-500 dark:text-white border-sky-500 text-left',
                inactive: 'border-transparent hover:border-gray-400 dark:hover:border-sky-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-left'
            }
        };
    }
}
</script>
