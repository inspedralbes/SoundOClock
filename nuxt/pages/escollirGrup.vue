<template>
    <div class="w-80 mx-auto">
        <h1 class="text-2xl text-center my-6">Escull el teu grup:</h1>
        <div v-if="loading" class="loading">
            <Loader />
        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center mb-5">
                <label for="grup">Grup:</label>
                <select name="grup" id="grup" v-model="selectedGroupId" class="w-80 p-3 rounded">
                    <option value="">-- Escull el teu grup --</option>
                    <option :value="group.id" v-for="group in groups" :key="group.id">
                        {{ group.abbreviation }}
                    </option>
                </select>
            </div>
            <div class="flex flex-col items-center justify-center">
                <label for="curs">Curs:</label>
                <select name="curs" id="curs" :disabled="!selectedGroupId" v-model="selectedCourse" class="w-80 p-3 rounded">
                    <option value="">-- Escull el teu curs --</option>
                    <option :value="course" v-for="course in availableCourses" :key="course">{{ formatCourse(course) }}</option>
                </select>
            </div>
            <div class="mt-6 w-80">
                <button @click="storeGroup" class="btn flex justify-center p-3 bg-green-600 rounded w-full" :disabled="checkCorrectOptions()">
                    Següent
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import { useAppStore } from '@/stores/app';
import comManager from '@/communicationManager'

export default {
    data() {
        return {
            store: useAppStore(),
            loading: true,
            groups: [],
            disabled: true,
            selectedGroupId: '',
            selectedCourse: ''
        }
    },
    mounted() {
        comManager.getPublicGroups().then((groups) => {
            this.groups = groups;
            this.loading = false;
        });
    },
    computed: {
        availableCourses() {
            // Get selected group
            const selectedGroup = this.groups.find(group => group.id === this.selectedGroupId);
            // Return an array with the number of courses available
            return selectedGroup ? Array.from({ length: selectedGroup.max_courses }, (_, i) => i + 1) : [];
        }
    },

    methods: {
        storeGroup() {
            let selectedGroup = this.groups.find(group => group.id === this.selectedGroupId);
            this.store.setUserGroupAndCourse(selectedGroup.abbreviation, this.selectedCourse);
            this.$router.push('/llista_propostes');
        },
        checkCorrectOptions() {
            let selectedGroup = this.groups.find(group => group.id === this.selectedGroupId);
            return ((selectedGroup && this.selectedCourse > selectedGroup.max_courses) ||  !this.selectedGroupId || !this.selectedCourse);
        },
        formatCourse(course) {
            // Return the course with the correct format in catalan (1er, 2on, 3er, 4rt)
            switch (course) {
                case 1:
                    return '1er';
                case 2:
                    return '2on';
                case 3:
                    return '3er';
                case 4:
                    return '4rt';
                default:
                    return course;
            }
        }
    }

}
</script>

<style scoped>

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.btn:disabled {
    background-color: #999;
    cursor: not-allowed;
}

</style>