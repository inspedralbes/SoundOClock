<template>
    <SideBarMenu @toggle-menu="isOpen = $event">
        <!-- 
            - Cada 'button' de dentro del sidebar-menu es un boton que cambia la pantalla. 
            - La pantalla que se muestra depende de la variable 'selected_screen'.
            - Lo único que hay que cambiar al duplicar el botón es el valor de 'selected_screen' al hacer click, en la clase 'isActive', el texto del botón y el icono.

            Iconos disponibles en: https://fonts.google.com/icons?selected=Material+Symbols+Rounded:alarm:FILL@1;wght@400;GRAD@0;opsz@24&icon.query=clock&icon.set=Material+Symbols&icon.style=Rounded
        -->
        <!-- --------- -->
        <button @click="selected_screen = 0"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 0 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                alarm
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Alarma</span>
        </button>
        <!-- --------- -->
        <button @click="selected_screen = 1"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 1 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                groups
            </span>
            <span :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Grups</span>
        </button>
        <!-- --------- -->
        <button @click="selected_screen = 2"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 2 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                warning
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Informes</span>
        </button>
        <button @click="selected_screen = 3"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 3 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                person_cancel
            </span>
            <span :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Usuaris</span>
        </button>
        <!-- --------- -->
        <button @click="selected_screen=4" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':selected_screen===4}">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                music_off
            </span>
            <span :class="{'text text-white transition duration-200 ease-in-out':true,'opacity-0':!isOpen}">Llista negra</span>
        </button>
        <!-- --------- -->
        <!-- 
            El contenido que vaya dentro del template v-slot:footer se mostrará al final del sidebar-menu.
         -->
        <template v-slot:footer>
            <button @click="selected_screen=5" :class="{'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4':true,'isActive':selected_screen===3}">
                <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                    settings
                </span>
                <span
                    :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Configuració</span>
            </button>
        </template>
    </SideBarMenu>

    <component :is="active_screen" />
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';
import {computed} from 'vue';

export default {
    data() {
        return {
            isOpen: false,
            selected_screen: 1,
            screens:{
                0: resolveComponent('AdminAlarmsCrud'),
                1: resolveComponent('AdminGroupsCrud'),
                2: resolveComponent('BanSong'),
                3: resolveComponent('BanUser'),
                // 3: resolveComponent('AdminSettingsCrud')
                4: resolveComponent('AdminBlackListCrud')

            }
        }
    },
    setup() {
            const store = useAppStore();
            return { store };
        },
    created() {
            socket.emit('getGroups', this.store.getUser().token);
    },
    methods: {

    },
    computed: {
        active_screen() {
            return this.screens[this.selected_screen];
        }
    }
}
</script>

<style></style>