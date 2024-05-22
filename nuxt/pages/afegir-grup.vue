<template>
    <div>
        <div v-if="loading" class="loading">
            <Loader />
        </div>
        <div v-else>

            <button @click="console.log(this.user)">asd</button>
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
            categories: [],
            selectedCategoryId: '',
            storeGroupsLoading: false,
            selectedGroups: null,
        }
    },

    mounted() {
        if (this.user.role_id < 4) {
            // User is a not a student (teacher, admin, etc.)
            comManager.getAllGroupsAndCategories().then((data) => {
                this.groups = data.allGroups;
                this.categories = data.allCategories;
                this.selectedGroups = [];
                this.loading = false;
            });
        } else {
            // User is a student
            comManager.getPublicGroupsAndCategories().then((data) => {
                this.groups = data.publicGroups;
                this.categories = data.publicCategories;
                this.selectedGroups = '';
                this.loading = false;
            });
        }
    },
    computed: {
        availableCourses() {
            return this.groups.filter(group => {
                return group.category_id === this.selectedCategoryId
            })
        },
        user() {
            return this.store.getUser();
        }
    },
    methods: {
        formatArray(array) {
            return array.map((item) => {
                return item.id;
            });
        },
        storeGroups() {
            this.storeGroupsLoading = true;
            let groups = this.formatArray(this.selectedGroups);

            comManager.storeGroups(groups).then(() => {
                this.storeGroupsLoading = false;
                this.$router.push('/els_meus_grups');
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>