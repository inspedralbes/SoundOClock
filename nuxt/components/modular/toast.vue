<template>
    <!-- <UButton label="Show toast" @click="toast.add({title: 'Update downloaded.',
    description: 'It will be installed on restart. Restart now?'})" /> -->
    <UNotifications />
</template>

<script>
import { useAppStore } from '@/stores/app';
export default {
    name: 'toast',
    props: {
        serverResponse: Object,
        time: Number,
    },
    data() {
        return {
            toast: useToast(),
        }
    },
    methods: {
        notifyServerResponse() {

            if (this.serverResponse) {
                this.toast.add({
                    icon: this.iconToast(),
                    title: this.serverResponse.message,
                    color: this.colorToast(),
                    timeout: this.time
                });

                this.store.setServerResponse(null);
            };

        },
        colorToast() {
            if (this.serverResponse.status === 'error') {
                return 'red';
            } else if (this.serverResponse.status === 'success') {
                return 'primary';
            }
        },
        iconToast() {
            if (this.serverResponse.status === 'error') {
                return 'i-heroicons-x-circle';
            } else if (this.serverResponse.status === 'success') {
                return "i-heroicons-check-circle";
            }
        }
    },
    watch: {
        serverResponse: { // Each time the serverResponse changes execute notifyServerResponse() method
            handler: 'notifyServerResponse',
        },
    },
    setup() {
        const store = useAppStore();
        return { store };
    },
};
</script>