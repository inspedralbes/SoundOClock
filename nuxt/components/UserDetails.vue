<template>
  <div v-if="user == null"></div>
  <div v-else class="bg-gray-200 rounded-lg p-6 space-y-6 w-full">
    <div class="text-center">
      <p class="text-4xl font-bold text-gray-900">{{ user.name }}</p>
      <p class="text-lg text-gray-600">{{ user.email }}</p>
      <p class="text-lg text-gray-600">Grups: <span v-for="(group, index) in user.groups" :key="index">{{
        group.abbreviation }}<span v-if="index < user.groups.length - 1">, </span></span></p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <p class="text-xl font-semibold text-gray-700 text-center mb-4">
          {{ user.vote_banned_until ? 'L\'usuari no pot votar cançons fins el ' + formatDate(user.vote_banned_until) :
            'L\'usuari no té limitada la capacitat de votar cançons' }}
        </p>
        <h2 class="text-2xl font-semibold text-center text-gray-800 mb-4 small-caps">Limitar la votació de cançons</h2>
        <div v-if="toggleVotingBanUserCustomize" class="space-y-4">
          <div v-if="user.vote_banned_until">
            <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded small-caps"
              @click="modals.enableUserVotingWithDefaultOptions = true">Habilitar les votacions</button>
          </div>
          <div v-else>
            <div class="flex space-x-2">
              <button class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 1">Ban 3
                setmanes</button>
              <button class="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 2">Ban 3 mesos</button>
              <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserVotingWithDefaultOptions = true; optionVotingBannedUntil = 3">Ban 1 any</button>
            </div>
            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
              @click="toggleVotingBanUserCustomize = false">Personalitzat</button>
          </div>
        </div>
        <div v-else class="space-y-4">
          <Calendar class="mb-4" v-bind:date="user.vote_banned_until" :isVotingBannedDate=true
            @changeDate="changeDate" />
          <div class="flex space-x-2">
            <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              @click="banUser(true)">LIMITAR VOTACIONS</button>
            <button class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
              @click="toggleVotingBanUserCustomize = true">Cancel·la</button>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <p class="text-xl font-semibold text-gray-700 text-center mb-4">
          {{ user.propose_banned_until ? 'L\'usuari no pot proposar cançons fins el ' +
            formatDate(user.propose_banned_until) : 'L\'usuari no té limitada la capacitat de proposar cançons' }}
        </p>
        <h2 class="text-2xl font-semibold text-center text-gray-800 mb-4 small-caps">Limitar la proposta de cançons</h2>
        <div v-if="toggleProposingBanUserCustomize" class="space-y-4">
          <div v-if="user.propose_banned_until">
            <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              @click="modals.enableUserProposingWithDefaultOptions = true">Habilitar les propostes</button>
          </div>
          <div v-else>
            <div class="flex space-x-2">
              <button class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserProposingWithDefaultOptions = true; optionProposingBannedUntil = 1">Ban 3
                setmanes</button>
              <button class="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserProposingWithDefaultOptions = true; optionProposingBannedUntil = 2">Ban 3
                mesos</button>
              <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                @click="modals.banUserProposingWithDefaultOptions = true; optionProposingBannedUntil = 3">Ban 1
                any</button>
            </div>
            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
              @click="toggleProposingBanUserCustomize = false">Personalitzat</button>
          </div>
        </div>
        <div v-else class="space-y-4">
          <Calendar class="mb-4" v-bind:date="user.propose_banned_until" :isVotingBannedDate=false
            @changeDate="changeDate" />
          <div class="flex space-x-2">
            <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              @click="banUser(false)">LIMITAR PROPOSTES</button>
            <button class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
              @click="toggleProposingBanUserCustomize = true">Cancel·la</button>
          </div>
        </div>
      </div>
    </div>

    <button v-if="user.bans.length > 0"
      class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded mt-4 small-caps"
      @click="showBanHistory()">Historial de sancions</button>
  </div>

  <UModal v-model="modals.noDateSelected" prevent-close>
    <UAlert title="No hi ha cap data seleccionada" color="red" class="p-6">
      <template #title="{ title }">
        <div class="flex items-center justify-between mb-12">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-2xl" />
            <span v-html="title" />
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid text-right" class="-my-1"
            @click="modals.noDateSelected = false" />
        </div>
      </template>
      <template #description>
        <p>Selecciona una franja de dates per poder bloquejar a l'usuari <span class="font-bold">{{ user.name
            }}</span>.
        </p>
      </template>
    </UAlert>
  </UModal>


  <ModularModal :open="modals.unbanUserVotingCapacity" type="error" msg="Habilitar" title="Habilitar votacions usuari"
    @confirm="submitData()" @close="modals.unbanUserVotingCapacity = false">
    <template #title>
      <h2>Habilitar capacitat de votar</h2>
    </template>
    <template #content>
      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> pugui tornar a votar cançons?</p>
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
  <UModal v-model="modals.banUserVotingWithDefaultOptions" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-2xl text-red-500" />
            <h2>Limitar capacitat de votar {{ optionVotingBannedUntil === 1 ? '3 setmanes' : optionVotingBannedUntil ===
              2 ?
              '3 mesos' : '1 any' }}</h2>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.banUserVotingWithDefaultOptions = false; optionVotingBannedUntil = null" />
        </div>
      </template>

      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ getBanDate(optionVotingBannedUntil) }}?</span>
      </p>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton color="gray" variant="ghost" @click="modals.banUserVotingWithDefaultOptions = false">Cancel·la
          </UButton>
          <UButton color="red" @click="banUserVotingWithDefaultOptions(optionVotingBannedUntil)">Limitar</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <UModal v-model="modals.banUserVotingCapacity" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">

          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-2xl text-red-500" />
            <h2>Limitar capacitat de votar</h2>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.banUserVotingCapacity = false" />
        </div>
      </template>

      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ formatDate(this.votingBannedUntil) }}?</span>
      </p>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton color="gray" variant="ghost" @click="modals.banUserVotingCapacity = false">Cancel·la</UButton>
          <UButton color="red" @click="submitData(); this.modals.banUserVotingCapacity = false;">Limitar</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- modal per banejar les propostes -->
  <UModal v-model="modals.banUserProposingWithDefaultOptions" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-2xl text-red-500" />
            <h2>Limitar capacitat de proposar {{ optionProposingBannedUntil === 1 ? '3 setmanes' :
              optionProposingBannedUntil
                ===
                2 ? '3 mesos' : '1 any' }}</h2>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.banUserProposingWithDefaultOptions = false; optionProposingBannedUntil = null" />
        </div>
      </template>

      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui votar cançons fins el
        <span class="font-bold">{{ getBanDate(optionProposingBannedUntil) }}?</span>
      </p>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton color="gray" variant="ghost" @click="modals.banUserProposingWithDefaultOptions = false">Cancel·la
          </UButton>
          <UButton color="red" @click="banUserProposingWithDefaultOptions(optionProposingBannedUntil)">Limitar</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <UModal v-model="modals.banUserProposingCapacity" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-2xl text-red-500" />
            <h2>Limitar capacitat de proposar</h2>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.banUserProposingCapacity = false" />
        </div>
      </template>

      <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> no pugui proposar cançons fins
        el <span class="font-bold">{{ formatDate(this.proposingBannedUntil) }}?</span></p>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton color="gray" variant="ghost" @click="modals.banUserProposingCapacity = false">Cancel·la</UButton>
          <UButton color="red" @click="submitData(); this.toggleProposingBanUserCustomize = true;">Limitar</UButton>
        </div>
      </template>
    </UCard>
  </UModal>


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

  <!-- Modal per veure historial de sancions -->
  <UModal v-model="modals.showBanHistory" class="z-[9999] text-black w-[1000px]" fullscreen>
    <UCard>
      <template #header>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="float-right"
          @click="modals.showBanHistory = false" />
        <!--<div class="flex flex-row items-center justify-between rounded-lg">-->
        <AdminBanHistory class="clear-both" :user="user"></AdminBanHistory>
        <!--</div>-->
      </template>
    </UCard>
  </UModal>

  <ModularToast v-bind:serverResponse="serverResponse" time="10000" />
</template>

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
        showBanHistory: false
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
      this.modals.banUserVotingWithDefaultOptions = false;
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
      this.modals.banUserProposingWithDefaultOptions = false;
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
    },
    showBanHistory() {
      this.modals.showBanHistory = true;
    }
  },
  unmounted() {
    this.store.setServerResponse(null);
  },
  computed: {
    serverResponse() {
      return this.store.getServerResponse();
    },
  },
  setup() {
    const store = useAppStore();
    return { store };
  },
};
</script>

<style scoped>
.user-details-container {
  background-color: rgb(56, 56, 56);
  height: 85vh;
}
</style>