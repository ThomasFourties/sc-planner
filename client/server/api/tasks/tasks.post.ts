import { defineEventHandler, getHeader, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const authorization = getHeader(event, 'authorization');

  if (!authorization) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    });
  }

  const body = await readBody(event);

  try {
    const response = await $fetch(`${config.public.API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: body,
    });
    return response;
  } catch (error: any) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Erreur serveur',
    });
  }
});
