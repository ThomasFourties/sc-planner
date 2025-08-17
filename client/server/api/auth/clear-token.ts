import { defineEventHandler, getCookie, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');

  if (token) {
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
  }

  return {
    message: 'Token supprimé',
  };
});
