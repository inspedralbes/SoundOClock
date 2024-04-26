<template>
    <div v-if="user == null">
    </div>
    <div v-else class="user-details-container rounded-lg text-left p-4">
        <div class="mb-10">
            <p class="text-5xl font-black">{{ user.name }}</p>
        </div>
        <div class="flex flex-col gap-3">
            <div v-for="role in roles" class="radio-card p-4 rounded-lg text-left text-xl"
                :class="backgroundColor(role.id)">
                <input type="radio" :id="'option-' + role.id" name="role-options" :value="role.id" v-model="selectedRole"
                    @change="" />
                <label :for="'option-' + role.id" class="flex flex-row items-center gap-4">
                    <div class="w-fit h-fit" v-html="icon(role.id)"></div>
                    <div class="flex flex-col">
                        <p class="uppercase font-black">{{ role.name }}</p>
                        <p>{{ role.description }}</p>
                    </div>
                </label>
            </div>
        </div>
        <button class="pedralbes-button w-fit text-white font-bold mt-4 py-2 px-4 rounded" @click="saveUserRole()">DESAR
            ROL</button>
    </div>

    <ModularModal :open="modals.changeUserRole" type="warning" msg="Desar" title="Canviar rol d'usuari"
        @confirm="submitData()" @close="modals.changeUserRole = false">
        <template #title>
            <h2>Ets a punt de canviar el rol d'un usuari!</h2>

        </template>
        <template #content>
            <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> tingui permisos de
                <span class="font-bold">{{ roleName(selectedRole) }}?</span>
            </p>
        </template>
    </ModularModal>

    <ModularToast v-bind:serverResponse="serverResponse" time="10000"/>
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
                case 1:
                    style = "bg-indigo-300";
                    break;
                case 2:
                    style = "bg-orange-300";
                    break;
                case 3:
                    style = "bg-rose-300";
                    break;
                case 4:
                    style = "bg-sky-300";
                    break;
                default:
                    return "bg-sky-300";
            }

            return style;
        },
        icon(roleId) {
            let icon;

            switch (roleId) {
                case 1:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='48'  height='48'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-settings'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z' /><path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' /></svg>";
                    break;
                case 2:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='48'  height='48'  viewBox='0 0 24 24'  fill='currentColor'  class='icon icon-tabler icons-tabler-filled icon-tabler-shield-check'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z' /></svg>";
                    break;
                case 3:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='48'  height='48'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-book-2'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z' /><path d='M19 16h-12a2 2 0 0 0 -2 2' /><path d='M9 8h6' /></svg>";
                    break;
                case 4:
                    icon = "<svg  xmlns='http://www.w3.org/2000/svg'  width='48'  height='48'  viewBox='0 0 24 24'  fill='none'  stroke='currentColor'  stroke-width='2'  stroke-linecap='round'  stroke-linejoin='round'  class='icon icon-tabler icons-tabler-outline icon-tabler-school'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M22 9l-10 -4l-10 4l10 4l10 -4v6' /><path d='M6 10.6v5.4a6 3 0 0 0 12 0v-5.4' /></svg>";
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
.user-details-container {
    background-color: rgb(56, 56, 56);
    height: 85vh;
}

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

.pedralbes-button {
    background-color: var(--pedralbes-blue);
}
</style>