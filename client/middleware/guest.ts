export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return;

  const authStore = useAuthStore();

  if (authStore.isLoggedIn) {
    return navigateTo('/dashboard');
  }
});
