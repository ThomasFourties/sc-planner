export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié',
    });
  }

  try {
    const user = await $fetch(`${config.public.API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: user };
  } catch (error: any) {
    if (error.status === 401 || error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide',
      });
    }

    throw createError({
      statusCode: error.status || 500,
      statusMessage: 'Erreur serveur',
    });
  }
});
