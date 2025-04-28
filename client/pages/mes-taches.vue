<template>
  <div class="tasks">
    <div class="tasks-content">
      <h1>MES TACHES</h1>
    </div>
  </div>
</template>

<script setup>
onMounted(() => {
  const tasksLink = document.querySelector('.tasks.nav-link');

  if (tasksLink) {
    tasksLink.classList.add('active');
  }
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

.tasks-content{
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
