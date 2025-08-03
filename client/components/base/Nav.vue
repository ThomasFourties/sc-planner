<template>
  <nav class="nav">
    <NuxtLink to="/dashboard" class="dashboard nav-link">
      <LayoutDashboard /> Dashboard
    </NuxtLink>
    <NuxtLink to="/mes-taches" class="tasks nav-link">
      <ListTodo /> Mes tâches
    </NuxtLink>
    <NuxtLink class="planning nav-link closed">
      <ChartGantt />Planning
    </NuxtLink>
    <!-- <i class="separator"></i> -->
    <!-- <p class="nav-link">
      <chevronBottom />Favoris
    </p> -->
    <i class="separator"></i>
    <NuxtLink to="/clients" class="clients nav-link">
      <Users />Clients
    </NuxtLink>
    <!-- <NuxtLink to="/projets" class="projets nav-link">
      <FolderOpenDot />Projets
    </NuxtLink> -->
    <i class="separator"></i>
  </nav>
</template>

<script setup>
import { LayoutDashboard, ListTodo, ChartGantt, ChevronDown, Users, FolderOpenDot } from 'lucide-vue-next';
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 60px;

  @include down(md) {
    flex-direction: row;
    overflow: scroll;
    padding: 15px;
    padding-bottom: 10px;
    margin-top: 0;
  }

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
    border-radius: 4px;
    margin-left: -14px;
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.2s ease;
    min-width: max-content;

    &.closed {
      cursor: not-allowed;
    }

    &.active {
      background-color: rgba($gray, 0.1);
    }

    svg {
      width: 14px;
    }

    &:hover {
      background-color: rgba($gray, 0.1);
      // cursor: pointer;
    }
  }
}
</style>
