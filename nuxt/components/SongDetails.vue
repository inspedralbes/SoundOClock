<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
import comManager from '../communicationManager';
export default {
  name: 'SongDetails',
  props: {
    song: Object
  },
  data() {
    return {
      notReadReports: 0,
      modals: {
        addSongToBlacklist: false,
        eraseSong: false,
      },
      BanOptions: [
        'Sense ban',
        'Ban 3 setmanes',
        'Ban 3 mesos',
        'Ban 1 any'
      ],
      banSelected: {
        userProposed: 'Sense ban',
        userVoted: 'Sense ban',
      }
    }
  },
  mounted() {
    this.countNotReadReports();
  },
  watch: {
    "song.reports": { // Each time song.reports change execute countNotReadReports() method
      handler: 'countNotReadReports',
    },
  },
  methods: {
    async banUsers() {

      if (this.banSelected.userProposed == 'Sense ban' && this.banSelected.userVoted == 'Sense ban') return;


      let dateBanProposed;
      switch (this.banSelected.userProposed) {
        case 'Ban 3 setmanes': // 3 weeks
          dateBanProposed = new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 'Ban 3 mesos': // 3 motnhs
          dateBanProposed = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 'Ban 1 any': // 1 year
          dateBanProposed = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
      }

      let dateBanVoted;
      switch (this.banSelected.userVoted) {
        case 'Ban 3 setmanes': // 3 weeks
          dateBanVoted = new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 'Ban 3 mesos': // 3 motnhs
          dateBanVoted = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
        case 'Ban 1 any': // 1 year
          dateBanVoted = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0].replace(/-/g, '-');
          break;
      }

      let usersVotes;
      await comManager.getUsersVotes(this.song.id, this.store.getUser().token).then((response) => {
        usersVotes = response.users;
      });

      //find user who prosed song
      let userPropose;
      await comManager.getUser(this.song.user.id, this.store.getUser().token).then((response) => {
        userPropose = response;
      });

      // Ban user who proposed the song
      if (this.banSelected.userProposed != 'Sense ban') {
        userPropose.propose_banned_until = dateBanProposed;
        console.log('userProposeBan: ', userPropose);
        socket.emit('banUser', this.store.getUser().token, userPropose);
      }

      // Ban users who voted the song
      if (this.banSelected.userVoted != 'Sense ban') {
        usersVotes.forEach((user) => {
          if (user.id == userPropose.id) {
            user = userPropose;
          }
          user.vote_banned_until = dateBanVoted;
          console.log('voteBan: ', user);
          socket.emit('banUser', this.store.getUser().token, user);
        });
      }

    },
    eraseSong() {
      this.banSelected.userProposed = 'Sense ban';
      this.banSelected.userVoted = 'Sense ban';
      this.modals.eraseSong = true;
    },
    submitEraseSongData() {
      this.modals.eraseSong = false;
      this.banUsers();
      socket.emit('deleteSong', this.store.getUser().token, this.song.id, false);
    },
    banSong() {
      this.banSelected.userProposed = 'Sense ban';
      this.banSelected.userVoted = 'Sense ban';
      this.modals.addSongToBlacklist = true;
    },
    submitBanSongData() {
      this.modals.addSongToBlacklist = false
      this.banUsers();
      socket.emit('deleteSong', this.store.getUser().token, this.song.id, true);
    },
    handleSwitch(reportId, value) {

      switch (value) {
        case true:
          value = 1;
          break;
        case false:
          value = 0;
          break;
      }

      const report = this.song.reports.find((report) => report._id == reportId);
      report.isRead = value;
      socket.emit('changeIsReadReportStatus', this.store.getUser().token, report);
      this.countNotReadReports();

    },
    countNotReadReports() {

      let counter = 0;

      for (let i = 0; i < this.song.reports.length; i++) {
        if (!this.song.reports[i].isRead) {
          counter++;
        }
      }
      this.notReadReports = counter;
    },
    markAllReportsAsRead() {

      for (let i = 0; i < this.song.reports.length; i++) {

        if (!this.song.reports[i].isRead) {
          this.song.reports[i].isRead = 1;
          socket.emit('changeIsReadReportStatus', this.store.getUser().token, this.song.reports[i]);
        }

      }

      this.countNotReadReports();
    },
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

<template>
  <div v-if="song == null">
  </div>
  <div v-else class="user-details-container flex flex-col rounded-lg h-screen text-left p-4">
    <div class="flex flex-row mb-10">
      <img :src="song.img" alt="" class="w-1/3 rounded-lg">
      <div class="w-2/3 ml-4 flex flex-col justify-between">
        <div>
          <p class="text-5xl font-black">{{ song.name }}</p>
          <p class="text-3xl">{{ song.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
        <div class="flex flex-row gap-3">
          <button class="w-fit bg-red-200 hover:bg-red-400 text-black  font-bold py-2 px-4 rounded"
            @click="eraseSong(song)">ELIMINAR DE CANÇONS PROPOSADES</button>
          <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="banSong(song)">AFEGIR A LA LLISTA NEGRA</button>
        </div>
      </div>
    </div>
    <div class="mb-1 flex flex-row justify-between">
      <span class="text-xl">CANÇÓ PROPOSADA PER: {{ song.user.name }}</span>
    </div>
    <div class="w-100 p-4 flex flex-col gap-2 bg-gray-400 rounded-lg grow">
      <div class="mb-2 flex flex-row justify-between items-center gap-2">
        <div class="flex flex-row items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="rgb(239 68 68)"
            class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
          </svg>
          <p class="text-xl">NÚMERO DE REPORTS PER REVISAR: {{ notReadReports }}</p>
        </div>
        <button class="pedralbes-button w-fit text-white font-bold py-2 px-4 rounded"
          @click="markAllReportsAsRead()">MARCAR TOTS ELS REPORTS</button>
      </div>
      <div class="h-48 flex flex-col gap-2 overflow-y-auto grow">
        <div v-for="report in song.reports"
          class="report-container p-4 grid grid-cols-12 gap-3 rounded-lg items-center">
          <div class="col-span-6 flex flex-col">
            <p v-for="reason in report.reasons" class="flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-circle-16-solid" />
              {{ reason }}
            </p>
          </div>
          <p class="col-span-5 text-right">{{ report.userName }}</p>
          <ModularSwitch :value="report.isRead" :canSwitch=true @input="handleSwitch(report._id, $event)"
            class="col-span-1" />
        </div>
      </div>
    </div>
  </div>

  <UModal v-model="modals.addSongToBlacklist">
    <div>
      <UAlert title="Estàs segur/a de banejar aquesta cançó?" icon="i-heroicons-exclamation-triangle-16-solid"
        color="orange" variant="subtle" class="p-6">
        <template #title="{ title }">
          <span v-html="title" />
        </template>
        <template #description>
          <div class="ml-auto mr-auto pt-1 pb-2">
            <p class="pb-1">Banejar usuari que ha proposat la canço</p>
            <USelect v-model="this.banSelected.userProposed" :options="BanOptions" />
          </div>
          <div class="ml-auto mr-auto pt-1 pb-2">
            <p class="pb-1">Banejar usuaris que han votat la canço</p>
            <USelect v-model="this.banSelected.userVoted" :options="BanOptions" />
          </div>
          <div class="mt-2 flex justify-between gap-2">
            <UButton size="md" color="red" @click="modals.addSongToBlacklist = false">Enrere</UButton>
            <UButton size="md" color="primary" @click="submitBanSongData">Continuar</UButton>
          </div>
        </template>
      </UAlert>
      <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
        @click="modals.addSongToBlacklist = false" />
    </div>
  </UModal>

  <UModal v-model="modals.eraseSong">
    <div>
      <UAlert title="Estàs segur/a d'eliminar aquesta cançó?" icon="i-heroicons-exclamation-triangle-16-solid"
        color="orange" variant="subtle" class="p-6">
        <template #title="{ title }">
          <span v-html="title" />
        </template>
        <template #description>
          <div class="ml-auto mr-auto pt-1 pb-2">
            <p class="pb-1">Banejar usuari que ha proposat la canço</p>
            <USelect v-model="this.banSelected.userProposed" :options="BanOptions" />
          </div>
          <div class="ml-auto mr-auto pt-1 pb-2">
            <p class="pb-1">Banejar usuaris que han votat la canço</p>
            <USelect v-model="this.banSelected.userVoted" :options="BanOptions" />
          </div>
          <div class="mt-2 flex justify-between gap-2">
            <UButton size="md" color="red" @click="modals.eraseSong = false">Enrere</UButton>
            <UButton size="md" color="primary" @click="submitEraseSongData">Continuar</UButton>
          </div>
        </template>
      </UAlert>
      <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
        @click="modals.eraseSong = false" />
    </div>
  </UModal>

  <ModularToast v-bind:serverResponse="serverResponse" time="10000" />
</template>

<style scoped>
.user-details-container,
.report-container {
  background-color: rgb(56, 56, 56);
}

.user-details-container {
  height: 85vh;
}

.pedralbes-button {
  background-color: var(--pedralbes-blue);
}

.cont {
  height: 200px;
}
</style>