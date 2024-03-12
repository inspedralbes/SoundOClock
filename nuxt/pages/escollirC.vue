<template>
    <div>

        <h1>Escollir C</h1>
        <div v-for="song in list" :key="song.id">
            <h2>{{ song.title }}</h2>
            <p>{{ song.artist }}</p>
            <p>{{ song.year }}</p>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    mounted() {
        fetch('/listM.json')
            .then(response => response.json())
            .then(data => {
                this.list = data
                console.log(this.list);
            })
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped></style>