<template>
    <SideBarMenu @toggle-menu="isOpen=$event">
        <!-- 
            - Cada 'button' de dentro del sidebar-menu es un boton que cambia la pantalla. 
            - La pantalla que se muestra depende de la variable 'active_screen'.
            - Lo único que hay que cambiar al duplicar el botón es el valor de 'active_screen' al hacer click, en la clase 'isActive', el texto del botón y el icono.

            Iconos disponibles en: https://fonts.google.com/icons?selected=Material+Symbols+Rounded:alarm:FILL@1;wght@400;GRAD@0;opsz@24&icon.query=clock&icon.set=Material+Symbols&icon.style=Rounded
        -->
        <!-- --------- -->
        <button @click="active_screen='alarm'" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':active_screen==='alarm'}">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                alarm
            </span>
            <span :class="{'text text-white transition duration-200 ease-in-out':true,'opacity-0':!isOpen}">Alarma</span>
        </button>
        <!-- --------- -->
        <button @click="active_screen='groups'" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':active_screen==='groups'}">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                groups
            </span>
            <span :class="{'text text-white transition duration-200 ease-in-out':true,'opacity-0':!isOpen}">Grups</span>
        </button>
        <!-- --------- -->
        <button @click="active_screen='reports'" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':active_screen==='reports'}">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                flag
            </span>
            <span :class="{'text text-white transition duration-200 ease-in-out':true,'opacity-0':!isOpen}">Informes</span>
        </button>
        <!-- --------- -->
        <!-- 
            El contenido que vaya dentro del template v-slot:footer se mostrará al final del sidebar-menu.
         -->
        <template v-slot:footer>
            <button @click="active_screen='config'" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':active_screen==='config'}">
                <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                    settings
                </span>
                <span :class="{'text text-white transition duration-200 ease-in-out':true,'opacity-0':!isOpen}">Configuració</span>
            </button>
      </template>
    </SideBarMenu>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
            active_screen: '',
        }
    },
}
</script>

<style>
body {
    background-color: rgb(244, 244, 244) !important;
}
</style>