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
      votingBannedUntil: null,
      proposingBannedUntil: null
    }
  },
  methods: {
    formatDate(date) {
      return formatDate(date);
    },
    banUser(isVotingBeingBanned) {
      if (isVotingBeingBanned) {
        this.user.vote_banned_until = this.formatDateToLaravel(this.votingBannedUntil);
        // console.log(`L'usuari ${this.user.name} no pot votar cançons fins ${this.user.vote_banned_until}.`);
      } else {
        this.user.propose_banned_until = this.formatDateToLaravel(this.proposingBannedUntil);
        // console.log(`L'usuari ${this.user.name} no pot proposar cançons fins ${this.user.propose_banned_until}.`);
      }
      socket.emit('banUser', this.store.getUser().token, this.user);
    },
    enableUser(isVotingBeingEnabled) {
      if (isVotingBeingEnabled) {
        this.user.vote_banned_until = null;
        // console.log(`L'usuari ${this.user.name} pot tornar a votar cançons.`);
      } else {
        this.user.propose_banned_until = null;
        // console.log(`L'usuari ${this.user.name} pot tornar a proposar cançons.`);
      }
      socket.emit('banUser', this.store.getUser().token, this.user);
    },
    changeDate(range, isVotingBannedDate) {

      this.votingBannedUntil = null;
      this.proposingBannedUntil = null;

      if (isVotingBannedDate == true) {
        this.votingBannedUntil = range.end;
      } else {
        this.proposingBannedUntil = range.end;
      }
    },
    formatDateToLaravel(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
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
  <div v-else class="user-details-container rounded-lg text-left p-4">
    <div class="mb-10">
      <p class="text-5xl font-black">{{ user.name }}</p>
    </div>
    <div class="flex flex-row gap-8">
      <div class="w-1/2">
        <p v-if="user.vote_banned_until" class="mb-8 text-xl text-center font-black">L'usuari no pot votar cançons fins
          el {{
    formatDate(user.vote_banned_until) }}</p>
        <p v-else class="mb-8 text-xl text-center font-black">L'usuari no té limitada la capacitat de votar cançons</p>
        <h2 class="text-2xl mb-4 text-center">LIMITAR VOTAR CANÇONS</h2>
        <Calendar class="mb-8" v-bind:date="user.vote_banned_until" :isVotingBannedDate=true @changeDate="changeDate" />
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded me-2"
          @click="banUser(true)">LIMITAR VOTACIONS</button>
        <button class="w-fit bg-gray-400 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"
          @click="enableUser(true)">HABILITAR VOTACIONS</button>
      </div>
      <div class="w-1/2">
        <p v-if="user.propose_banned_until" class="mb-8 text-xl text-center font-black">L'usuari no pot proposar cançons
          fins el {{
    formatDate(user.propose_banned_until) }}</p>
        <p v-else class="mb-8 text-xl text-center font-black">L'usuari no té limitada la capacitat de proposar cançons
        </p>
        <h2 class="text-2xl mb-4 text-center">LIMITAR PROPOSAR CANÇONS</h2>
        <Calendar class="mb-8" v-bind:date="user.propose_banned_until" :isVotingBannedDate=false
          @changeDate="changeDate" />
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded me-2"
          @click="banUser(false)">LIMITAR PROPOSTES</button>
        <button class="w-fit bg-gray-400 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"
          @click="enableUser(false)">HABILITAR PROPOSTES</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-details-container {
  background-color: rgb(56, 56, 56);
  height: 85vh;
}
</style>