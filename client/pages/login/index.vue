<template>
  <main class="main-login">
    <HeaderLog />
    <section class="section-login">
      <div class="wrapper">
        <div class="login-container">
          <h1 class="title">Bienvenue sur SC Planner</h1>
          <div class="subtitle">Pour commencer, veuillez vous connecter</div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Adresse email</label>
              <input v-model="email" type="email" required />
            </div>
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input id="password" v-model="password" type="password" required />
            </div>

            <p class="msg" :class="{ active: error, red: error }">{{ error || 'Le mot de passe ou l\'email ne correspond à aucun compte' }}</p>

            <button class="btn" type="submit" :disabled="loading">
              <span>Continuer</span>
            </button>
          </form>

          <div class="right-links">
            <NuxtLink to="/forgot-password" class="link">Mot de passe oublié ?</NuxtLink>
            <p>Pas encore de compte ? <NuxtLink to="/register" class="link">Créer un compte</NuxtLink></p>
          </div>

          <div class="legals">
            <p class="top">
              En créant ou en vous connectant à un compte, vous acceptez nos <NuxtLink to="/">conditions générales</NuxtLink> et notre <NuxtLink to="/">charte de confidentialité</NuxtLink>.
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

.login-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  text-align: center;

  .title {
    font-weight: 400;
    font-size: 38px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 18px;
    color: $lightGray;
    margin-bottom: 50px;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .msg {
    color: $red;
    opacity: 0;
    visibility: hidden;
    font-size: 14px;
    text-align: center;

    &.active {
      opacity: 1;
      visibility: visible;
    }

    &.red {
      color: $red;
    }

    &.green {
      color: $green;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    gap: 5px;

    label {
      font-size: 12px;
      color: $gray;
      font-weight: 500;
    }

    input {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid $gray;
      font-size: 14px;
      width: 100%;
      margin-bottom: 15px;
      line-height: 1.3;

      &:focus {
        outline: none;
      }
    }
  }

  .btn {
    width: 100%;
    margin-top: 15px;
  }

  .password-info {
    font-size: 12px;
    color: $gray;
  }
}

.right-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 15px;
  font-size: 12px;
  color: $gray;
  margin-bottom: 50px;

  a {
    color: inherit;
    text-decoration: underline;
  }
}

.legals {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  gap: 10px;
  margin: 0 auto;
  font-size: 12px;
  color: $lightGray;

  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: 'guest',
  layout: false,
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const authStore = useAuthStore();
    await authStore.login(email.value, password.value);
    await navigateTo('/dashboard');
  } catch (err) {
    error.value = err.message || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
};
</script>
