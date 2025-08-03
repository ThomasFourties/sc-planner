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

// 4. COMPOSABLE USEAUTH NETTOYÉ (client/composables/useAuth.ts)
export const useAuth = () => {
  const authStore = useAuthStore();

  const loginAndRedirect = async (credentials: { email: string; password: string }) => {
    try {
      const result = await authStore.login(credentials);
      if (result.success) {
        await navigateTo('/dashboard');
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const registerAndRedirect = async (userData: any) => {
    try {
      const result = await authStore.register(userData);
      if (result.success) {
        await navigateTo('/login');
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logoutAndRedirect = async () => {
    await authStore.logout();
    authStore.forceReset();
  };

  return {
    ...authStore,
    loginAndRedirect,
    registerAndRedirect,
    logoutAndRedirect,
  };
};
