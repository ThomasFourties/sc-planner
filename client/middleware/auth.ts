export default defineNuxtRouteMiddleware((to: any) => {
  const logged = true;

  if (!logged && to.path !== '/register') {
    return navigateTo('/register');
  }

  if (logged && (to.path === '/' || to.path === '/register')) {
    return navigateTo('/dashboard');
  }
});
