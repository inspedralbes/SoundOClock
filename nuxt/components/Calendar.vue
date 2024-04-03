<script>
import { ref } from '#imports'
import { formatDate } from '../utils';
export default {
    name: 'Calendar',
    props: {
        date: Date,
        isVotingBannedDate: Boolean
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
            if (this.range) {
                this.$emit('changeDate', this.range, this.isVotingBannedDate);
            }
        },
        updateDate() {
            this.range = ref({
                start: null,
                end: null
            });

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
    }
};
</script>

<template>
    <VDatePicker :min-date='new Date()' v-model.range="range" :color="selectedColor" mode="date" expanded />
    

</template>

<style scoped>

</style>