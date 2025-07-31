import { createPinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp: any) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
});
