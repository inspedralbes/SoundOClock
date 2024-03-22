<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import { formatDate } from '../utils';
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
      return formatDate(date);
    },
    banVotingCapacity() {
      console.log(`L'usuari ${this.user.name} no pot votar cançons fins`)
    },
    banProposingCapacity() {
      console.log(`L'usuari ${this.user.name} no pot proposar cançons fins`)
    },
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
    </div>
    <div class="flex flex-row gap-8">
      <div class="w-1/2">
        <h2 class="text-2xl mb-2 text-center">LIMITAR VOTAR CANÇONS</h2>
        <Calendar class="mb-8" v-bind:user="user"/>
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="banVotingCapacity()">LIMITAR VOTACIONS</button>
      </div>
      <div class="w-1/2">
        <h2 class="text-2xl mb-2 text-center">LIMITAR PROPOSAR CANÇONS</h2>
        <Calendar class="mb-8" v-bind:user="user"/>
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="banProposingCapacity()">LIMITAR PROPOSTES</button>
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