<template>
    <div>
        <h1>Escollir classe</h1>
        <div v-for="group in groups" :key="group.id">
            <button @click="setGroup(group)">{{ group.name }}</button>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            groups: [],
        }
    },
    mounted() {
        this.loading = true;
        fetch('http://localhost:8080/api/groups')
            .then(response => response.json())
            .then(data => {
                console.log("groups: ", data);
                this.groups = data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        this.loading = false;
    },


}
</script>

<style scoped></style>