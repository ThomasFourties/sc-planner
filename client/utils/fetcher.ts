const fetcher = {
  async get(endpoint: string) {
    try {
      const config = useRuntimeConfig();
      const apiUrl = `${config.public.API_URL}/${endpoint}`;

      const { data, error } = await useFetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error.value) {
        console.error('Erreur API côté client:', error.value);
        return null;
      }

      return data.value;
    } catch (err: any) {
      console.error('Erreur Fetcher GET côté client:', err);
      throw new Error(`Erreur Fetcher GET: ${err.message}`);
    }
  },

  async post(endpoint: string, body: any = {}) {
    try {
      const config = useRuntimeConfig();
      const apiUrl = `${config.public.API_URL}/${endpoint}`;

      const { data, error } = await useFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (error.value) {
        console.error('Erreur API côté client:', error.value);
        return null;
      }

      return data.value;
    } catch (err: any) {
      console.error('Erreur Fetcher POST côté client:', err);
      throw new Error(`Erreur Fetcher POST: ${err.message}`);
    }
  },
};

export default fetcher;
