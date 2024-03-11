<template>
    <div>
        <h1>Escollir C</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            escollirC: []
        }
    },
    mounted() {
        fetch('http://localhost:3000/api/escollirC')
            .then(response => response.json())
            .then(data => console.log(data))
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped></style>