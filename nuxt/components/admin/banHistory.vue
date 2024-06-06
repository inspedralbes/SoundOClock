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
    <div class="px-[400px] h-[90vh] text-white">
        <h2 class="text-4xl text-center font-black mt-12 mb-8">HISTORIAL DE SANCIONS</h2>
        <p class="text-5xl font-black mb-4">{{ user.name }}</p>
        <div class="w-full flex flex-col gap-2">
            <p class="text-xl mb-2">SANCIONS PRÈVIES: {{ user.bans.length }}</p>
            <div class="h-[36rem] overflow-y-auto grow">
                <table class="w-full">
                    <thead class="bg-gray-300 text-black">
                        <tr class="text-center  border-2 border-white-300">
                            <th class="text-left w-3/5 p-4">SANCIÓ</th>
                            <th class="w-1/5 p-4">DATA INICI</th>
                            <th class="w-1/5 p-4">DATA FINAL</th>
                        </tr>
                    </thead>
                    <tbody class=" border-2 border-white-300">
                        <tr v-for="ban in user.bans" class="">
                            <td v-if="ban.forVoting" class="col-span-4 p-4">VOTAR CANÇONS</td>
                            <td v-else class="col-span-4 p-4">PROPOSAR CANÇONS</td>
                            <td class="text-center p-4">{{ formatDate(ban.banned_from) }}</td>
                            <td class="text-center p-4">{{ formatDate(ban.banned_until) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>