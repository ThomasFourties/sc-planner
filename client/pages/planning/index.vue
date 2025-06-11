<template>
  <div class="planning">
    <div class="planning-content">
      <h1>PLANNING</h1>
    </div>
  </div>
</template>

<script setup>
onMounted(() => {
  const planningLink = document.querySelector('.planning.nav-link');

  if (planningLink) {
    planningLink.classList.add('active');
  }
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;

.planning-content {
  width: 100%;
  height: 400px;
  background-color: $red;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
}
</style>
