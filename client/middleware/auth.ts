export default defineNuxtRouteMiddleware((to) => {
  const logged = true; // À remplacer par votre logique d'authentification réelle

  // Si l'utilisateur n'est pas connecté et n'est pas sur la page register
  if (!logged && to.path !== '/register') {
    return navigateTo('/register');
  }

  // Si l'utilisateur est connecté et est sur la page d'accueil ou register
  if (logged && (to.path === '/' || to.path === '/register')) {
    return navigateTo('/dashboard');
  }
}); 