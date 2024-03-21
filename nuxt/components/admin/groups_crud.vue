<template>
    <div class="ml-20">
        <h1 v-for="group in classGroups">{{ group.name }}</h1>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

    export default {
        data(){
            const store = useAppStore();
            return{
                classGroups:computed(()=>store.getClassGroups())
            }
        },
        setup(){
            const store = useAppStore();
            return { store };
        },
        created(){
        },
    }
</script>

<style scoped>

</style>