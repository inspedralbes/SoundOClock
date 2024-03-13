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
        this.$emit('search', this.name);
      },
    }
  };
</script>

<template>
    <div class="flex flex-row justify-center">
        <input class="cercador w-full ps-4" type="text" id="cercador" name="cercador" placeholder="Buscar..." v-model="name" @change="search()"></input>
    </div>
</template>

<style scoped>
    .cercador {
        background-color: white;
        border-radius: 24px;
        height: 40px;
    } 
</style>