export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // Initialiser l'authentification côté client
  if (process.client) {
    authStore.initializeAuth();
  }
}); 