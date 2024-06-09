<template>
    <UVerticalNavigation :links="links" :ui="{
        wrapper: 'border-s border-gray-200 dark:border-gray-800 space-y-2',
        base: 'group block border-s -ms-px leading-6 before:hidden',
        padding: 'p-0 ps-4',
        rounded: '',
        font: '',
        ring: '',
        active: 'text-primary-500 dark:text-primary-400 border-current font-semibold',
        inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
    }" />
</template>

<script>
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';

export default {
    data() {
        return {
            links: [
                {
                    label: 'Introduction',
                    to: '/getting-started'
                },
                {
                    label: 'Installation',
                    to: '/getting-started/installation'
                },
                {
                    label: 'Theming',
                    to: '/getting-started/theming'
                },
                {
                    label: 'Shortcuts',
                    to: '/getting-started/shortcuts'
                }
            ]
        };
    }
}
</script>

<style lang="css">
aside {
    transition: 0.2s ease-in-out;
}

aside img {
    transition: 0.2s ease-in-out;
}

.menu-toggle-wrap {
    transition: 0.2s ease-in-out;
}

.menu-toggle:hover span {
    transform: translateX(0.5rem);
    color: var(--pedralbes-blue);
}


.button:hover {
    background-color: gray;
}

.button:hover span:not(.text) {
    color: var(--pedralbes-blue);
}

.isActive {
    background-color: gray;
    border-right: 5px solid var(--pedralbes-blue);
}

.isActive span:not(.text) {
    color: var(--pedralbes-blue);
}
</style>