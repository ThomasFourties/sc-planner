export default defineNuxtRouteMiddleware(async (to) => {
  // ✅ AJOUT : Attendre que le processus soit côté client
  if (process.server) {
    return;
  }

  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

  if (publicPages.includes(to.path)) {
    return;
  }

  const authStore = useAuthStore();

  // ✅ MODIFICATION : S'assurer que l'initialisation se fait côté client
  if (!authStore.initialized || !authStore.isHydrated) {
    await authStore.initializeAuth();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
