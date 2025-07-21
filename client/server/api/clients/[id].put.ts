import { defineEventHandler, createError, getCookie, getRouterParam, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');
  
  const token = getCookie(event, 'auth-token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification manquant',
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du client manquant',
    });
  }

  try {
    const body = await readBody(event);
    
    const response = await $fetch(`${config.public.API_URL}/clients/${id}`, {
      method: 'PATCH', // Le backend utilise PATCH
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la modification du client',
    });
  }
}); 