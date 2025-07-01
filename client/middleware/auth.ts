export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const { $pinia } = useNuxtApp();
  const authStore = useAuthStore($pinia);

  if (!authStore.user && !authStore.loading) {
    await authStore.initializeAuth();
  }

  if (!authStore.isLoggedIn) {
    return navigateTo('/login');
  }
});
