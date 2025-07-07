import { defineEventHandler, createError, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');

  if (!token) {
    return {
      status: 404,
      message: "Token d'authentification manquant",
    };
  } else {
    return {
      status: 200,
      message: 'Token valide',
    };
  }
});
