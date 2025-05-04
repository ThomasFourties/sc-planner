<template>
  <div class="wrapper main">
    <Sidebar />
    <MainContent />
  </div>
</template>

<style lang="scss">
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;
@use '../assets/scss/utils/mixins' as *;

.main {
  display: flex;
  gap: 30px;

  @include down(md) {
    flex-direction: column-reverse;
    justify-content: space-between;
  }
}
</style>
