export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    return navigateTo('/login');
  }
});
