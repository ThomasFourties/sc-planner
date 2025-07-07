import { defineEventHandler, getCookie, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');

  if (token) {
    deleteCookie(event, 'auth-token');
  }

  return {
    message: 'Token supprimé',
  };
});
