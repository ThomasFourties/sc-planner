export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas exécuter sur le serveur
  if (process.server) return;

  const authStore = useAuthStore();

  // Attendre que l'authentification soit initialisée
  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }

  // Pages qui nécessitent une authentification
  const protectedRoutes = ['/dashboard', '/mes-taches', '/planning', '/projets', '/clients'];
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route));

  // Pages pour les utilisateurs non connectés
  const guestRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isGuestRoute = guestRoutes.some(route => to.path.startsWith(route));

  // Si on essaie d'accéder à une page protégée sans être connecté
  if (isProtectedRoute && !authStore.isLoggedIn) {
    return navigateTo('/login');
  }

  // Si on essaie d'accéder à une page guest en étant connecté
  if (isGuestRoute && authStore.isLoggedIn) {
    return navigateTo('/dashboard');
  }
}); 