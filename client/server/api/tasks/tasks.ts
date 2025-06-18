import { defineEventHandler, getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const authorization = getHeader(event, 'authorization');

  if (!authorization) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/tasks`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Erreur serveur',
    });
  }
});
