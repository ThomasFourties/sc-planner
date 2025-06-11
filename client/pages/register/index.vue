<template>
  <main class="main-login">
    <HeaderLog />
    <section class="section-login">
      <div class="wrapper">
        <div class="login-container">
          <h1 class="title">Création d'un compte</h1>

          <form @submit.prevent="handleRegister" class="login-form">
            <div class="form-row">
              <div class="form-group">
                <label for="email">Prénom</label>
                <input id="firstName" v-model="form.firstName" type="text" required />
              </div>

              <div class="form-group">
                <label for="email">Nom</label>
                <input id="lastName" v-model="form.lastName" type="text" required />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Adresse email</label>
              <input id="email" v-model="form.email" type="email" required />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input id="password" v-model="form.password" type="password" required />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Répetez le mot de passe</label>
              <input id="confirmPassword" v-model="form.confirmPassword" type="password" required />
            </div>

            <div class="form-group">
              <label for="code" class="label-info">Code d'accès (optionnel)
                <info class="info-icon" />
                <p class="toolbox" :class="{ active: showTooltip }">Si aucun code ne vous a été fourni ne remplissez pas
                  ce champ</p>
              </label>
              <input id="code" v-model="form.code" name="code" type="text" maxlength="5" :disabled="loading"
                @input="formatCode" />
            </div>

            <p class="msg" :class="{ active: error, red: error }">{{ error }}</p>
            <p class="msg" :class="{ active: success, green: success }">{{ successMessage }}</p>

            <button class="btn" type="submit" :disabled="loading">
              <span>Continuer</span>
            </button>

            <div class="legals">
              <p class="top">
                En créant ou en vous connectant à un compte, vous acceptez nos <NuxtLink to="/">conditions générales
                </NuxtLink> et notre <NuxtLink to="/">charte de confidentialité</NuxtLink>.
              </p>
              <p class="bottom">Tous droits réservés.<br />Copyright - SC Planner</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Modal de confirmation du rôle -->
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmation du rôle</h3>
        <p>Le code que vous avez entré vous donne le rôle <strong>{{ detectedRole }}</strong>.</p>
        <p>Cela est-il correct ?</p>
        <div class="modal-buttons">
          <button @click="confirmRole(true)" class="btn btn-primary">Oui</button>
          <button @click="confirmRole(false)" class="btn btn-secondary">Non</button>
        </div>
      </div>
    </div>
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

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  .form-group {
    flex: 1;
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
    margin-bottom: 50px;
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

  .link {
    &:hover {
      text-decoration: underline;
    }
  }
}

.legals {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  gap: 10px;
  margin: auto;
  font-size: 12px;
  color: $lightGray;

  a {
    color: inherit;
    text-decoration: underline;
  }
}

.label-info {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5px;
  font-size: 12px;
  color: $gray;

  .toolbox {
    position: absolute;
    display: block;
    right: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    z-index: 10;
    visibility: hidden;
    opacity: 0;
    // width: 100px;
    background: $white;
    padding: 10px;
    top: -40px;
    transition: opacity 0.2s ease, visibility 0.2s ease;

    &.active {
      visibility: visible;
      opacity: 1;
    }
  }

  .info-icon {
    width: 12px;
    height: 12px;
    fill: $gray;
    cursor: pointer;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: $white;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  text-align: center;

  h3 {
    margin-bottom: 20px;
    font-size: 20px;
    color: $black;
  }

  p {
    margin-bottom: 15px;
    line-height: 1.5;
    color: $gray;

    strong {
      color: $black;
      font-weight: 600;
    }
  }
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    min-width: 80px;
    transition: all 0.2s ease;

    &.btn-primary {
      background: $green;
      color: $white;

      &:hover {
        background: darken($green, 10%);
      }
    }

    &.btn-secondary {
      background: $lightGray;
      color: $black;

      &:hover {
        background: darken($lightGray, 10%);
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import info from './assets/icons/info.svg';

definePageMeta({
  middleware: 'guest',
  layout: false,
});

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
});

const loading = ref(false);
const error = ref('');
const success = ref(false);
const successMessage = ref('');
const showTooltip = ref(false);
const showRoleConfirmation = ref(false);
const detectedRole = ref('');

// Fonction pour détecter le rôle associé au code
const getCodeRole = (code: string) => {
  const codeRoles: { [key: string]: string } = {
    'XAYOP': 'Salarié',
    'PUKXE': 'Freelance',
  };
  return codeRoles[code] || '';
};

const handleTooltipToggle = () => {
  showTooltip.value = !showTooltip.value;
};

const formatCode = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.toUpperCase();
  if (value === 'XAYOP' || value === 'PUKXE' || value === '') {
    target.value = value;
    form.code = value;
  } else {
    target.value = form.code;
  }
};

const validateForm = () => {
  if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
    error.value = 'Veuillez remplir tous les champs';
    return false;
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas';
    return false;
  }

  if (form.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères';
    return false;
  }

  const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  if (!passwordRegex.test(form.password)) {
    error.value = 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre';
    return false;
  }

  return true;
};

const confirmRole = (confirm: boolean) => {
  if (confirm) {
    proceedWithRegistration();
  } else {
    form.code = '';
    showRoleConfirmation.value = false;
    detectedRole.value = '';
  }
};

const proceedWithRegistration = async () => {
  showRoleConfirmation.value = false;
  loading.value = true;

  try {
    const authStore = useAuthStore();
    const result = await authStore.register(form);

    success.value = true;
    successMessage.value = result.message;
    console.log(result.message);

    setTimeout(() => {
      navigateTo('/login');
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Erreur lors de l'inscription";
    console.log(error.value);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  error.value = '';

  if (!validateForm()) {
    return;
  }

  if (form.code) {
    detectedRole.value = getCodeRole(form.code);
    if (detectedRole.value) {
      showRoleConfirmation.value = true;
      return;
    }
  }

  proceedWithRegistration();
};
</script>
