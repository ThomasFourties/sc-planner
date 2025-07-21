import { defineEventHandler, createError, getCookie, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification manquant",
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/clients`, {
      method: 'POST',
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
      statusMessage: error.data?.message || error.message || 'Erreur lors de la création du client',
    });
  }
}); 