<script>
import { formatDate } from '../utils';

export default {
    name: 'banHistory',
    props: {
        user: Object
    },
    data() {
        return {

        }
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
            <table>
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
            <!-- <div class="flex flex-col gap-2">
                <div
                    class="report-container text-white p-4 grid grid-cols-12 gap-3 rounded-lg items-center">
                    <span class="col-span-4">SANCIÓ</span>
                    <span class="col-span-4 text-center">DATA INICI</span>
                    <span class="col-span-4 text-center">DATA FINAL</span>
                </div>
                <div v-for="ban in user.bans"
                    class="report-container text-white p-4 grid grid-cols-12 gap-3 rounded-lg items-center">
                    <span v-if="ban.forVoting" class="col-span-4">VOTAR CANÇONS</span>
                    <span v-else class="col-span-4">PROPOSAR CANÇONS</span>
                    <span class="col-span-4 text-center">{{ formatDate(ban.banned_from) }}</span>
                    <span class="col-span-4 text-center">{{ formatDate(ban.banned_until) }}</span>
                </div>
            </div> -->
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