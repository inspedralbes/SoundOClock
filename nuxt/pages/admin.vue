<template>
    <div class="w-screen h-screen" v-if="loading">
        <Loader />
    </div>
    <SideBarMenu @toggle-menu="isOpen = $event" v-if="!loading" @mouseover="isOpen = true" @mouseleave="isOpen = false">
        <!-- 
            - Cada 'button' de dentro del sidebar-menu es un boton que cambia la pantalla. 
            - La pantalla que se muestra depende de la variable 'selected_screen'.
            - Lo único que hay que cambiar al duplicar el botón es el valor de 'selected_screen' al hacer click, en la clase 'isActive', el texto del botón y el icono.

            Iconos disponibles en: https://fonts.google.com/icons?selected=Material+Symbols+Rounded:alarm:FILL@1;wght@400;GRAD@0;opsz@24&icon.query=clock&icon.set=Material+Symbols&icon.style=Rounded
        -->
        <!-- --------- -->
        <button @click="changeScreen(0)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 0 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                alarm
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Alarma</span>
        </button>
        <!-- --------- -->
        <button @click="changeScreen(1)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 1 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                groups
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Grups</span>
        </button>
        <!-- --------- -->
        <button @click="changeScreen(2)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 2 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                warning
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Informes</span>
        </button>
        <button @click="changeScreen(3)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 3 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                person_cancel
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Usuaris</span>
        </button>
        <!-- --------- -->
        <button @click="changeScreen(4)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 4 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                music_off
            </span>
            <span :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Llista
                negra</span>
        </button>
        <!-- --------- -->
        <button @click="changeScreen(5)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 5 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                lyrics
            </span>
            <span :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">
                Megafonia
            </span>
        </button>
        <!-- --------- -->
        <button @click="changeScreen(6)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 6 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                pending_actions
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Planificar
                Cançons</span>
        </button>
        <button @click="changeScreen(7)"
            :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 7 }">
            <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                manage_accounts
            </span>
            <span
                :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Permisos
                d'usuari
            </span>
        </button>
        <!-- 
            El contenido que vaya dentro del template v-slot:footer se mostrará al final del sidebar-menu.
         -->
        <template v-slot:footer>
            <button @click="changeScreen(8)"
                :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true, 'isActive': selected_screen === 8 }">
                <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                    settings
                </span>
                <span
                    :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Configuració</span>
            </button>
            <button @click="$router.push('/llista_propostes')"
                :class="{ 'button flex items-center text-decoration-none bg-transparent border-none w-full cursor-pointer transition duration-200 ease-in-out py-2 px-4': true }">
                <span class="material-symbols-rounded text-white text-[2rem] transition duration-200 ease-in-out mr-4">
                    keyboard_return
                </span>
                <span
                    :class="{ 'text text-white transition duration-200 ease-in-out': true, 'opacity-0': !isOpen }">Tornar
                    a Inici</span>
            </button>
        </template>
    </SideBarMenu>
    <!-- </div> -->
    <component :is="active_screen" v-if="!loading" />
</template>

<script>
import { socket } from '@/socket';
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            store: useAppStore(),
            selected_screen: computed(() => this.store.admin.selected_screen),
            screens: {
                0: resolveComponent('AdminAlarmsCrud'),
                1: resolveComponent('AdminGroupsCrud'),
                2: resolveComponent('AdminBanSong'),
                3: resolveComponent('AdminBanUser'),
                4: resolveComponent('AdminBlackListCrud'),
                5: resolveComponent('AdminScript'),
                6: resolveComponent('AdminSetSongs'),
                7: resolveComponent('AdminManageRoles'),
                8: resolveComponent('AdminSettings'),
            },
            loading: false,
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
        changeScreen(screen) {
            this.store.setAdminSelectedScreen(screen);
        }
    },
    computed: {
        active_screen() {
            return this.screens[this.selected_screen];
        }
    }
}
</script>

<style></style>