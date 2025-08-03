export default defineNuxtRouteMiddleware(async (to) => {
  console.log('🛡️ === MIDDLEWARE AUTH ===');
  console.log('🎯 Route vers:', to.path);
  console.log('🖥️ process.server:', process.server);
  console.log('🖥️ process.client:', process.client);

  if (process.server) {
    console.log('⏭️ Côté serveur - skip middleware');
    return;
  }

  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

  if (publicPages.includes(to.path)) {
    console.log('📖 Page publique - pas de vérification auth');
    return;
  }

  const authStore = useAuthStore();
  console.log('📊 State avant check:', {
    initialized: authStore.initialized,
    isHydrated: authStore.isHydrated,
    isAuthenticated: authStore.isAuthenticated,
  });

  if (!authStore.initialized || !authStore.isHydrated) {
    console.log('🔄 Initialisation nécessaire...');
    await authStore.initializeAuth();
  }

  console.log('📊 State après initializeAuth:', {
    initialized: authStore.initialized,
    isAuthenticated: authStore.isAuthenticated,
  });

  if (!authStore.isAuthenticated) {
    console.log('🚪 Pas authentifié - redirection vers /login');
    return navigateTo('/login');
  }

  console.log('✅ Authentifié - accès autorisé');
  console.log('🛡️ === FIN MIDDLEWARE ===\n');
});
