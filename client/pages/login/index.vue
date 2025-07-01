<template>
  <main class="main-login">
    <HeaderLog />
    <section class="section-login form-style">
      <div class="wrapper">
        <div class="form-container">
          <div class="title-wp">
            <h1 class="title">Bienvenue sur SC Planner</h1>
            <div class="subtitle">Pour commencer, veuillez vous connecter</div>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Adresse email</label>
              <input v-model="email" type="email" required />
            </div>
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input id="password" v-model="password" type="password" required />
            </div>

            <p class="msg" :class="{ active: error, red: error }">{{ error }}</p>

            <button class="btn" type="submit" :disabled="loading">
              <span>Se connecter</span>
            </button>
          </form>

          <div class="right-links">
            <NuxtLink to="/forgot-password" class="link">Mot de passe oublié ?</NuxtLink>
            <p>Pas encore de compte ? <NuxtLink to="/register" class="link">Créer un compte</NuxtLink>
            </p>
          </div>

          <div class="legals">
            <p class="top">
              En créant ou en vous connectant à un compte, vous acceptez nos <NuxtLink to="/">conditions générales
              </NuxtLink> et notre <NuxtLink to="/">charte de confidentialité</NuxtLink>.
            </p>
            <p class="bottom">Tous droits réservés.<br />Copyright - SC Planner</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.right-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 15px;
  font-size: 12px;
  color: $gray;

  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>

<script setup>
import { ref } from 'vue';

definePageMeta({
  middleware: 'guest',
  layout: false,
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const authStore = useAuthStore();

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    await navigateTo('/dashboard');

  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion';
  } finally {
    loading.value = false;
  }
};
</script>
