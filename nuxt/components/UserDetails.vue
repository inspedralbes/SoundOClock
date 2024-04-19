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
      isVotingBeingChanged: false,
      votingBannedUntil: null,
      proposingBannedUntil: null,
      weeksVotingBannedUntil: null,
      weeksProposingBannedUntil: null,
      optionVotingBannedUntil: null,
      optionProposingBannedUntil: null,
      toggleVotingBanUserCustomize: true,
      toggleProposingBanUserCustomize: true,
      modals: {
        noDateSelected: false,
        banUserVotingCapacity: false,
        unbanUserVotingCapacity: false,
        banUserProposingCapacity: false,
        unbanUserProposingCapacity: false,
        banUserVotingWithDefaultOptions: false,
        banUserProposingWithDefaultOptions: false,
        enableUserVotingWithDefaultOptions: false,
        enableUserProposingWithDefaultOptions: false,
      }
    }
  },
  methods: {
    formatDate(date) {
      return formatDate(date);
    },
    banUser(isVotingBeingBanned) {
      this.isVotingBeingChanged = isVotingBeingBanned;
      if ((isVotingBeingBanned && !this.votingBannedUntil) || (!isVotingBeingBanned && !this.proposingBannedUntil)) {
        this.modals.noDateSelected = true;
      } else {
        if (isVotingBeingBanned) {
          this.votingBannedUntil = this.formatDateToLaravel(this.votingBannedUntil);
          this.modals.banUserVotingCapacity = true;
        } else {
          this.proposingBannedUntil = this.formatDateToLaravel(this.proposingBannedUntil);
          this.modals.banUserProposingCapacity = true;
        }
      }

    },
    enableUser(isVotingBeingEnabled) {
      this.isVotingBeingChanged = isVotingBeingEnabled;
      if (isVotingBeingEnabled) {
        this.votingBannedUntil = null;
        this.modals.unbanUserVotingCapacity = true;
      } else {
        this.proposingBannedUntil = null;
        this.modals.unbanUserProposingCapacity = true;
      }
    },
    submitData() {

      if (this.isVotingBeingChanged) {
        this.user.vote_banned_until = this.votingBannedUntil;
      } else {
        this.user.propose_banned_until = this.proposingBannedUntil;
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
    },
    getBanDate(option) {
      let date
      switch (option) {
        case 1: // 3 weeks
          date = new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES').replace(/\//g, '-')
          break;
        case 2: // 3 motnhs
          date = new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('es-ES').replace(/\//g, '-')
          break;
        case 3: // 1 year
          date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('es-ES').replace(/\//g, '-')
          break;
      }
      return date
    },
    banUserVotingWithDefaultOptions(option) {
      let date
      switch (option) {
        case 1: // 3 weeks
          date = new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 2: // 3 motnhs
          date = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 3: // 1 year
          date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
      }
      this.user.vote_banned_until = date;
      socket.emit('banUser', this.store.getUser().token, this.user);
    },
    banUserProposingWithDefaultOptions(option) {
      let date
      switch (option) {
        case 1: // 3 weeks
          date = new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 2: // 3 motnhs
          date = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 3: // 1 year
          date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
      }
      this.user.propose_banned_until = date;
      socket.emit('banUser', this.store.getUser().token, this.user);
    },
    enableUserWithDefaultOptions(option) {
      switch (option) {
        case 1: // enable voting
          this.user.vote_banned_until = null;
          break;
        case 2: // enable proposing
          this.user.propose_banned_until = null;
          break;
      }
      socket.emit('banUser', this.store.getUser().token, this.user);
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
        <p v-if="user.vote_banned_until" class="mb-2 text-xl text-center font-black">L'usuari no pot votar cançons fins
          el {{
            formatDate(user.vote_banned_until) }}</p>
        <p v-else class="mb-2 text-xl text-center font-black">L'usuari no té limitada la capacitat de votar cançons</p>
        <h2 class="text-2xl mb-4 text-center">LIMITAR VOTAR CANÇONS</h2>
        <div v-if="toggleVotingBanUserCustomize">
          <div v-if="this.user.vote_banned_until">
            <button class="w-fit bg-gray-400 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"
              @click="modals.enableUserVotingWithDefaultOptions = true">HABILITAR VOTACIONS</button>
          </div>
          <div v-else>
            <div class="flex justify-center mt-4">
              <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 1">Ban 3
                setmanes</button>
              <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 2">Ban 3 mesos</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 3">Ban 1 any</button>
            </div>
            <div>
              <button @click="toggleVotingBanUserCustomize = false"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded me-2 mt-5">Personalitzat</button>
            </div>
          </div>
        </div>
        <div v-else>
          <Calendar class="mb-4" v-bind:date="user.vote_banned_until" :isVotingBannedDate=true
            @changeDate="changeDate" />
          <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded me-2"
            @click="banUser(true)">LIMITAR VOTACIONS</button>
          <button class="w-fit bg-red-400 hover:bg-red-200 text-black font-bold py-2 px-4 rounded float-right"
            @click="toggleVotingBanUserCustomize = true">Cancela</button>
        </div>
      </div>
      <div class="w-1/2">
        <p v-if="user.propose_banned_until" class="mb-2 text-xl text-center font-black">L'usuari no pot proposar cançons
          fins el {{
            formatDate(user.propose_banned_until) }}</p>
        <p v-else class="mb-2 text-xl text-center font-black">L'usuari no té limitada la capacitat de proposar cançons
        </p>
        <h2 class="text-2xl mb-4 text-center">LIMITAR PROPOSAR CANÇONS</h2>

        <div v-if="toggleProposingBanUserCustomize">
          <div v-if="this.user.propose_banned_until">
            <button class="w-fit bg-gray-400 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"
              @click="modals.enableUserProposingWithDefaultOptions = true">HABILITAR PROPOSTES</button>
          </div>
          <div v-else>
            <div class="flex justify-center mt-4">
              <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserProposingWithDefaultOptions = 1; optionProposingBannedUntil = 1">Ban 3
                setmanes</button>
              <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserProposingWithDefaultOptions = 1; optionProposingBannedUntil = 2">Ban 3
                mesos</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded me-2 w-full"
                @click="modals.banUserProposingWithDefaultOptions = 1; optionProposingBannedUntil = 3">Ban 1
                any</button>
            </div>
            <div>
              <button @click="toggleProposingBanUserCustomize = false"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded me-2 mt-5">Personalitzat</button>
            </div>
          </div>
        </div>

        <div v-else>
          <Calendar class="mb-4" v-bind:date="user.propose_banned_until" :isVotingBannedDate=false
            @changeDate="changeDate" />
          <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded me-2"
            @click="banUser(false)">LIMITAR PROPOSTES</button>
          <button class="w-fit bg-red-400 hover:bg-red-200 text-black font-bold py-2 px-4 rounded float-right"
            @click="toggleProposingBanUserCustomize = true">Cancela</button>
        </div>

      </div>
    </div>
  </div>

  <ModularModal :open="modals.noDateSelected" type="error" title="No hi ha cap data seleccionada"
    @close="modals.noDateSelected = false">
    <template #title>
      <h2>No hi ha cap data seleccionada</h2>
    </template>
    <template #content>
      <p>Selecciona una franja de dates per poder bloquejar a l'usuari <span class="font-bold">{{ user.name }}</span>.
      </p>
    </template>
  </ModularModal>

  <ModularModal :open="modals.banUserVotingCapacity" type="error" msg="Limitar" title="Limitar votacions usuari"
    @confirm="submitData(); this.toggleVotingBanUserCustomize = true;" @close="modals.banUserVotingCapacity = false">
    <template #title>
      <h2>Limitar capacitat de votar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ formatDate(this.votingBannedUntil) }}?</span>
      </p>
    </template>
  </ModularModal>

  <ModularModal :open="modals.unbanUserVotingCapacity" type="error" msg="Habilitar" title="Habilitar votacions usuari"
    @confirm="submitData()" @close="modals.unbanUserVotingCapacity = false">
    <template #title>
      <h2>Habilitar capacitat de votar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> pugui tornar a votar cançons?</p>
    </template>
  </ModularModal>

  <ModularModal :open="modals.banUserProposingCapacity" type="error" msg="Limitar" title="Limitar propostes usuari"
    @confirm="submitData(); this.toggleProposingBanUserCustomize = true;"
    @close="modals.banUserProposingCapacity = false">
    <template #title>
      <h2>Limitar capacitat de proposar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui proposar cançons fins
        el <span class="font-bold">{{ formatDate(this.proposingBannedUntil) }}?</span></p>
    </template>
  </ModularModal>

  <ModularModal :open="modals.unbanUserProposingCapacity" type="error" msg="Habilitar"
    title="Habilitar propostes usuari" @confirm="submitData()" @close="modals.unbanUserProposingCapacity = false">
    <template #title>
      <h2>Habilitar capacitat de proposar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> tornar a proposar cançons?</p>
    </template>
  </ModularModal>

  <!-- modal per banejar les votacions -->
  <ModularModal :open="modals.banUserVotingWithDefaultOptions" type="error" msg="Limitar"
    title="Limitar propostes usuari" @confirm="banUserVotingWithDefaultOptions(optionVotingBannedUntil)"
    @close="modals.banUserVotingWithDefaultOptions = false; optionVotingBannedUntil = null">
    <template #title>
      <h2>Limitar capacitat de votar {{ optionVotingBannedUntil === 1 ? '3 setmanes' : optionVotingBannedUntil === 2 ?
        '3 mesos' : '1 any' }}</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ getBanDate(optionVotingBannedUntil) }}?</span>

      </p>
    </template>
  </ModularModal>

  <!-- modal per banejar les propostes -->
  <ModularModal :open="modals.banUserProposingWithDefaultOptions" type="error" msg="Limitar"
    title="Limitar propostes usuari" @confirm="banUserProposingWithDefaultOptions(optionProposingBannedUntil)"
    @close="modals.banUserProposingWithDefaultOptions = false; optionProposingBannedUntil = null">
    <template #title>
      <h2>Limitar capacitat de proposar {{ optionProposingBannedUntil === 1 ? '3 setmanes' : optionProposingBannedUntil
        ===
        2 ? '3 mesos' : '1 any' }}</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ getBanDate(optionProposingBannedUntil) }}?</span>

      </p>
    </template>
  </ModularModal>

  <!-- Modal par habilitar VOTACIONS -->
  <ModularModal :open="modals.enableUserVotingWithDefaultOptions" type="error" msg="Habilitar"
    title="Habilitar propostes usuari" @confirm="enableUserWithDefaultOptions(1)"
    @close="modals.enableUserVotingWithDefaultOptions = false">
    <template #title>
      <h2>Habilitar capacitat de votar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> pugui tornar a votar cançons?
      </p>
    </template>
  </ModularModal>

  <!-- Modal per habilitar PROPOSTES -->
  <ModularModal :open="modals.enableUserProposingWithDefaultOptions" type="error" msg="Habilitar"
    title="Habilitar propostes usuari" @confirm="enableUserWithDefaultOptions(2)"
    @close="modals.enableUserProposingWithDefaultOptions = false">
    <template #title>
      <h2>Habilitar capacitat de proposar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> pugui tornar a proposar cançons?
      </p>
    </template>
  </ModularModal>



</template>

  <style scoped>
  .user-details-container {
    background-color: rgb(56, 56, 56);
    height: 85vh;
  }
</style>