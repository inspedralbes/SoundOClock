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
                <label :for="'option-' + role.id">
                    <p class="uppercase font-black">{{ role.name }}</p>
                    <p>{{ role.description }}</p>
                </label>
            </div>
        </div>
        <button class="pedralbes-button w-fit text-white font-bold mt-4 py-2 px-4 rounded"
            @click="saveUserRole()">DESAR ROL</button>
    </div>

    <ModularModal :open="modals.changeUserRole" type="warning" title="Canviar rol d'usuari"
        @close="modals.changeUserRole = false">
        <template #title>
            <h2>Ets a punt de canviar el rol d'un usuari!</h2>
        </template>
        <template #content>
            <p>Segur que vols que l'usuari <span class="font-bold">{{ user.name }}</span> tingui permisos de
        <span class="font-bold">{{ selectedRole }}?</span>
            </p>
        </template>
    </ModularModal>
</template>

<script>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

export default {
    name: 'AdminUserRolesDetails',
    props: {
        user: Object
    },
    data() {
        const store = useAppStore();
        return {
            roles: computed(() => store.getRoles()),
            selectedRole: null,
            modals: {
                changeUserRole: false
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
        changeCurrentRole() {
            this.selectedRole = this.user.role_id;
        },
        saveUserRole() {
            this.modals.changeUserRole = true;
        }
    },
    watch: {
        "user.role_id": {
            handler: 'changeCurrentRole',
        },
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