export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 🔍 DEBUG : Informations sur la requête
  console.log('🚀 === DÉBUT DEBUG /api/auth/me ===');
  console.log('🌐 URL:', getRequestURL(event).href);
  console.log('📍 Method:', getMethod(event));
  console.log('🕒 Timestamp:', new Date().toISOString());

  // 🔍 DEBUG : Headers de la requête
  const headers = getHeaders(event);
  console.log('📋 Headers reçus:', Object.keys(headers));
  console.log('🍪 Cookie header:', headers.cookie || 'ABSENT');
  console.log('🔐 Authorization header:', headers.authorization || 'ABSENT');
  console.log('👤 User-Agent:', headers['user-agent'] || 'ABSENT');
  console.log('🌍 Host:', headers.host || 'ABSENT');

  // 🔍 DEBUG : Configuration runtime
  console.log('⚙️ API_URL configurée:', config.public.API_URL);
  console.log('🏷️ NODE_ENV:', process.env.NODE_ENV);

  // 🔍 DEBUG : Cookies parsing
  const cookies = parseCookies(event);
  console.log('🍪 Cookies disponibles:', Object.keys(cookies));
  console.log('🍪 Nombre de cookies:', Object.keys(cookies).length);

  if (Object.keys(cookies).length > 0) {
    console.log('🍪 Détail des cookies:');
    Object.entries(cookies).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value ? `${value.substring(0, 20)}...` : 'empty'}`);
    });
  }

  // 🔍 DEBUG : Token spécifique
  const token = getCookie(event, 'auth-token');
  console.log('🔑 auth-token cookie:', cookies['auth-token'] ? 'PRÉSENT' : 'ABSENT');
  console.log('📋 Token récupéré via getCookie:', token ? 'OUI' : 'NON');

  if (token) {
    console.log('🔐 Token length:', token.length);
    console.log('🔐 Token preview:', token.substring(0, 20) + '...');
  }

  // 🔍 DEBUG : Vérification si on est côté client ou serveur
  console.log('🖥️ Process client:', process.client);
  console.log('🖥️ Process server:', process.server);

  if (!token) {
    console.log('❌ ERREUR: Aucun token trouvé - arrêt du traitement');
    console.log('🚀 === FIN DEBUG (ERREUR) ===\n');
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié',
    });
  }

  try {
    console.log("🔄 Tentative d'appel vers l'API NestJS...");
    console.log('🎯 URL cible:', `${config.public.API_URL}/users/me`);

    // 🔍 DEBUG : Headers que nous envoyons
    const apiHeaders = {
      Authorization: `Bearer ${token}`,
      Cookie: getHeader(event, 'cookie') || '',
      'Content-Type': 'application/json',
      'User-Agent': 'Nuxt-SSR/1.0',
    };

    console.log("📤 Headers envoyés à l'API:");
    Object.entries(apiHeaders).forEach(([key, value]) => {
      if (key === 'Authorization' && value) {
        console.log(`   - ${key}: Bearer ${value.substring(7, 27)}...`);
      } else if (key === 'Cookie' && value) {
        console.log(`   - ${key}: ${value.substring(0, 50)}...`);
      } else {
        console.log(`   - ${key}: ${value || 'empty'}`);
      }
    });

    const user = await $fetch(`${config.public.API_URL}/users/me`, {
      headers: apiHeaders,
      timeout: 5000, // 5 secondes de timeout
    });

    console.log('✅ Succès! Utilisateur récupéré:', {
      id: user?.id || "pas d'ID",
      email: user?.email || "pas d'email",
      name: user?.first_name || 'pas de nom',
    });

    console.log('🚀 === FIN DEBUG (SUCCÈS) ===\n');
    return { data: user };
  } catch (error: any) {
    console.log("❌ ERREUR lors de l'appel API:");
    console.log('📊 Error status:', error.status || error.statusCode || 'pas de status');
    console.log('📝 Error message:', error.message || 'pas de message');
    console.log('🔍 Error data:', error.data || 'pas de data');
    console.log('🛠️ Error cause:', error.cause || 'pas de cause');

    // Plus de détails sur l'erreur
    if (error.response) {
      console.log('📡 Response status:', error.response.status);
      console.log('📡 Response headers:', error.response.headers);
    }

    console.log('🚀 === FIN DEBUG (ERREUR API) ===\n');

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
