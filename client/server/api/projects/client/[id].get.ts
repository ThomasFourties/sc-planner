import { defineEventHandler, createError, getCookie, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const clientId = getRouterParam(event, 'id');
  
  const token = getCookie(event, 'auth-token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification manquant',
    });
  }

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du client manquant',
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/projects/client/${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la récupération des projets du client',
    });
  }
}); 