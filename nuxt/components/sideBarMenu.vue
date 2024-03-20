<template>
    <aside
        :class="{ 'fixed flex flex-col left-0 bg-black text-white overflow-hidden h-screen px-4 py-0 shadow-md z-50': true, 'w-16': !isOpen, 'w-[18rem]': isOpen }">
        <div class="mx-[-1rem] px-[1rem] bg-white">
            <div class="my-4 flex justify-start transition duration-300 ease-in-out">
                <img :class="{ 'w-8': true, 'w-[3rem]': isOpen }" src=" /img/inspedralbes_logo.svg"
                    alt="Institut Pedralbes">
            </div>
        </div>

        <div
            :class="{ 'menu-toggle-wrap flex justify-end mb-4 relative top-4 transition duration-200 left-1/5': true, 'top-[-3.5rem]': isOpen }">
            <button
                :class="{ 'menu-toggle transition duration-200 bg-transparent border-none cursor-pointer': true, 'transform rotate-180 margin-right-10': isOpen }"
                @click="isOpen = !isOpen">
                <span
                    :class="{ 'material-symbols-outlined text-3xl transition duration-200': true, 'text-black': isOpen }">keyboard_double_arrow_right
                </span>
            </button>
        </div>

        <h3 :class="{'transition-opacity duration-300 ease-in-out text-lightgray-500 text-xs uppercase mb-2':true,'opacity-0':!isOpen}">Menú</h3>
        <div>
            <slot></slot>
        </div>


    </aside>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
        }
    },
    methods: {

    }
}
</script>

<style scoped>
/* * {
    color: white;
} */

aside {
    transition: 0.2s ease-in-out;
}

aside img {
    transition: 0.2s ease-in-out;
}

.menu-toggle-wrap {
    transition: 0.2s ease-in-out;
}

.menu-toggle:hover span {
    transform: translateX(0.5rem);
    color: var(--pedralbes-blue);
}
</style>