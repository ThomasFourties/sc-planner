<template>
  <NuxtLink :class="['btn', style]" :to="url" :target="target ? '_blank' : '_self'">
    {{ label }}
    <i v-if="icon === 'arrow-right'"><arrowRight /></i>
    <i v-if="icon === 'arrow-left'"><arrowLeft /></i>
    <i v-if="icon === 'arrow-diag'"><arrowDiag /></i>
  </NuxtLink>
</template>

<script setup>
import arrowRight from '~/assets/icons/arrow-right.svg';
import arrowLeft from '~/assets/icons/arrow-left.svg';
import arrowDiag from '~/assets/icons/arrow-diag.svg';

const props = defineProps({
  url: {
    type: String,
  },
  target: {
    type: Boolean,
  },
  style: {
    type: String,
    default: '',
  },
  label: {
    type: String,
  },
  icon: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
</style>
