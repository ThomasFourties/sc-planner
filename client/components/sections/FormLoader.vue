<template>
    <div class="loading-container" v-if="status">
        <div class="loading-content">
            <div class="loading-spinner" :class="{ 'ok': statusSpinner, 'not-ok': !statusSpinner }"></div>
            <p>{{ statusMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    status: {
        type: Boolean,
        required: true,
    },
    statusMessage: {
        type: String,
        required: true,
    },
    statusSpinner: {
        type: Boolean,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: $white, $alpha: 0.9);
    z-index: 1000;
    color: $black;

    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba($color: $lightGray, $alpha: 0.2);
        border-top: 5px solid $green;
        border-radius: 50%;
        animation: spin 1s linear infinite;

        &.ok {
            border-top: 5px solid $green;
        }

        &.not-ok {
            border: none;
            background: url('../../assets/icons/check-green.svg') no-repeat center center;
            background-size: contain;
            animation: none;
            color: $green;
            width: 40px;
            height: 40px;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    }
}
</style>