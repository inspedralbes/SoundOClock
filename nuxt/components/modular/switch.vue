<template>
    <div class="container">
        <label class="switch-label" @click="toggle" @keydown.space.prevent="toggle">{{ labelText }}</label>
        <span class="toggle-wrapper" role="checkbox" :aria-checked="value.toString()" tabindex="0" @click="toggle"
            @keydown.space.prevent="toggle">
            <span class="toggle-background" :style="backgroundStyles" />
            <span class="toggle-indicator" :style="indicatorStyles" />
        </span>
    </div>
</template>
  

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true
        },
        labelText: {
            type: String,
            default: '' // Valor por defecto para el label
        }
    },
    computed: {
        backgroundStyles() {
            if (this.value) {
                return {
                    backgroundColor: "#00ADEF"
                }
            } else {
                return {
                    backgroundColor: "#c2c2c2"
                }
            }
        },
        indicatorStyles() {
            return { transform: this.value ? 'translateX(14px)' : 'translateX(0)' };
        }

    },

    methods: {
        toggle() {
            this.$emit('input', !this.value);
        }
    }
};

</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-wrapper {
    display: inline-block;
    position: relative;
    cursor: pointer;
    width: 32px;
    height: 18px;
    border-radius: 9999px;
    margin: 8px 0;
}

.toggle-wrapper:focus {
    outline: 0;
}

.toggle-background {
    display: inline-block;
    border-radius: 9999px;
    height: 100%;
    width: 32px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color .4s ease;
}

.toggle-indicator {
    position: absolute;
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
    background-color: #ffffff;
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform .4s ease;
}

.switch-label {
    margin: .2rem;
}
</style>