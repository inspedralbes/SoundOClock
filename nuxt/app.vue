<template>
  <!-- <UContainer> -->
  <Header v-if="$route.name !== 'admin'"></Header>
  <NuxtPage class="grow" />
  <!-- </UContainer> -->
  <UNotifications />
</template>

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