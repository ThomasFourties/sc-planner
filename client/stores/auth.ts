import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    currentUser: (state) => state.user,
    isInitialized: (state) => state.initialized,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.API_BASE_URL}/auth/login`, {
          email,
          password,
        });

        const { accessToken, user } = response.data;

        this.token = accessToken;
        this.user = user;
        this.isAuthenticated = true;

        if (process.client) {
          localStorage.setItem('auth-token', accessToken);
          localStorage.setItem('auth-user', JSON.stringify(user));
        }

        this.setAuthHeader(accessToken);

        return { success: true };
      } catch (error: any) {
        this.logout();
        throw new Error(error.response?.data?.message || 'Erreur de connexion');
      } finally {
        this.loading = false;
      }
    },

    async register(userData: { first_name: string; last_name: string; email: string; password: string; confirmPassword: string; code?: string }) {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.API_BASE_URL}/auth/register`, userData);
        return { success: true, message: response.data.message };
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'inscription");
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.API_BASE_URL}/auth/forgot-password`, {
          email,
        });
        return { success: true, message: response.data.message };
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, password: string) {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.API_BASE_URL}/auth/reset-password`, {
          token,
          password,
        });
        return { success: true, message: response.data.message };
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      if (process.client) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }

      delete axios.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth-token');
        const userStr = localStorage.getItem('auth-user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
            this.setAuthHeader(token);
          } catch (error) {
            this.logout();
          }
        }
      }
      this.initialized = true;
    },

    setAuthHeader(token: string) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
  },
});
