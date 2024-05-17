<template>
    <div class="h-fit flex flex-col text-lg divide-y-2 border-y-2 border-white text-[1.15rem]">
        <NuxtLink v-if="user.role_id <= 3" class="px-4 py-4 flex align-center gap-3" to="/admin" @click="close()">
            <span class="material-symbols-outlined text-[2rem]">
                admin_panel_settings
            </span>
            <span>Administració</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/llista_final" @click="close()">
            <UIcon name="i-heroicons-musical-note-16-solid text-[2rem]" />
            <span>Llista Final</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/llista_propostes" @click="close()">
            <UIcon name="i-heroicons-hand-thumb-up-16-solid text-[2rem]" />
            <span>Votacions</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/ranking" @click="close()">
            <UIcon name="i-heroicons-trophy-16-solid text-[2rem]" />
            <span>Ranking provisional</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/el_meu_perfil" @click="close()">
            <UIcon name="i-heroicons-user-16-solid text-[2rem]" />
            <span>Els meu perfil</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/els_meus_grups" @click="close()">
            <UIcon name="i-heroicons-user-group-16-solid text-[2rem]" />
            <span>Els meus grups</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="https://forms.gle/qKtFKNCgtQjXmpyNA">
            <UIcon name="i-heroicons-speaker-wave-20-solid text-[2rem]" />
            <span>Feedback</span>
        </NuxtLink>
        <NuxtLink class="px-4 py-4 flex align-center gap-3" to="/logout" @click="close()">
            <span class="material-symbols-outlined text-[2rem]">
                logout
            </span>
            <span>Tancar sessió</span>
        </NuxtLink>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            user: computed(() => this.store.getUser()),
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