<template>
  <div class="sidebar">
    <div class="top">
      <div class="logo-container">
        <NuxtLink to="/"> <NuxtImg src="images/pink-logo.svg" alt="Logo" class="logo" /></NuxtLink>
      </div>
      <Nav />
    </div>
    <div class="bottom">
      <p class="settings"><settings />Paramètres</p>
      <p class="help"><help />Aide</p>
      <div class="profile">
        <div class="img">
          <NuxtImg src="images/profile.png" alt="Profile" />
        </div>
        <div class="info">
          <p class="name">Thomas Fourties</p>
          <p class="email">thomas@supercolor.cool</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import settings from './assets/icons/settings.svg';
import help from './assets/icons/help.svg';
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  padding: 50px 0;

  @include down(md) {
    position: fixed;
    bottom: 0;
    width: 100%;
    flex-direction: row;
    overflow: hidden;
    padding: 0;
  }

  .top {
    @include down(md) {
      width: 100%;
    }

    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      @include down(md) {
        display: none;
      }

      .logo {
        width: 120px;
      }
    }
  }

  .bottom {
    margin-top: auto;

    @include down(md) {
      display: none;
    }

    .settings,
    .help {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      font-size: 16px;
      text-decoration: none;
      font-weight: 500;
      border-radius: 2px;
      margin-left: -14px;
      width: fit-content;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $gray;
        cursor: pointer;
      }
    }

    svg {
      width: 14px;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;

      .img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        overflow: hidden;
      }

      .info {
        display: flex;
        flex-direction: column;

        .name {
          font-size: 12px;
        }

        .email {
          font-size: 8px;
          color: $darkGray;
        }
      }
    }
  }
}
</style>
