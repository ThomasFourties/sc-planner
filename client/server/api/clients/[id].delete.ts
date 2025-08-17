import { defineEventHandler, createError, getCookie, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const clientID = getRouterParam(event, 'id');

  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification manquant",
    });
  }

  try {
    await $fetch(`${config.public.API_URL}/clients/${clientID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return { message: 'Client supprimé avec succès' };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la suppression du client',
    });
  }
});
