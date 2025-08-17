export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return;
  }

  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

  if (publicPages.includes(to.path)) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.initialized || !authStore.isHydrated) {
    await authStore.initializeAuth();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
