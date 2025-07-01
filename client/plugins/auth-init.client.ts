export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Initialisation de l'auth uniquement si pas déjà en cours
  // Le middleware s'occupera de la vérification pour les routes protégées
  if (!authStore.loading && !authStore.user) {
    await authStore.initializeAuth();
  }
});
