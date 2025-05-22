<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">{{ formattedDate }}</p>
      <h1 class="h1">Bonjour {{ user.name }} !</h1>
      {{ data }}
      <p class="soustitle">Aujourd’hui, <span>5 tâches</span> vous sont assignés dans 2 projets différents</p>
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

const user = await $fetch('http://localhost:3001/users');

const date = new Date();
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formattedDate = date.toLocaleDateString('fr-FR', options);
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.dashboard {
  .txt-wp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 120px;
  }

  .surtitle {
    text-transform: capitalize;
    color: $darkGray;
    font-weight: 400;
    font-size: 15px;
  }

  h1,
  .h1 {
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

    @include down(md) {
      width: 100%;
      flex-direction: column;
      gap: 10px;
    }

    .left,
    .right {
      background-color: $white;
      height: 100%;
      border: 1px solid $gray;
      border-radius: 4px;
    }

    .left {
      width: 33%;

      @include down(md) {
        width: 100%;
      }
    }

    .right {
      width: 66%;

      @include down(md) {
        width: 100%;
      }
    }
  }
}
</style>
