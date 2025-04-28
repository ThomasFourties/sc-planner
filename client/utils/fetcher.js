const fetcher = {
  async get(endpoint) {
    try {
      const config = useRuntimeConfig();
      const apiUrl = `${config.public.API_BASE_URL}/${endpoint}`;

      if (!config.public.API_BASE_URL || !config.public.API_AUTH_TOKEN) {
        throw new Error('API URL or Auth Token is missing in the config');
      }

      const { data, error } = await useFetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.public.API_AUTH_TOKEN}`,
        },
      });

      if (error.value) {
        console.error('Erreur API côté client:', error.value);
        return null;
      }

      return data.value;
    } catch (err) {
      console.error('Erreur Fetcher GET côté client:', err);
      throw new Error(`Erreur Fetcher GET: ${err.message}`);
    }
  },

  async post(endpoint, body = {}) {
    try {
      const config = useRuntimeConfig();
      const apiUrl = `${config.public.API_BASE_URL}/${endpoint}`;

      if (!config.public.API_BASE_URL || !config.public.API_AUTH_TOKEN) {
        throw new Error('API URL or Auth Token is missing in the config');
      }

      const { data, error } = await useFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.public.API_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      if (error.value) {
        console.error('Erreur API côté client:', error.value);
        return null;
      }

      return data.value;
    } catch (err) {
      console.error('Erreur Fetcher POST côté client:', err);
      throw new Error(`Erreur Fetcher POST: ${err.message}`);
    }
  },
};

export default fetcher;
