export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // S'assurer que l'authentification est initialisée
  if (!authStore.isInitialized) {
    await authStore.initializeAuth();
  }

  if (authStore.isLoggedIn) {
    return navigateTo('/dashboard');
  }
});
