<template>
  <NuxtLayout>
    <!-- <WindowSize /> -->
    <!-- <Grid /> -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
authStore.initializeAuth();

useSeoMeta({
  title: 'SC Planner — Gestionnaire de tâches',
  ogTitle: 'SC Planner — Gestionnaire de tâches',
  description: 'SC Planner est un gestionnaire de tâches simple et efficace.',
  ogDescription: 'SC Planner est un gestionnaire de tâches simple et efficace.',
});
</script>
