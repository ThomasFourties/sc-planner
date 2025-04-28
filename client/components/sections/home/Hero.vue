<template>
  <main class="section section-hero">
    <h1 class="title">Welcome to the <span>Nuxt.js</span> Starter</h1>
    <p class="description">A simple and easy to use Nuxt.js starter template</p>
    <div class="buttons">
      <Button url="/styleguide" label="Styleguide page" icon="arrow-right" />
    </div>
  </main>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '../../../assets/scss/base/variables' as *;

.description {
  margin-bottom: 20px;
}
</style>
