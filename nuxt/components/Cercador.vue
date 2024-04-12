<script>
  export default {
    name: 'FilterButtons',
    data() {
      return {
        name: ""
      }
    },
    methods: {
      search() {
        this.store.setSearchEngineFilter(this.name);
        this.$emit('search');
      },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
  };
</script>

<template>
    <div class="flex gap-3">
        <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..." v-model="name" @change="search()"></input>
        <div class="flex items-center justify-center basis-1/4">
        <button @click="goToProposar()"
            class="bg-gray-600 hover:bg-gray-700 h-full w-full md:w-1/2 md:ml-auto flex items-center justify-center rounded">
            <span class="material-symbols-rounded text-white font-bold text-4xl">
                add
            </span>
        </button>
    </div>
    </div>
    
</template>

<style scoped>
    .cercador {
        background-color: white;
        border-radius: 24px;
        height: 40px;
    } 
</style>