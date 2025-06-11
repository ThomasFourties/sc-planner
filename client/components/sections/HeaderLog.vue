<template>
  <header class="header-log">
    <NuxtLink to="/">
      <img src="/images/pink-logo.svg" class="logo" alt="Logo" />
    </NuxtLink>
  </header>
</template>

<style lang="scss">
.header-log {
  width: 100%;
  display: inline-flex;
  justify-content: center;
  padding: 40px 0;
  margin-bottom: 100px;

  img {
    width: 100px;
    height: auto;
  }
}
</style>
