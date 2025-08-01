export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Initialiser l'authentification au démarrage de l'app
  await authStore.initializeAuth();
});
