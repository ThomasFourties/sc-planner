import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const isSecureEnv = process.env.NODE_ENV === 'production' || 
                     frontendUrl.includes('https://') ||
                     process.env.SECURE_COOKIES === 'true';

  deleteCookie(event, 'auth-token', {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: 'strict',
    path: '/',
  });

  return {
    message: 'Déconnexion réussie',
  };
}); 