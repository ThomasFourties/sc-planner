import { defineStore } from 'pinia';
import { getCookie } from 'h3';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_admin: boolean;
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
    isAdmin: (state) => state.user?.is_admin === true,
    userName: (state) => state.user?.first_name,
    userEmail: (state) => state.user?.email,
    userLastName: (state) => state.user?.last_name,
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      try {
        const response = await $fetch<{ user: User; token: string; message: string }>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        this.user = response.user;
        this.isAuthenticated = true;

        return { success: true, message: response.message };
      } catch (error: any) {
        let errorMessage = 'Erreur lors de la connexion';

        if (error.statusMessage) {
          errorMessage = error.statusMessage;
        } else if (error.data?.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message.join(', ');
          } else {
            errorMessage = error.data.message;
          }
        }

        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async register(userData: { first_name: string; last_name: string; email: string; password: string; confirm_password: string; role?: string; is_admin?: boolean }) {
      this.loading = true;
      try {
        const serverData = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirm_password,
          role: userData.role,
          is_admin: userData.is_admin,
        };

        const response = await $fetch<{ message: string }>('/api/auth/register', {
          method: 'POST',
          body: serverData,
        });
        return { success: true, message: response.message };
      } catch (error: any) {
        let errorMessage = "Erreur lors de l'inscription";

        if (error.data?.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message.join(', ');
          } else {
            errorMessage = error.data.message;
          }
        } else if (typeof error.statusMessage === 'string') {
          errorMessage = error.statusMessage;
        }

        console.error("Erreur d'inscription:", error); // utile pour debug
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async resetPassword({ token, new_password, confirm_password }: { token: string; new_password: string; confirm_password: string }) {
      this.loading = true;
      try {
        const response = await $fetch<{ message: string }>(`/api/auth/reset-password?token=${token}`, {
          method: 'POST',
          body: {
            new_password,
            confirm_password,
          },
        });

        return { success: true, message: response.message };
      } catch (error: any) {
        let errorMessage = 'Erreur lors de la réinitialisation';

        if (error.data?.message) {
          errorMessage = Array.isArray(error.data.message) ? error.data.message.join(', ') : error.data.message;
        }

        console.error('Reset error:', error);
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      try {
        const response = await $fetch<{ message: string }>('/api/auth/forgot-password', {
          method: 'POST',
          body: { email },
        });

        return { success: true, message: response.message };
      } catch (error: any) {
        let errorMessage = "Erreur lors de l'envoi";

        if (error.data?.message) {
          errorMessage = error.data.message;
        }

        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
      } catch (error: any) {
        const errorMessage = error.statusMessage || error.data?.message || error.message || 'Erreur lors de la déconnexion';
        throw new Error(errorMessage);
      } finally {
        this.clearAuth();
        this.loading = false;

        if (process.client) {
          await navigateTo('/login');
        }
      }
    },

    async checkToken() {
      const response = await $fetch('/api/auth/check-token');

      if (response.status === 404) {
        this.clearAuth();
        return false;
      } else {
        this.isAuthenticated = true;
        return true;
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
        this.clearAuth();
        return false;
      } finally {
        this.loading = false;
      }
    },

    async clearToken() {
      await $fetch('/api/auth/clear-token');
    },

    clearAuth() {
      this.clearToken();
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
