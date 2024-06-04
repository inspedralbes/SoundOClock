<template>
    <div id="gradient" class="gradient" :style="currGradientStyle"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const colors = [
    { start: [0, 30, 82], stop: [28, 27, 34] },
    { start: [125, 124, 122], stop: [9, 9, 11] }
]
// const colors = [
//     { start: [41, 121, 255], stop: [245, 0, 87] },
//     { start: [144, 164, 174], stop: [66, 66, 66] }
// ]

const step = ref(0)
const currIdx = ref(0)
const nextIdx = ref(1)
const totalSteps = 228
const rgbValues = {
    start: [0, 0, 0],
    stop: [0, 0, 0]
}
const rgbSteps = {
    start: [0, 0, 0],
    stop: [0, 0, 0]
}
const col1 = ref(null)
const col2 = ref(null)
const currGradientStyle = ref({})

function nextStep(n) {
    return (n + 1 < colors.length) ? n + 1 : 0
}

function calcStepSize(a, b) {
    return (a - b) / totalSteps
}

function calcSteps() {
    for (let key in rgbValues) {
        if (rgbValues.hasOwnProperty(key)) {
            for (let i = 0; i < 3; i++) {
                rgbValues[key][i] = colors[currIdx.value][key][i]
                rgbSteps[key][i] = calcStepSize(colors[nextIdx.value][key][i], rgbValues[key][i])
            }
        }
    }
}

function updateGradient() {
    for (let key in rgbValues) {
        if (rgbValues.hasOwnProperty(key)) {
            for (let i = 0; i < 3; i++) {
                rgbValues[key][i] += rgbSteps[key][i]
            }
        }
    }

    let tCol1 = "rgb(" + Math.round(rgbValues.start[0]) + "," + Math.round(rgbValues.start[1]) + "," + Math.round(rgbValues.start[2]) + ")"
    let tCol2 = "rgb(" + Math.round(rgbValues.stop[0]) + "," + Math.round(rgbValues.stop[1]) + "," + Math.round(rgbValues.stop[2]) + ")"

    if (tCol1 !== col1.value || tCol2 !== col2.value) {
        col1.value = tCol1
        col2.value = tCol2
        currGradientStyle.value.backgroundImage = "linear-gradient(45deg, " + col1.value + ", " + col2.value + ")"
    }

    step.value++
    if (step.value > totalSteps) {
        step.value = 0;

        currIdx.value = nextStep(currIdx.value)
        nextIdx.value = nextStep(nextIdx.value)

        calcSteps()
    }

    if (currGradientStyle.value.backgroundImage.indexOf("gradient") !== -1) {
        window.requestAnimationFrame(updateGradient)
    }
}

onMounted(() => {
    calcSteps()
    window.requestAnimationFrame(updateGradient)
})
</script>

<style>
.gradient {
    /* position: absolute; */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>