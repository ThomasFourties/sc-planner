<template>
  <div class="window-size">{{ wdSize }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const wdSize = ref('loading');

const updateWdSize = () => {
  const { $getWindowSize } = useNuxtApp();
  wdSize.value = $getWindowSize();
};

onMounted(() => {
  updateWdSize();

  window.addEventListener('resize', updateWdSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWdSize);
});
</script>

<style lang="scss" scoped></style>
