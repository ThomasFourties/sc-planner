<template>
  <div class="modal" :class="{ open: isOpen }">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <Close class="close" @click="closeModal" />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Close from '@/assets/icons/close.svg';

const props = defineProps({
  isOpen: {
    type: Boolean,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
</style>
