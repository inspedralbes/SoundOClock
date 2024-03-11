<template>
    <div>

        <h1>Escollir C</h1>
        <div v-for="song in llistat" :key="song.id">
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
            llistat: []
        }
    },
    mounted() {
        fetch('/llistatM.json')
            .then(response => response.json())
            .then(data => {
                this.llistat = data
                console.log(this.llistat);
            })
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped></style>