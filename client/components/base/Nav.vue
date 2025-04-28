<template>
  <nav class="nav">
    <NuxtLink to="dashboard" class="dashboard nav-link"><dashboard />Dashboard</NuxtLink>
    <NuxtLink to="mes-taches" class="tasks nav-link"><tasks />Mes tâches</NuxtLink>
    <NuxtLink to="planning" class="planning nav-link"><calendar />Planning</NuxtLink>
    <i class="separator"></i>
    <p class="nav-link"><chevronBottom />Favoris</p>
    <i class="separator"></i>
    <p class="nav-link"><chevronBottom />Clients</p>
    <i class="separator"></i>
  </nav>
</template>

<script setup>
import calendar from './assets/icons/calendar.svg';
import dashboard from './assets/icons/dashboard.svg';
import tasks from './assets/icons/tasks.svg';
import chevronBottom from './assets/icons/chevron-bottom.svg';
// import create from './assets/icons/create.svg';
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 60px;

  .separator {
    width: calc(100% - 20px);
    height: 1px;
    background: #e7e7e7;
  }

  .nav-link {
    padding: 8px 14px;
    font-size: 16px;
    text-decoration: none;
    font-weight: 500;
    border-radius: 2px;
    margin-left: -14px;
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.2s ease;

    &.active {
      background-color: $gray;
    }

    svg {
      width: 14px;
    }

    &:hover {
      background-color: $gray;
      cursor: pointer;
    }
  }
}
</style>
