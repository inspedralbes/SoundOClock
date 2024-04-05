<template>
    <div v-if="!loading">
        <h2 class="text-4xl text-white text-center font-black mt-4 mb-8">RELACIONAR GRUPS AMB TIMBRES</h2>
        <div class="flex flex-row mt-8">
            <div class="users-container w-1/3 ml-20 overflow-y-auto">
                <div class="width flex flex-col justify-center ml-auto mr-auto gap-3">
                    <div v-for="group in classGroups"
                        class="group-item h-20 flex flex-row justify-center items-center rounded-lg p-3">
                        {{ group.abbreviation }}
                    </div>
                </div>
            </div>
            <div class="groups-bells-container rounded-lg w-2/3 text-white text-center ml-4 mr-4">
                <div v-for="relation in relations">
                    <p>{{ relation.bell.hour }}</p>
                    <select aria-label="" v-model="relation.groups[0]" @change="changeOption()">
                        <option :value=null>No té grup assignat</option>
                        <option v-for="group in classGroups" :value="group">{{ group.abbreviation }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import comManager from '../../communicationManager';

export default {
    data() {
        const store = useAppStore();
        return {
            classGroups: computed(() => store.getClassGroups()),
            // bells: ["08:00", "09:00", "10:00", "11:00", "11:30", "12:30", "13:30"],
            relations: []
        }
    },
    created() {
        this.loading = true;
        comManager.getBells();
        this.createRelationsStructure();
        this.loading = false;
    },
    watch: {
        bells: { // Each time the range change execute changeDate() method
            handler: 'createRelationsStructure',
        },
    },
    methods: {
        createRelationsStructure() {

            let relations = [];
            let relation = {};

            for (let i = 0; i < this.bells.length; i++) {
                relation = {};
                relation.bell = this.bells[i];
                relation.groups = [null];

                relations.push(relation);
            }

            this.relations = relations;
            console.log(this.relations);
        },
        changeOption() {
            console.log(this.relations);
        }
    },
    computed: {
        bells() {
            console.log("ENTERING COMPUTED")
            return this.store.getBells();
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
}
</script>

<style scoped>
.group-item {
    background-color: rgb(56, 56, 56);
    color: white;
}

.group-item:hover,
.group-item:active {
    background-color: white;
    color: rgb(56, 56, 56);
}

.groups-bells-container {
    background-color: rgb(56, 56, 56);
}
</style>