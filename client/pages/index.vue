<template>
  <div>
    <p>Redirection en cours...</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>