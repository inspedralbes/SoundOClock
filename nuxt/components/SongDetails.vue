<script>
import { useAppStore } from '@/stores/app';
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
  <div v-else class="contenidor-canço rounded-lg h-screen">
    {{ song.title }}
    {{ song.artist }}
    <p>CANÇÓ PROPOSADA PER: {{ song.submittedBy }}</p>
    
  </div>
</template>

<style scoped>

.contenidor-canço {
  background-color: rgb(56, 56, 56);
}

</style>