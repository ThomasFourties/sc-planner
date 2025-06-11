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
                <input id="first_name" v-model="form.first_name" type="text" required />
              </div>

              <div class="form-group">
                <label for="email">Nom</label>
                <input id="last_name" v-model="form.last_name" type="text" required />
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
                :class="{ 'error': codeStatus === 'invalid', 'success': codeStatus === 'valid' }"
                @input="handleCodeInput" />
            </div>

            <p class="code-msg" :class="{ 'error': codeStatus === 'invalid', 'success': codeStatus === 'valid' }">
              {{ codeMessage }}
            </p>

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
    width: fit-content;
    color: $red;
    opacity: 0;
    visibility: hidden;
    font-size: 12px;
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
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
      }

      &.error {
        border-color: $red;
        margin-bottom: 5px;
      }

      &.success {
        border-color: $green;
        margin-bottom: 5px;
      }
    }


  }

  .code-msg {
    font-size: 12px;
    width: fit-content;
    margin-bottom: 5px;

    &.error {
      color: $red;
    }

    &.success {
      color: $green;
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
  first_name: '',
  last_name: '',
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
const codeStatus = ref('');
const codeMessage = ref('');

const getCodeRole = (code: string) => {
  const codeRoles: { [key: string]: { role: string; isAdmin: boolean } } = {
    'XAYOP': { role: 'Salarié', isAdmin: false },
    'PUKXE': { role: 'Freelance', isAdmin: false },
    'ADMIN': { role: 'Chef de projet', isAdmin: true },
  };
  return codeRoles[code] || null;
};

const handleTooltipToggle = () => {
  showTooltip.value = !showTooltip.value;
};

const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.toUpperCase();

  codeStatus.value = '';
  codeMessage.value = '';

  form.code = value;
  target.value = value;

  if (value.length === 5) {
    const roleInfo = getCodeRole(value);
    if (roleInfo) {
      codeStatus.value = 'valid';
      codeMessage.value = 'Code valide';
    } else {
      codeStatus.value = 'invalid';
      codeMessage.value = 'Code incorrect';
    }
  }
};

const validateForm = () => {
  if (!form.first_name || !form.last_name || !form.email || !form.password || !form.confirmPassword) {
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

const handleRegister = async () => {
  error.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const authStore = useAuthStore();

    const registrationData: any = { ...form };
    if (form.code) {
      const roleInfo = getCodeRole(form.code);
      if (roleInfo) {
        registrationData.isAdmin = roleInfo.isAdmin;
        registrationData.role = roleInfo.role;
      }
    }

    const result = await authStore.register(registrationData);

    success.value = true;
    successMessage.value = result.message;

    setTimeout(() => {
      navigateTo('/login');
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Erreur lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
