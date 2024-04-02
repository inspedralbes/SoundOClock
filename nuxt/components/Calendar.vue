<script>
import { ref } from '#imports'
import { formatDate } from '../utils';
export default {
    name: 'Calendar',
    props: {
        date: Date
    },
    data() {
        return {
            range: ref({
                start: null,
                end: null
            }),
            selectedColor: ref('red')
        }
    },
    created() {
        this.range.start = new Date(),
        this.range.end = new Date(this.date)
    },
    methods: {
        formatDate(date) {
            return formatDate(date);
        },
        changeDate(){
            console.log("datacanviada", this.range.end);
            this.$emit('changeDate', this.range);
        },
        updateDate() {
            this.range.start = null;
            this.range.end = null;

            if (this.date) {
                this.range.start = new Date();
                this.range.end = new Date(this.date);
            }
        }
    },
    watch: {
        range: { // Each time the range change execute changeDate() method
            handler: 'changeDate',
        },
        date: { // Each time the prop user change execute updateDate() method
            handler: 'updateDate',
        },
    },
    // setup() {
    //     const store = useAppStore();
    //     return { store };
    // },
};
</script>

<template>
    <VDatePicker v-model.range="range" :color="selectedColor" mode="date" expanded />
    {{ range }}

</template>

<style scoped></style>