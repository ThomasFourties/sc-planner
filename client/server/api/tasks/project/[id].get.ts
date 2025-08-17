import { defineEventHandler, createError, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  
  const token = getCookie(event, 'auth-token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification manquant",
    });
  }

  const projectId = getRouterParam(event, 'id');
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID du projet manquant",
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la récupération des tâches du projet',
    });
  }
}); 