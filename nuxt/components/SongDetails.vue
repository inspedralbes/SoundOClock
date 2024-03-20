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

    }
  },
  methods: {
    deleteSong(songId) {
      console.log("HAS AFEGIT A LA LLISTA NEGRA", songId);
      // socket.emit('deleteSong', "1|3rr0fm3LWsIKCuOPlV3QPPhYCdRppe7ApBpSlLFJ4092d823", songId);
      socket.emit('deleteSong', this.store.getUser().token, songId);
    }
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
  <div v-else class="contenidor-canço rounded-lg h-screen text-left p-4">
    <div class="flex flex-row mb-4">
      <img src="/img/mora-primer-dia-de-clases.jpg" alt="" class="w-1/3 rounded-lg">
      <div class="w-2/3 ml-4 flex flex-col justify-between">
        <div>
          <p class="text-5xl font-black">{{ song.title }}</p>
          <p class="text-3xl">{{ song.artist }}</p>
        </div>
        <button class="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteSong(song.id)">AFEGIR A LA LLISTA NEGRA</button>
      </div>
    </div>
    <p class="mb-4 text-xl">CANÇÓ PROPOSADA PER: {{ song.submittedBy }}</p>
    <div class="w-100 p-4 flex flex-col gap-2 bg-gray-400 rounded-lg">
      <p class="mb-2 text-xl">NÚMERO DE REPORTS: {{ song.reports.length }}</p>
      <div v-for="report in song.reports" class="contenidor-report p-4 flex flex-row justify-between rounded-lg">
        <p>{{ report.reason }}</p>
        <p>{{ report.userName }}</p>
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