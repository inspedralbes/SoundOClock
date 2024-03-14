<script>
  import { useAppStore } from '@/stores/app';
  export default {
    name: 'FilterButtons',
    data() {
      return {
        filter: 1
      }
    },
    methods: {
      applyFilter() {
        this.store.setFilter(this.filter);
        this.$emit('applyFilter');
      },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
  };
</script>

<template>
  <div class="flex flex-row horizontal-scroll-container">
    <div class="radio-card">
      <input type="radio" id="option1" name="options" value="1" v-model="filter" :class="[this.filter == 1? 'selected': '']" @change="applyFilter()"/>
      <label for="option1">Més votat</label>
    </div>

    <div class="radio-card">
      <input type="radio" id="option2" name="options"  value="2" v-model="filter" :class="[this.filter == 2? 'selected': '']" @change="applyFilter()" />
      <label for="option2">Menys votat</label>
    </div>

    <div class="radio-card">
      <input type="radio" id="option3" name="options"  value="3" v-model="filter" :class="[this.filter == 3? 'selected': '']" @change="applyFilter()"/>
      <label for="option3">Titol Alfabeticament</label>
    </div>

    <div class="radio-card">
      <input type="radio" id="option4" name="options"  value="4" v-model="filter" :class="[this.filter == 4? 'selected': '']" @change="applyFilter()"/>
      <label for="option4">Autor Alfabeticament</label>
    </div>
  </div>
</template>

<style scoped>

    .radio-card {
        background-color: #D9D9D9;
        font-size: 0.75em;
        display: inline-block;
        margin: 10px 5px;
        padding: 10px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.5s;
    }

    .radio-card:first-child {
      margin-left: 0px;
    }

    .radio-card:last-child {
      margin-right: 0px;
    }

    input[type="radio"] {
        display: none; /* Amaga el radio button per defecte*/
    }

    /* molt xulo pero nomes funciona en chrome */
    /* .radio-card:has(input[type="radio"]:checked) {
        background-color: #83AEE4;
        border-color: #83AEE4;
    } */

    .selected {
        background-color: #83AEE4;
        border-color: #83AEE4;
    }

    .horizontal-scroll-container {
      overflow-y: scroll; /* Add the ability to scroll */
      white-space: nowrap;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .horizontal-scroll-container::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .horizontal-scroll-container {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }

</style>