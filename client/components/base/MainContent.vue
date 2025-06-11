<template>
  <div class="main-content">
    <div class="content">
      <SearchBar />
      <NuxtPage />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.main-content {
  width: calc(100% - 200px - 30px);
  display: flex;
  height: calc(100vh - 60px);
  margin: 30px 0;
  overflow: hidden;

  @include down(md) {
    width: 100%;
    // height: auto;
    height: calc(100vh - 90px);
    margin: 4% 0;
  }

  .content {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 30px;
    background-color: $white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    @include down(md) {
      padding: 20px;
    }
  }

  // .round {
  //   position: absolute;
  //   top: -170px;
  //   left: -170px;
  //   width: 300px;
  //   height: 300px;
  //   color: $green;
  //   opacity: 0.8;
  //   pointer-events: none;

  //   &.r-2 {
  //     top: -170px;
  //     left: auto;
  //     right: -170px;
  //     color: $blue;
  //   }

  //   &.r-3 {
  //     top: auto;
  //     bottom: -170px;
  //     left: -170px;
  //     color: $red;
  //   }

  //   &.r-4 {
  //     top: auto;
  //     bottom: -170px;
  //     left: auto;
  //     right: -170px;
  //     color: $yellow;
  //   }
  // }
}
</style>
