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
        // Ignorer les erreurs de logout
      } finally {
        this.clearAuth();
        this.loading = false;

        if (process.client) {
          await navigateTo('/login');
        }
      }
    },

    async initializeAuth() {
      console.log('🔄 === DÉBUT initializeAuth ===');
      console.log('🏷️ initialized:', this.initialized);
      console.log('🏷️ isHydrated:', this.isHydrated);
      console.log('🖥️ process.client:', process.client);
      console.log('🖥️ process.server:', process.server);

      if (this.initialized && this.isHydrated) {
        console.log('✅ Déjà initialisé et hydraté - return early');
        return this.isAuthenticated;
      }

      if (process.client) {
        console.log('🌐 Côté client - marquage isHydrated = true');
        this.isHydrated = true;
      }

      try {
        console.log("🚀 Tentative d'appel /api/auth/me...");

        // ✅ SOLUTION : S'adapter au fait que $fetch appelle directement l'API NestJS
        const response = await $fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('✅ Réponse reçue:', response ? 'DATA OK' : 'PAS DE DATA');
        console.log('🔍 Type de réponse:', typeof response);
        console.log('🔍 Clés de la réponse:', response ? Object.keys(response) : 'aucune');

        // ✅ MODIFICATION : Vérifier si on a directement l'user ou s'il est dans response.data
        let user = null;

        if (response?.data) {
          // Cas où l'endpoint Nuxt fonctionne et retourne { data: user }
          console.log('📦 Structure { data: user } détectée');
          user = response.data;
        } else if (response?.id) {
          // Cas où $fetch appelle directement l'API NestJS et retourne user
          console.log('👤 Structure user directe détectée');
          user = response;
        } else {
          console.log('❌ Structure de réponse non reconnue');
        }

        if (user && user.id) {
          this.user = user;
          this.isAuthenticated = true;
          this.initialized = true;
          console.log('✅ Utilisateur défini - authenticated = true');
          console.log('👤 User ID:', user.id);
          console.log('📧 User email:', user.email);
          return true;
        } else {
          console.log("❌ Pas d'utilisateur valide dans la réponse - clearAuth");
          this.clearAuth();
          return false;
        }
      } catch (error: any) {
        console.log('❌ Erreur dans initializeAuth:', error.message || error);
        console.log('📊 Status:', error.status || error.statusCode);
        this.clearAuth();
        return false;
      } finally {
        this.initialized = true;
        console.log('🏁 initializeAuth terminé - initialized = true');
        console.log('🔄 === FIN initializeAuth ===\n');
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
