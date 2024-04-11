<script>
import { useAppStore } from '@/stores/app';
import { socket } from '../socket';
export default {
  name: 'SongDetails',
  props: {
    song: Object
  },
  data() {
    return {
      modals: {
        addSongToBlacklist: false,
        notReadReports: null
      },
    }
  },
  created() {
    this.countNotReadReports();
  },
  watch: {
    "song.reports": { // Each time song.reports change execute countNotReadReports() method
      handler: 'countNotReadReports',
    },
  },
  methods: {
    deleteSong() {
      this.modals.addSongToBlacklist = true;
    },
    submitData() {
      socket.emit('deleteSong', this.store.getUser().token, this.song);
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

      if (this.song) {
        for (let i = 0; i < this.song.reports.length; i++) {
          if (!this.song.reports[i].isRead) {
            counter++;
          }
        }
        this.notReadReports = counter;
      }
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
          <p class="text-5xl font-black">{{ song.title }}</p>
          <p class="text-3xl">{{ song.artist }}</p>
        </div>
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteSong(song)">AFEGIR A LA LLISTA NEGRA</button>
      </div>
    </div>
    <p class="mb-4 text-xl">CANÇÓ PROPOSADA PER: {{ song.user.name }}</p>
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
        <div v-for="report in song.reports" class="report-container p-4 grid grid-cols-12 gap-3 rounded-lg items-center">
          <p class="col-span-6">{{ report.reason }}</p>
          <p class="col-span-5 text-right">{{ report.userName }}</p>
          <ModularSwitch :value="report.isRead" :canSwitch=true @input="handleSwitch(report._id, $event)"
            class="col-span-1" />
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <ModularModal v-if="modals.addSongToBlacklist" type="error" msg="Afegir" title="Afegir cançó a la llista negra"
      @confirm="submitData()" @close="modals.addSongToBlacklist = false">
      <template #title>
        <h2>Afegir cançó a la llista negra</h2>
      </template>
      <template #content>
        <p>Segur que vols afegir <span class="font-bold">{{ song.title }}</span> de <span class="font-bold">{{ song.artist
        }}</span> a la llista negra?</p>
      </template>
    </ModularModal>
  </Transition>
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