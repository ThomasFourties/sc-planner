export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const route = useRoute();

  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicPage = publicPages.includes(route.path);

  const isAuthenticated = await authStore.initializeAuth();

  if (isAuthenticated && isPublicPage) {
    await navigateTo('/dashboard');
    return;
  }

  if (!isAuthenticated && !isPublicPage) {
    await navigateTo('/login');
    return;
  }
});
