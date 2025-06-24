<template>

</template>

<script setup>

const authStore = useAuthStore();
if (authStore.isLoggedIn) {
  navigateTo('/dashboard');
} else {
  navigateTo('/login');
}

// comments

definePageMeta({
  layout: false,
});

</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>