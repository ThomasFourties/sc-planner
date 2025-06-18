import { defineEventHandler, getHeader, createError } from 'h3';

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
    const response = await $fetch(`${config.public.API_URL}/tasks/assigned-to-me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
    return response;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des tâches assignées:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Erreur serveur',
    });
  }
});
