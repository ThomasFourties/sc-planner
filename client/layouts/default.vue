<template>
  <div class="wrapper main">
    <Navigation />
    <div class="main-content">
      <div class="content">
        <SearchBar />
        <NuxtPage />
        <round class="round r-1" />
        <round class="round r-2" />
        <round class="round r-3" />
        <round class="round r-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import round from '~/assets/icons/round.svg';
</script>

<style lang="scss">
@use '../assets/scss/base/variables' as *;
@use '../assets/scss/utils/sections' as *;

.main {
  display: flex;
}

.main-content {
  width: 100%;
  display: flex;
  height: calc(100vh - 60px);
  margin: 30px 0;
  overflow: hidden;

  .content {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 30px;
    background-color: $white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .round {
    position: absolute;
    top: -170px;
    left: -170px;
    width: 300px;
    height: 300px;
    color: $green;
    opacity: 0.9;

    &.r-2 {
      top: -170px;
      left: auto;
      right: -170px;
      color: $blue;
    }

    &.r-3 {
      top: auto;
      bottom: -170px;
      left: -170px;
      color: $red;
    }

    &.r-4 {
      top: auto;
      bottom: -170px;
      left: auto;
      right: -170px;
      color: $yellow;
    }
  }
}
</style>
