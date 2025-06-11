export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Initialiser l'authentification depuis le localStorage
  await authStore.initializeAuth();
}); 