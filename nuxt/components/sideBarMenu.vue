<template>
    <aside @mouseover="isOpen = true" @mouseleave="isOpen = false"
        :class="{ 'fixed flex flex-col left-0 bg-black text-white overflow-hidden h-screen px-4 py-0 shadow-md z-[3000]': true, 'w-16': !isOpen, 'w-[15rem]': isOpen }">
        <div class="mx-[-1rem] px-[1rem] bg-white">
            <div class="my-4 flex justify-start transition duration-300 ease-in-out">
                <img :class="{ 'w-8': true, 'w-[3rem]': isOpen }" src=" /img/inspedralbes_logo.svg"
                    alt="Institut Pedralbes">
            </div>
        </div>

        <div
            :class="{ 'menu-toggle-wrap flex justify-end mb-4 relative top-4 transition duration-200 left-1/5': true, 'top-[-3rem]': isOpen }">
            <button
                :class="{ 'menu-toggle transition duration-200 bg-transparent border-none cursor-pointer': true, 'transform rotate-180 margin-right-10': isOpen }">
                <span
                    :class="{ 'material-symbols-rounded text-3xl transition duration-200': true, 'text-black': isOpen }">keyboard_double_arrow_right
                </span>
            </button>
        </div>

        <h3 :class="{'transition-opacity duration-300 ease-in-out text-lightgray-500 text-xs uppercase mb-2':true,'opacity-0':!isOpen}">Menú</h3>
        <div class="mx-[-1rem]">
            <slot></slot>
        </div>
        
        <div class="flex-grow"></div>
        <div class="mx-[-1rem]">
            <slot name="footer"></slot>
        </div>
    </aside>
</template>

<script>
import { useAppStore } from '@/stores/app';
import {computed} from 'vue';

export default {
    data() {
        const store = useAppStore();
        return {
            isOpen: false,
        }
    },
    methods: {
        toggleMenu() {
            const store = useAppStore();

            this.isOpen = !this.isOpen;
            // store.setOpenMenu(this.isOpen);
            this.$emit('toggle-menu', this.isOpen);
        }
    }
}
</script>

<style lang="css">
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


.button:hover{
    background-color: gray;
}

.button:hover span:not(.text){
    color: var(--pedralbes-blue);
}

.isActive{
    background-color: gray;
    border-right:5px solid var(--pedralbes-blue);
}

.isActive span:not(.text) {
    color: var(--pedralbes-blue);
}

</style>