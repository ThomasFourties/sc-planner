<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">Lundi 12 février</p>
      <h1 class="h1">Bonjour, Thomas</h1>
      <p class="soustitle">Aujourd’hui, <span>5 tâches</span> vous sont assignés dans 2 projets différents !</p>
    </div>
    <div class="dashboard-content">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
onMounted(() => {
  const dashboardLink = document.querySelector('.dashboard.nav-link');

  if (dashboardLink) {
    dashboardLink.classList.add('active');
  }
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

.dashboard {
  .txt-wp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 120px;
  }

  .surtitle {
    color: $darkGray;
    font-weight: 400;
    font-size: 15px;
  }

  h1,
  .h1 {
    font-size: 46px;
    color: $black;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .soustitle {
    font-size: 15px;
    color: $black;
    font-weight: 400;

    span {
      text-decoration: underline;
    }
  }

  .dashboard-content {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 80%;
    margin: 0 auto;
    height: 300px;

    .left,
    .right {
      background-color: $white;
      height: 100%;
      border: 1px solid $gray;
      border-radius: 4px;
    }

    .left {
      width: 33%;
    }

    .right {
      width: 66%;
    }
  }
}
</style>
