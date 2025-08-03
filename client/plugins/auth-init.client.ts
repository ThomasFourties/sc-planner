export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  const isAuthenticated = await authStore.initializeAuth();

  console.log('isAuthenticated', isAuthenticated);

  if (isAuthenticated) {
    await navigateTo('/dashboard');
    return;
  }

  // if (!isAuthenticated) {
  //   await navigateTo('/login');
  //   return;
  // }
});
