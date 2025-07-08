<template>
    <div class="overlay" :style="{ opacity: opacity }"></div>
</template>

 <!-- TODO: mettre le composant opacity à opacity 1 quand showForm est true avec le store -->

<script setup>
const props = defineProps({
    opacity: {
        type: Number,
        default: 0,
    },
});
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
}
</style>