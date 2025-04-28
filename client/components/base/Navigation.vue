<template>
  <div class="navigation">
    <div class="logo-container">
      <NuxtLink to="/dashboard"> <NuxtImg src="images/pink-logo.svg" alt="Logo" class="logo" /></NuxtLink>
    </div>
    <Nav />
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.navigation {
  width: 250px;
  height: 100%;
  padding: 30px 0;

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .logo {
      width: 120px;
    }
  }
}
</style>
