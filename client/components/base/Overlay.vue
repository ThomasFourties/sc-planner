<template>
    <div class="overlay" :style="{ opacity: opacity }" :class="{ active: opacity > 0 }" @click="$emit('click')"></div>
</template>

<script setup>
const props = defineProps({
    opacity: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['click']);
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
    z-index: 50;
    transition: opacity 0.3s ease;

    &.active {
        pointer-events: all;
        cursor: pointer;
    }
}
</style>