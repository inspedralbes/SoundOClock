<template>
    <div class="h-fit flex flex-col text-lg divide-y-2 border-y-2 border-white text-[1.15rem]">
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/llista_propostes" @click="close()">
            <UIcon name="i-heroicons-musical-note-16-solid text-[28px]" />
            <span>Votacions</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/els_meus_grups" @click="close()">
            <UIcon name="i-heroicons-user-group-16-solid text-[28px]" />
            <span>Els meus grups</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/ranking" @click="close()">
            <UIcon name="i-heroicons-hand-thumb-up-16-solid text-[28px]" />
            Ranking provisional
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="https://forms.gle/qKtFKNCgtQjXmpyNA">
            <UIcon name="i-heroicons-speaker-wave-20-solid text-[28px]" />
            Feedback
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/logout" @click="close()">
            <span class="material-symbols-outlined text-[28px]">
                logout
            </span>
            Tancar sessió
        </NuxtLink>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
        }
    },
    methods: {
        close() {
            this.$emit('close');
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

<style scoped></style>