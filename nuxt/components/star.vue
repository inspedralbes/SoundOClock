<template>
    <div :style="{ top: top + 'px', left: left + 'px', animationDelay: delay + 's' }" class="star"></div>
</template>

<script>
export default {
    props: ['top', 'left', 'delay']
}
</script>

<style scoped>
.star {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: white;
    border-radius: 50%;
    animation: star-fall 10s linear infinite;
}

@keyframes star-fall {
    from {
        transform: translateY(-100vh) translateX(-100vw);
    }

    to {
        transform: translateY(100vh) translateX(100vw);
    }
}
</style>