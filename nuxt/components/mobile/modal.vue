<template>
    <div class="flex justify-center items-center w-full fixed inset-0 bg-black bg-opacity-60 z-[1002]">
        <div
            class=" slide fixed flex flex-col bottom-0 p-8 bg-white w-full h-[70%] items-center text-center text-black rounded-t-lg">
            <span class="material-symbols-rounded rounded-full text-5xl p-2" :class="typeClass">
                {{ type }}
            </span>
            <div class="flex flex-col h-full">
                <div class="text-[1.3rem] font-bold my-4">
                    <h2>
                        <slot name="title">
                            Titulo del modal
                        </slot>
                    </h2>
                </div>
                <div class="text-gray-600">
                    <slot name="content">
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure quaerat architecto alias ut
                            tempora repellat nulla, molestias qui, voluptatum aspernatur minus voluptas quas, veritatis
                            expedita nostrum amet harum iste aliquid.
                        </p>
                    </slot>
                </div>
            </div>
            <div class="mb-0 flex flex-col justify-end w-full">
                <button @click="$emit('close')"
                    class="m-2 px-4 py-2 border-2 border-gray-500 rounded-md text-[1.1rem]">Cancel·la</button>
                <button v-if="msg" @click="confirm" class="m-2 px-4 py-2 rounded-md text-[1.1rem]"
                    :class="buttonTypeClass">{{ msg }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'error'
        },
        msg: {
            type: String,
        }
    },
    data() {
        return {

        }
    },
    computed: {
        typeClass() {
            if (this.type === 'error') {
                return 'text-red-500 bg-red-100';
            } else if (this.type === 'warning') {
                return 'text-yellow-500 bg-yellow-100';
            } else if (this.type === 'done') {
                return 'text-green-500 bg-green-100';
            }
        },
        buttonTypeClass() {
            if (this.type === 'error') {
                return 'bg-red-500 text-white';
            } else if (this.type === 'warning') {
                return 'bg-yellow-500';
            } else if (this.type === 'done') {
                return 'bg-green-500';
            }
        }
    },
    methods: {
        confirm() {
            this.$emit('confirm');
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.slide {
    animation: slide 1s ease;
}

@keyframes slide {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}
</style>
