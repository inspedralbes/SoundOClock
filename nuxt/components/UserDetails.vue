<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
export default {
  name: 'UserDetails',
  props: {
    user: Object
  },
  data() {
    return {

    }
  },
  methods: {
    formatDate(date) {
      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 10);

      return `${day}-${month}-${year}`;
    }

  },
  setup() {
    const store = useAppStore();
    return { store };
  },
};
</script>

<template>
  <div v-if="user == null">
  </div>
  <div v-else class="contenidor-canço rounded-lg h-screen text-left p-4">
    <div class="mb-10">
      <p class="text-5xl font-black">{{ user.name }}</p>
      <p v-if="user.vote_banned_until" class="text-2xl font-black">L'usuari no pot votar cançons fins el {{
    formatDate(user.vote_banned_until) }}</p>
      <p v-if="user.propose_banned_until" class="text-2xl font-black">L'usuari no pot proposar cançons fins el {{
    formatDate(user.propose_banned_until) }}</p>
      <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">LIMITAR ACCÉS A
        L'APLICACIÓ</button>
    </div>
    <div class="flex flex-row gap-8">
      <div class="w-1/2">
        <h2 class="text-center">LIMITAR VOTAR CANÇONS</h2>
        <Calendar />
      </div>
      <div class="w-1/2">
        <h2>LIMITAR PROPOSAR CANÇONS</h2>
        <Calendar />
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenidor-canço,
.contenidor-report {
  background-color: rgb(56, 56, 56);
}
</style>