<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">Lundi 12 février</p>
      <h1 class="h1">Bonjour, Thomas</h1>
      <p class="soustitle">Aujourd’hui, <span>5 tâches</span> vous sont assignés dans 2 projets différents</p>
    </div>
    <div class="dashboard-content">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
// import { onMounted } from 'vue';

// const userIsConnected = ref(true);

// onMounted(() => {
//   if (userIsConnected.value) {
//     window.location.href = '/dashboard';
//   } else {
//     window.location.href = '/login';
//   }
// });
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

</style>