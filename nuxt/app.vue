<template>
  <!-- <UContainer> -->
  <Header
    v-if="$route.name !== 'index' && $route.name !== 'admin' && $route.name !== 'admin2' && $route.name !== 'auth-callback-google' && $route.name !== 'escollirGrup' && $route.name !== 'a'">
  </Header>
  <!-- <Loader v-if="loading" class="w-screen h-screen grow" /> -->
  <NuxtPage class="grow" />
  <!-- </UContainer> -->
  <UNotifications />
</template>

<script>
// import { useAppStore } from '@/stores/app';
import { socket } from '@/socket';

export default {
  data() {
    return {
      // store: useAppStore()
    }
  },
  created() {
    socket.on("borrarLocalStorage", () => {
      localStorage.clear();
      this.$router.push({ name: 'index' });
    });
  },
  computed: {
    loading() {
      // return this.store.getLoadingLogin();
    }
  }

}

</script>

<style>
body {
  margin: 0;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
}

#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.grow {
  flex-grow: 1;
}
</style>