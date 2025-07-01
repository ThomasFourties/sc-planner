import { defineEventHandler, readBody, createError, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  
  try {
    const response = await $fetch<{
      user: any;
      token: string;
      message: string;
    }>(`${config.public.API_URL}/auth/login`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Stocker le token dans un cookie httpOnly sécurisé
    setCookie(event, 'auth-token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });

    // Retourner la réponse sans le token (il est en cookie)
    return {
      user: response.user,
      message: response.message,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la connexion',
    });
  }
}); 