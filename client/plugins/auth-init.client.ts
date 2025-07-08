export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Vérifier d'abord s'il y a un token avant d'essayer de récupérer le profil
  const hasToken = await authStore.checkToken();
  
  if (hasToken) {
    // Récupérer les informations utilisateur seulement si un token est présent
    await authStore.fetchProfile();
  }
});
