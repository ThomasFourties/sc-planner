import { defineEventHandler, createError, getCookie, readBody, getRouterParam } from 'h3';
import { handleApiError } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const taskId = getRouterParam(event, 'id');

  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification manquant",
    });
  }

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de la tâche manquant",
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    handleApiError(error, 'Erreur lors de la modification de la tâche');
  }
}); 