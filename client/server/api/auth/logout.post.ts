import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // Supprimer le cookie d'authentification
  deleteCookie(event, 'auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return {
    message: 'Déconnexion réussie',
  };
}); 