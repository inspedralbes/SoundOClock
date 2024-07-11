<template>
    <div v-if="user == null"></div>
    <div v-else class="bg-gray-200 rounded-lg p-6 space-y-6 w-full">
        <div class="text-center">
            <p class="text-4xl font-bold text-gray-900">{{ user.name }}</p>
            <p class="text-lg text-gray-600">{{ user.email }}</p>
            <p class="text-lg text-gray-600">Grups: <span v-for="(group, index) in user.groups" :key="index">{{
                group.abbreviation }}<span v-if="index < user.groups.length - 1">, </span></span>
            </p>
        </div>
        <div class="flex flex-col space-y-4">
            <div v-for="role in roles" :key="role.id">
                <button type="button" v-if="role.id !== 1"
                    class="shadow-md rounded-lg p-4 text-left text-xl border w-full transition-colors duration-200"
                    :class="[backgroundColor(role.id), hoverColor(role.id)]" @click="selectedRole = role.id">
                    <div class="flex items-center space-x-4">
                        <UIcon :name="icon(role.id)" class="text-4xl" />
                        <div class="flex flex-col">
                            <p class="uppercase font-black text-gray-800">{{ role.name }}</p>
                            <p class="text-gray-600">{{ role.description }}</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full md:w-auto mt-4 small-caps"
            @click="saveUserRole()">Desar el rol</button>
    </div>

    <UModal v-model="modals.changeUserRole">
        <div>
            <UAlert title="Estàs segur/a de canviar el rol de l'usuari?"
                icon="i-heroicons-exclamation-triangle-16-solid" color="orange" variant="subtle" class="p-6">
                <template #title="{ title }">
                    <span v-html="title" />
                </template>
                <template #description>
                    <div class="mt-4 flex justify-end space-x-2">
                        <UButton size="md" color="red" @click="modals.changeUserRole = false">Enrere</UButton>
                        <UButton size="md" color="primary" @click="submitData()">Continuar</UButton>
                    </div>
                </template>
            </UAlert>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="absolute right-0 top-0"
                @click="modals.changeUserRole = false" />
        </div>
    </UModal>
    <ModularToast :serverResponse="serverResponse" time="10000" />
</template>

<script>
import { computed } from 'vue';
import { socket } from '../socket';
import { useAppStore } from '@/stores/app';

export default {
    name: 'AdminUserRolesDetails',
    props: {
        user: Object
    },
    data() {
        return {
            roles: computed(() => this.store.getRoles()),
            selectedRole: null,
            modals: {
                changeUserRole: false,
            },
        }
    },
    created() {
        this.changeCurrentRole();
    },
    methods: {
        backgroundColor(roleId) {

            let style;

            if (roleId != this.selectedRole) {
                return "bg-white text-black"
            }

            switch (roleId) {
                case 2:
                    style = "bg-indigo-300";
                    break;
                case 3:
                    style = "bg-orange-300";
                    break;
                case 4:
                    style = "bg-rose-300";
                    break;
                case 5:
                    style = "bg-sky-300";
                    break;
                default:
                    return "bg-sky-300";
            }

            return style;
        },
        hoverColor(roleId) {
            let style;

            switch (roleId) {
                case 2:
                    style = "hover:bg-indigo-400";
                    break;
                case 3:
                    style = "hover:bg-orange-400";
                    break;
                case 4:
                    style = "hover:bg-rose-400";
                    break;
                case 5:
                    style = "hover:bg-sky-400";
                    break;
                default:
                    return "hover:bg-sky-400";
            }

            return style;
        },
        icon(roleId) {
            let icon;

            switch (roleId) {
                case 2:
                    icon = 'i-heroicons-user-circle-20-solid'; // Administrador
                    break;
                case 3:
                    icon = 'i-heroicons-shield-check-20-solid'; // Moderador
                    break;
                case 4:
                    icon = 'i-heroicons-academic-cap-20-solid'; // Profesor
                    break;
                case 5:
                    icon = 'i-heroicons-academic-cap'; // Estudiante
                    break;
                default:
                    icon = 'i-heroicons-user-circle-20-solid'; // Por defecto, usar icono de Administrador
                    break;
            }


            return icon;

        },
        roleName(roleId) {

            for (let i = 0; i < this.roles.length; i++) {
                if (this.roles[i].id === roleId) {
                    return this.roles[i].name;
                }
            }
        },
        changeCurrentRole() {
            this.selectedRole = this.user.role_id;
        },
        saveUserRole() {
            this.modals.changeUserRole = true;
        },
        submitData() {
            this.modals.changeUserRole = false
            // Object.assign() method copies all properties of a source object into a target object ==> Object.assign(target, source)
            let auxUser = Object.assign({}, this.user);
            auxUser.role_id = this.selectedRole;
            socket.emit('updateUserRole', this.store.getUser().token, auxUser);
        },
    },
    unmounted() {
        this.store.setServerResponse(null);
    },
    computed: {
        serverResponse() {
            return this.store.getServerResponse();
        },
    },
    watch: {
        user: {
            handler: 'changeCurrentRole',
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
};
</script>

<style scoped>
.radio-card {
    border: none;
    /* cursor: pointer; */
    transition: background-color 1s;
}

.radio-card>input {
    cursor: pointer;
}

.radio-card>label {
    cursor: pointer;
}

input[type="radio"] {
    display: none;
    /* Amaga el radio button per defecte*/
}
</style>