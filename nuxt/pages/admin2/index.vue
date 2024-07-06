<template>
    <div class="w-screen h-screen" v-if="loading">
        <Loader />
    </div>
    <SideBarMenu2 />

    <!-- <component :is="active_screen" v-if="!loading" /> -->
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            store: useAppStore(),
            selected_screen: computed(() => this.store.admin.selected_screen),
            screens: {
                0: resolveComponent('AdminAlarmsCrud'),
                1: resolveComponent('AdminGroupsCrud'),
                2: resolveComponent('AdminBanSong'),
                3: resolveComponent('AdminBanUser'),
                4: resolveComponent('AdminBlackListCrud'),
                5: resolveComponent('AdminScript'),
                6: resolveComponent('AdminSetSongs'),
                7: resolveComponent('AdminManageRoles'),
                8: resolveComponent('AdminSettings'),
            },
            loading: false,
        }
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
    created() {
        socket.emit('getGroups', this.store.getUser().token);
    },
    methods: {
        changeScreen(screen) {
            this.store.setAdminSelectedScreen(screen);
        }
    },
    computed: {
        active_screen() {
            return this.screens[this.selected_screen];
        }
    }
}
</script>

<style></style>