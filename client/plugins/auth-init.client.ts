export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const route = useRoute();

  // ✅ MODIFICATION : Initialiser seulement côté client
  if (process.client) {
    authStore.isHydrated = true;

    const isAuthenticated = await authStore.initializeAuth();

    console.log('isAuthenticated', isAuthenticated);

    // ✅ MODIFICATION : Gérer la navigation selon l'état et la route actuelle
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

    if (isAuthenticated && publicPages.includes(route.path)) {
      await navigateTo('/dashboard');
    } else if (!isAuthenticated && !publicPages.includes(route.path)) {
      await navigateTo('/login');
    }
  }
});
