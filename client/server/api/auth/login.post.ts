import { defineEventHandler, readBody, createError, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  console.log(`🔐 Tentative de login via Nuxt endpoint pour: ${body.email}`);

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

    console.log(`✅ Token reçu de NestJS (longueur: ${response.token?.length})`);

    if (!response.token) {
      throw createError({
        statusCode: 500,
        statusMessage: "Token manquant dans la réponse de l'API",
      });
    }

    // Déterminer si on est en environnement sécurisé
    const frontendUrl = process.env.FRONTEND_URL || '';
    const isSecureEnv = process.env.NODE_ENV === 'production' || frontendUrl.includes('https://') || process.env.SECURE_COOKIES === 'true';

    console.log(`🍪 Configuration cookie: secure=${isSecureEnv}, env=${process.env.NODE_ENV}`);

    // Stocker le token dans un cookie httpOnly sécurisé
    setCookie(event, 'auth-token', response.token, {
      httpOnly: true,
      secure: isSecureEnv,
      sameSite: 'lax', // Changé de 'strict' à 'lax' pour les appels inter-domaines
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });

    console.log(`🎉 Cookie auth-token défini via Nuxt pour: ${response.user.email}`);

    // Retourner la réponse sans le token (il est en cookie)
    return {
      user: response.user,
      message: response.message,
    };
  } catch (error: any) {
    console.error(`❌ Erreur login Nuxt:`, error);
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la connexion',
    });
  }
});
