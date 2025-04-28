<template>
  <div class="content">
    <SearchBar />
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.content {
  width: 100%;
  height: 100%;
  background-color: $white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  // .content {
  //   height: 100%;
  //   width: 100%;
  // }
}
</style>
