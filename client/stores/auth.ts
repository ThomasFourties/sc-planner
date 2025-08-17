import { defineStore } from 'pinia';

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
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
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
        const response = await $fetch<{ user: User; message: string }>('/api/auth/login', {
          method: 'POST',
          body: credentials,
          credentials: 'include',
        });

        this.user = response.user;
        this.isAuthenticated = true;
        this.initialized = true;

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
          credentials: 'include',
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
          credentials: 'include',
        });

        return { success: true, message: response.message };
      } catch (error: any) {
        let errorMessage = 'Erreur lors de la réinitialisation';

        if (error.data?.message) {
          errorMessage = Array.isArray(error.data.message) ? error.data.message.join(', ') : error.data.message;
        }

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
          credentials: 'include',
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
        await $fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error: any) {
      } finally {
        this.clearAuth();
        this.loading = false;

        if (process.client) {
          await navigateTo('/login');
        }
      }
    },

    async initializeAuth() {
      if (this.initialized && this.isHydrated) {
        return this.isAuthenticated;
      }

      if (process.client) {
        this.isHydrated = true;
      }

      try {
        const response = await $fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        let user = null;

        if (response?.data) {
          user = response.data;
        } else if (response?.id) {
          user = response;
        } else {
          console.log('❌ Structure de réponse non reconnue');
        }

        if (user && user.id) {
          this.user = user;
          this.isAuthenticated = true;
          this.initialized = true;
          return true;
        } else {
          this.clearAuth();
          return false;
        }
      } catch (error: any) {
        this.clearAuth();
        return false;
      } finally {
        this.initialized = true;
      }
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
    },

    forceReset() {
      this.user = null;
      this.isAuthenticated = false;
      this.initialized = false;
    },
  },
});
