<template>
    <div class="sticky top-0 h-10 w-full flex flex-col justify-center justify-between ml-auto mr-auto gap-1 mb-2">
        <div class="flex flex-row gap-2 h-10">
            <input type="text" placeholder="Busca..." :value="search" @input="search = $event.target.value; this.$emit('search', search)"
                class="h-full w-full items-center rounded-lg p-3 border-2 border-white">
            <!-- BUTTON FILTERS -->
            <!-- <button v-if="filters" @click="isDropdownMenuOpen = !isDropdownMenuOpen"
                class="h-full w-10 flex justify-center items-center rounded-lg bg-[#383838] border-2 border-white">
                <span class="material-symbols-outlined text-white">
                    tune
                </span>
            </button> -->

        </div>
        <!-- FILTERS -->
        <div v-if="filters" class="relative top-0 w-full left-0">
            <div id="dropdown-menu" :class="{ 'hidden': !isDropdownMenuOpen, 'block': isDropdownMenuOpen }"
                class="absolute h-96 w-full overflow-auto bg-[#383838] border-2 border-white rounded-lg shadow-lg">
                <ul class="bg-[#383838] rounded-lg">
                    <li class="hover:bg-black rounded-lg w-full p-1"><button
                            class="rounded-lg w-full p-1 hover:bg-black text-left"
                            @click="filterItems('Tots'), isDropdownMenuOpen = !isDropdownMenuOpen">Tots</button>
                    </li>
                    <li v-for="filter, index in filters" :key="filter.id"
                        @click="filterItems(filter.id), isDropdownMenuOpen = !isDropdownMenuOpen"
                        class="rounded-lg w-full p-1 hover:bg-black">
                        <button class="rounded-lg w-full p-1 hover:bg-black text-left">
                            
                            {{ filterValue ? filterValue(filter) : filter }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        filters: {
            type: Array,
        },
        /**
         * Function para obtener el valor que yo decida del filtro
         * si el array de filters es un array de objetos
         * como esto: [{ id: 1, name: 'Filtrar per grup' }]
         * y quiero que el valor del filtro sea el name
         * entonces puedo pasar una función que reciba el objeto
         * y devuelva el valor que yo quiera
         * ejemplo: filterValue: (filter) => filter.name
         */
        filterValue: {
            type: Function,
            required: false,
        },
    },
    data() {
        return {
            search: '',
            isDropdownMenuOpen: false,
        };
    },
    methods: {
        toggleDropdownMenu() {
            this.isDropdownMenuOpen = !this.isDropdownMenuOpen;
        },
        filterItems(filter) {
            this.$emit('filter', filter);
        }
    },
};
</script>

<style scoped>

/* Estilos para la barra de desplazamiento en navegadores webkit (Chrome, Safari, etc.) dentro del contenedor #dropdown-menu */
/* Estilos para la barra de desplazamiento vertical */
#dropdown-menu::-webkit-scrollbar {
    width: 10px;
    /* Grosor de la barra de desplazamiento vertical */
}

#dropdown-menu::-webkit-scrollbar-thumb {
    background-color: #888;
    /* Color del "pulgar" de la barra de desplazamiento */
    border-radius: 5px;
    /* Bordes redondeados del "pulgar" */
}

/* Estilos para el fondo de la barra de desplazamiento */
#dropdown-menu::-webkit-scrollbar-track {
    background-color: transparent;
    /* Color del fondo de la barra de desplazamiento (transparente) */
}

/* Estilos para la barra de desplazamiento horizontal */
#dropdown-menu::-webkit-scrollbar-horizontal {
    height: 10px;
    /* Grosor de la barra de desplazamiento horizontal */
}

/* Pseudo-clase hover para el "pulgar" */
#dropdown-menu::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* Cambiar el color del "raton" al pasar el mouse sobre él */
    cursor: grab;
}

#dropdown-menu::-webkit-scrollbar-thumb:active {
    background-color: #111;
    /* Color del botón de la barra de desplazamiento cuando está siendo activo */
    cursor: grabbing;
}
</style>