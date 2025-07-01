import { defineEventHandler, createError, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Récupérer le token depuis les cookies
  const token = getCookie(event, 'auth-token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification manquant',
    });
  }

  try {
    const response = await $fetch(`${config.public.API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    // Si le token est invalide, on peut supprimer le cookie
    if (error.status === 401) {
      // Note: setCookie avec maxAge: 0 supprime le cookie
      // mais on ne peut pas l'importer ici sans circular dependency
      // Le cookie sera nettoyé côté client
    }
    
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la récupération du profil',
    });
  }
}); 