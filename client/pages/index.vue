<template>
  <div></div>
</template>

<script setup>
const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  navigateTo('/dashboard');
} else {
  navigateTo('/login');
}

definePageMeta({
  layout: false,
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>