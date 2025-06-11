const breakpoints = {
  xs: 350,
  sm: 440,
  md: 768,
  lg: 1280,
  xl: 1440,
  xxl: 1920,
};

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.provide('getWindowSize', () => {
      const width = window.innerWidth;

      if (width <= breakpoints.xs) {
        return 'xs';
      } else if (width <= breakpoints.sm) {
        return 'sm';
      } else if (width <= breakpoints.md) {
        return 'md';
      } else if (width <= breakpoints.lg) {
        return 'lg';
      } else if (width <= breakpoints.xl) {
        return 'xl';
      } else if (width <= breakpoints.xxl) {
        return 'xxl';
      } else {
        return 'xxl';
      }
    });
  }
});
