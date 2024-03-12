<script>
export default {
    data() {
        return {
            cancons: []
        }
    },
    mounted() {
        fetch('http://127.0.0.1:8000/api/songs')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.cancons = data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    },
    methods: {

    },
    computed: {
        
    }
}

</script>

<template>
    <div class="pt-8 flex flex-col items-center">
        <Cercador></Cercador>
        <div class="mb-4">
            <BotoFiltre></BotoFiltre>
        </div>
        <div class="w-full px-12 flex flex-col gap-3">
            <Canço v-for="canco in cancons" v-bind:canco="canco"/>
        </div>
    </div>
</template>

<style scoped>

.contenidor {
    color: white;
    height: 100vh;
    width: 100vw;
    margin: 0;
}
    
</style>
