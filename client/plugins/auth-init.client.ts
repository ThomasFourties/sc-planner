export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  const hasToken = await authStore.checkToken();

  if (hasToken) {
    await authStore.fetchProfile();
  }
});
