<template>
  <div v-if="showGrid" class="grid">
    <div v-for="(item, index) in gridItems" :key="index" class="grid-item"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showGrid = ref(true);
const gridItems = ref(Array.from({ length: 12 }, (_, index) => `${index + 1}`));
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;
@use '../../assets//scss/utils/mixins' as *;

.grid {
  position: fixed;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  margin: 0 40px;
  z-index: 99999;
  height: 100vh;
  top: 0;
  width: calc(100vw - 40px * 2);
  pointer-events: none;

  @include down(sm) {
    width: calc(100vw - 40px);
    grid-template-columns: repeat(6, 1fr);
    margin: 0 20px;
  }
}

.grid-item {
  background-color: rgba($green, 0.03);
  border: 1px solid rgba($black, 0.03);
}
</style>
