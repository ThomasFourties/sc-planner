<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">Lundi 12 février</p>
      <h1 class="h1">Bonjour, Thomas</h1>
      <p class="soustitle">Aujourd’hui, <span>5 tâches</span> vous sont assignés dans 2 projets différents</p>
    </div>
    <div class="dashboard-content">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import fetcher from '~/utils/fetcher';

// fetch localhost:3001/projects sans le fetcher
const projects = ref([]);
const fetchProjects = async () => {
  try {
    const response = await fetch('http://localhost:3001/projects');

    if (response.ok) {
      projects.value = await response.json();
    } else {
      console.error('Error fetching projects:', response.statusText);
    }

  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
</style>
