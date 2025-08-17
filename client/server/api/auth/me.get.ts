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
    const apiHeaders = {
      Authorization: `Bearer ${token}`,
      Cookie: getHeader(event, 'cookie') || '',
      'Content-Type': 'application/json',
      'User-Agent': 'Nuxt-SSR/1.0',
    };

    const user = await $fetch(`${config.public.API_URL}/users/me`, {
      headers: apiHeaders,
      timeout: 1000,
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
      statusMessage: error.message || 'Erreur serveur',
    });
  }
});
