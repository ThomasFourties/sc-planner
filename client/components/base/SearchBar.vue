<template>
  <div class="search-bar-container">
    <input type="text" class="search-bar" placeholder="Chercher un projet, une tâche ..." />
    <search />
  </div>
</template>

<script setup>
import search from './assets/icons/search.svg';
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.search-bar-container {
  position: relative;
  height: 40px;
  width: 420px;
  margin: 0 auto 80px auto;

  @include down(md) {
    width: 100%;
  }

  .search-bar {
    background: $white;
    // background: $white;
    border: 1px solid $gray;
    font-size: 14px;
    border-radius: 4px;
    margin: 0 auto;
    display: flex;
    align-content: center;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    padding: 8px 12px;
    height: 100%;

    &::placeholder{
      color: $gray;;
    }

    &:focus {
      outline: none;
    }
  }

  .nuxt-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 16px;
    height: 16px;
    color: $gray;
    cursor: pointer;
  }
}
</style>
