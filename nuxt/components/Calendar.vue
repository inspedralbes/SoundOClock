<script>
import { ref } from '#imports'
export default {
    name: 'Calendar',
    props: {
        data: Object
    },
    data() {
        return {
            date: ref(new Date())
        }
    },
    methods: {

    },
    // setup() {
    //     const store = useAppStore();
    //     return { store };
    // },
};
</script>

<template>
    <VDatePicker v-model="date" mode="date" expanded/>
</template>

<style scoped></style>