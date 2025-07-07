export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Récupérer les informations utilisateur si un token est présent
  await authStore.fetchProfile();
});
