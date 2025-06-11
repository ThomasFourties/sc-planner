<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>

<script setup>

const authStore = useAuthStore();
if (authStore.isLoggedIn) {
  navigateTo('/dashboard');
} else {
  navigateTo('/login');
}

</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>