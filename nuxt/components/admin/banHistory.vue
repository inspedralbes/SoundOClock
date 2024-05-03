<script>
import { formatDate } from '../utils';

export default {
    name: 'banHistory',
    props: {
        user: Object
    },
    data() {
        return {
            bans: [],
        }
    },
    created() {
        this.user.bans.sort((a, b) => new Date(b.banned_from) - new Date(a.banned_from));
    },
    methods: {
        formatDate(date) {
            return formatDate(date);
        },
    },
    watch: {
    }
};
</script>

<template>
    <div class="px-[400px] h-[90vh]">
        <h2 class="text-4xl text-center font-black mt-12 mb-8">HISTORIAL DE SANCIONS</h2>
        <p class="text-5xl font-black mb-4">{{ user.name }}</p>
        <div class="w-100 p-0 flex flex-col gap-2">
            <p class="text-xl mb-2">SANCIONS PRÈVIES: {{ user.bans.length }}</p>
            <div class="h-[36rem] overflow-y-auto grow">
                <table class="w-full">
                    <thead>
                        <tr class="text-center">
                            <th class="w-3/5">SANCIÓ</th>
                            <th class="w-1/5">DATA INICI</th>
                            <th class="w-1/5">DATA FINAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ban in user.bans">
                            <td v-if="ban.forVoting" class="col-span-4">VOTAR CANÇONS</td>
                            <td v-else class="col-span-4">PROPOSAR CANÇONS</td>
                            <td class="text-center">{{ formatDate(ban.banned_from) }}</td>
                            <td class="text-center">{{ formatDate(ban.banned_until) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.report-container {
    background-color: rgb(56, 56, 56);
}

th {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding: 1rem;
}

td {
    border-bottom: 1px solid black;
    padding: 1rem;
}
</style>