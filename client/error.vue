<template>
  <div class="error404">
    <h1>404</h1>
    <h2>Page non trouvée</h2>
    <p>Désolé, la page que vous recherchez n'existe pas.</p>
    <NuxtLink to="/" class="back-home">
      Retour à l'accueil
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'error'
});

onMounted(() => {
  setTimeout(() => {
    navigateTo('/');
  }, 5000);
});
</script>

<style lang="scss" scoped>
.error404 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;

  h1 {
    font-size: 6rem;
    color: #e74c3c;
    margin: 0;
    line-height: 1;
  }

  h2 {
    font-size: 2rem;
    color: #2c3e50;
    margin: 1rem 0;
  }

  p {
    color: #7f8c8d;
    margin-bottom: 2rem;
  }

  .back-home {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #2980b9;
    }
  }
}
</style>
