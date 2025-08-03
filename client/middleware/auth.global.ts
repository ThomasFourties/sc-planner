export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

  if (publicPages.includes(to.path)) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
