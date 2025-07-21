import { defineEventHandler, createError, getCookie, readBody, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const userId = getRouterParam(event, 'id');
  const body = await readBody(event);

  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification manquant",
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de l\'utilisateur manquant',
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/users/${userId}/assign-client`, {
      method: 'PATCH',
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de l\'assignation de l\'utilisateur au client',
    });
  }
}); 