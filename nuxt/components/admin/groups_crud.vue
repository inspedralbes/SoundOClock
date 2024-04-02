<template>
    <div class="ml-20">
        <div class="grid titles">
            <span>ID</span>
            <span>Abreviatura</span>
            <span>Grup</span>
            <span>Núm.Grups</span>
            <span>Núm.Linies</span>
            <span>Public</span>
            <span>Accions</span>
        </div>
        <div v-for="group, index in classGroups" :key="group.id" class="grid group">
            <span>{{ group.id }}</span>
            <input type="text" v-model="group.abbreviation" :disabled="!toggleEdit[index]">
            <input type="text" v-model="group.name" :disabled="!toggleEdit[index]">
            <input type="number" v-model="group.max_courses" min="1" :disabled="!toggleEdit[index]">
            <input type="number" v-model="group.max_lines" min="1" :disabled="!toggleEdit[index]">
            <ModularSwitch :value="group.is_public" @input="group.is_public = $event" />
            <span v-if="!toggleEdit[index]">
                <button class="edit" @click="toggleEdit[index] = !toggleEdit[index]">Editar</button>
                <button class="delete">Eliminar</button>
            </span>
            <span v-else>
                <button class="save">Guardar</button>
                <button class="delete" @click="cancelEdit(index)">Cancel·lar</button>
            </span>
        </div>
        <div class="m-8" v-if="classGroups.length===0">
            <Loader />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

export default {
    data() {
        const store = useAppStore();
        return {
            classGroups: computed(() => store.getClassGroups()),
            // classGroupsRecover: JSON.parse(JSON.stringify(computed(() => store.getClassGroups()))),
            toggleEdit: [],
        }
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
    created() {
        this.toggleEdit = new Array(this.classGroups.length).fill(false);
    },
    methods: {
        cancelEdit(index) {
            this.classGroups[index] = this.classGroupsRecover[index];
            this.toggleEdit[index] = !this.toggleEdit[index];
            console.log('Groups:', this.classGroupsRecover);
        }
    },
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: .1fr .3fr 1fr .3fr .3fr .2fr .5fr;
    gap: 5px;
    padding: 1rem;
}

.titles {
    font-weight: bold;
    border-bottom: 1px solid;
    border-top: 1px solid;
    backdrop-filter: blur(10px);
    top: 0;
    position: sticky;
    z-index: 99999;
}

input {
    padding: 5px;
    border-radius: 5px;
    border: none;
    width: 100%;
}

input:disabled {
    color: gray;
}

.group {
    border-bottom: 1px solid gray;

}

button {
    padding: 5px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: white;
    width: 40%;
    margin: 5px;
}

button.edit {
    background-color: var(--pedralbes-blue);
}

button.delete {
    background-color: #E03616;
}

button.save {
    background-color: #63C132;
}
</style>