<script>
import { ref } from '#imports'
import { formatDate } from '../utils';
export default {
    name: 'Calendar',
    props: {
        user: Object
    },
    data() {
        return {
            range: ref({
                start: this.user.,
                end: new Date(2024, 3, 19),
            }),
            selectedColor: ref('red')
        }
    },
    methods: {
        formatDate(date) {
            return formatDate(date);
        }
    },
    // setup() {
    //     const store = useAppStore();
    //     return { store };
    // },
};
</script>

<template>
    <VDatePicker v-model.range="range" :color="selectedColor" mode="date" expanded />
    {{ formatDate(range.end.toISOString().substring(0, 10)) }}
</template>

<style scoped></style>