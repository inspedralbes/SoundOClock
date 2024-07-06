<script setup lang="ts">
import { add, format, isSameDay, type Duration } from 'date-fns'
import { es, ca } from 'date-fns/esm/locale';
import { ref, watch, defineProps } from 'vue'

// Define props
const props = defineProps({
    initialStartDate: {
        type: Date,
        default: () => new Date()
    },
    initialEndDate: {
        type: Date,
        default: () => add(new Date(), { days: 14 })
    }
})

const emit = defineEmits(['rangeSelected'])

const ranges = [
    { label: 'Pròxims 7 dies', duration: { days: 7 } },
    { label: 'Pròxims 14 dies', duration: { days: 14 } },
    { label: 'Pròxims 30 dies', duration: { days: 30 } },
    { label: 'Pròxims 3 mesos', duration: { months: 3 } },
    { label: 'Pròxims 6 mesos', duration: { months: 6 } },
    { label: 'Pròxim any', duration: { years: 1 } }
]

const selected = ref({
    start: props.initialStartDate,
    end: props.initialEndDate
})

function isRangeSelected(duration: Duration) {
    return isSameDay(selected.value.start, props.initialStartDate) && isSameDay(selected.value.end, add(props.initialStartDate, duration))
}

function selectRange(duration: Duration) {
    selected.value = { start: props.initialStartDate, end: add(props.initialStartDate, duration) }
}

watch(selected, (newVal) => {
    emit('rangeSelected', newVal)
}, { deep: true })
</script>

<template>
    <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid">
            {{ format(selected.start, 'd MMM, yyyy', { locale: ca }) }} - {{ format(selected.end, 'd MMM, yyyy', {
                locale: ca
            }) }}
        </UButton>

        <template #panel="{ close }">
            <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                <div class="hidden sm:flex flex-col py-4">
                    <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray"
                        variant="ghost" class="rounded-none px-6"
                        :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                        truncate @click="selectRange(range.duration)" />
                </div>

                <DatePickerBase v-model="selected" @close="close" />
            </div>
        </template>
    </UPopover>
</template>
