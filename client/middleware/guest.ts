export default defineNuxtRouteMiddleware(async () => {
  // Ne s'exécute que côté client
  if (process.server) return;

  const { $pinia } = useNuxtApp();
  const authStore = useAuthStore($pinia);

  // Si l'état n'est pas encore initialisé, on l'initialise
  if (!authStore.user && !authStore.loading) {
    await authStore.initializeAuth();
  }

  // Si l'utilisateur est connecté, redirection vers dashboard
  if (authStore.isLoggedIn) {
    return navigateTo('/dashboard');
  }
});
