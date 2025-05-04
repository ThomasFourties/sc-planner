<script setup>
const logged = true;

if (!logged) {
  navigateTo('/register');
} else {
  navigateTo('/dashboard');
}

onMounted(() => {});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>
