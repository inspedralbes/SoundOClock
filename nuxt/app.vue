<template>
  <!-- <UContainer> -->
  <Header
    v-if="$route.name !== 'index' && $route.name !== 'admin' && $route.name !== 'auth-callback-google' && $route.name !== 'escollirGrup'">
  </Header>
  <Loader
    v-if="loading && $route.name !== 'index' && $route.name !== 'auth-callback-google' && $route.name !== 'escollirGrup'"
    class="w-screen h-screen grow" />
  <NuxtPage v-else class="grow" />
  <!-- </UContainer> -->
  <UNotifications />
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
  data() {
    return {
      store: useAppStore()
    }
  },

  computed: {
    loading() {
      return this.store.getLoadingLogin();
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