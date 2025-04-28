<template>
  <footer class="footer wrapper">
    <div class="footer-container">
      <p>&copy; {{ currentYear }} Nuxt Starter w/ Nest</p>
      <NuxtLink class="logo" to="/">
        <NuxtImg src="images/logo.svg" alt="Logo" width="100" height="100" />
      </NuxtLink>
      <p>Powered by <a href="https://nuxtjs.org" target="_blank" rel="noopener noreferrer">Nuxt.js</a> and <a href="https://nestjs.com" target="_blank" rel="noopener noreferrer">NestJS</a></p>
    </div>
  </footer>
</template>

<script setup>
const date = new Date();
const year = date.getFullYear();
const currentYear = ref(year);
</script>
