import { defineStore } from 'pinia';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.isAdmin === true,
    userName: (state) => (state.user ? `${state.user.first_name} ${state.user.last_name}` : ''),
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      try {
        const response = await $fetch<{
          user: User;
          token: string;
          message: string;
        }>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        // Le token est automatiquement mis en cookie par l'API route
        this.user = response.user;
        this.isAuthenticated = true;

        return { success: true, message: response.message };
      } catch (error: any) {
        this.clearAuth();
        throw new Error(error.data?.message || 'Erreur de connexion');
      } finally {
        this.loading = false;
      }
    },

    async register(userData: { first_name: string; last_name: string; email: string; password: string; role?: string; is_admin?: boolean }) {
      this.loading = true;
      try {
        const response = await $fetch<{ message: string }>('/api/auth/register', {
          method: 'POST',
          body: userData,
        });
        return { success: true, message: response.message };
      } catch (error: any) {
        throw new Error(error.data?.message || "Erreur lors de l'inscription");
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      this.loading = true;
      try {
        const user = await $fetch<User>('/api/auth/me');
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        // Si l'erreur est 401/403, c'est normal (pas de token valide)
        // On ne log pas d'erreur pour éviter le spam console
        this.clearAuth();
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn('Erreur lors de la déconnexion côté serveur:', error);
      } finally {
        this.clearAuth();
        this.loading = false;

        if (process.client) {
          await navigateTo('/login');
        }
      }
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
    },

    async initializeAuth() {
      await this.fetchProfile();
    },
  },
});
