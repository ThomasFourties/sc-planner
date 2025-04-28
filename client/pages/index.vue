<template>
  <div class="content"></div>
</template>

<script setup>
import { onMounted } from 'vue';

const userIsConnected = ref(true);

onMounted(() => {
  if (userIsConnected.value) {
    window.location.href = '/dashboard';
  } else {
    window.location.href = '/login';
  }
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

</style>