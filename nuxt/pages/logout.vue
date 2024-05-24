<template>
    <div class="w-screen h-screen">
        <Loader />
    </div>
</template>

<script>
import { useAppStore } from '@/stores/app';
import comManager from '@/communicationManager';

export default {
    mounted () {
        const store = useAppStore();
        const userToken = store.getUser().token;

        comManager.logout(userToken).then(() => {
            store.setUser(0, "", "", "", null, [], null, null);
            return navigateTo({ path: '/' });
        });
    }
}
</script>

<style lang="scss" scoped>

</style>