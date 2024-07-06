<template>
    <SideBarMenu2 />
    <div class="flex justify-end mt-4">
        <div class="w-4/5 mx-6">
            <h2 class="text-3xl text-center font-bold">{{ title }}</h2>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>
