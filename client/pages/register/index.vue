<template>
  <main class="main-register">
    <HeaderLog />
    <section class="section-register form-style">
      <div class="wrapper">
        <div class="form-container">
          <FormLoader :status="status" :statusMessage="statusMessage" :statusSpinner="statusSpinner" />
          <div class="title-wp">
            <h1 class="title">Création d'un compte</h1>
          </div>

          <form @submit.prevent="handleRegister" class="register-form">
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
              <input id="password" v-model="form.password" type="password" required minlength="8" />
            </div>

            <div class="form-group">
              <label for="confirm_password">Répetez le mot de passe</label>
              <input id="confirm_password" v-model="form.confirm_password" type="password" required minlength="8" />
            </div>

            <!-- <div class="form-group">
              <label for="code" class="label-info">Code d'accès (optionnel)
                <button class="tooltip-button" @click="handleTooltipToggle">
                  <Info class="info-icon" />
                </button>
                <p class="toolbox" :class="{ active: showTooltip }" v-if="showTooltip">{{ tooltipMessage }}</p>
              </label>

              <input id="code" v-model="form.code" name="code" type="text" maxlength="5" :disabled="loading"
                :class="{ 'error': codeStatus === 'invalid', 'success': codeStatus === 'valid' }"
                @input="handleCodeInput" />
            </div>

            <p class="code-msg" :class="{ 'error': codeStatus === 'invalid', 'success': codeStatus === 'valid' }">
              {{ codeMessage }}
            </p> -->

            <p class="msg" :class="{ active: error, red: error }">{{ error }}</p>
            <p class="msg" :class="{ active: success, green: success }">{{ successMessage }}</p>

            <button class="btn" type="submit" :disabled="loading">
              <span>Créer un compte</span>
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

.tooltip-button {
  background: none;
  border: none;
  color: $gray;
  width: fit-content;
  height: fit-content;
  padding: 0;
  cursor: pointer;

  &:hover {
    svg {
      transform: translate(0)
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
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
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
// import Info from '../../assets/icons/info.svg';


definePageMeta({
  layout: false,
});

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  code: '',
});

const loading = ref(false);
const error = ref('');
const success = ref(false);
const successMessage = ref('');
// const showTooltip = ref(false);
// const codeStatus = ref('');
// const codeMessage = ref('');
const statusSpinner = ref(true);
// const tooltipMessage = ref('Si aucun code ne vous a été fourni ne remplissez pas ce champ');

const status = ref(false);
const statusMessage = ref('');

// const getCodeRole = (code: string) => {
//   const codeRoles: { [key: string]: { role: string; is_admin: boolean } } = {
//     'XAYOP': { role: 'SALARIE', is_admin: false },
//     'PUKXE': { role: 'FREELANCE', is_admin: false },
//     'ADMIN': { role: 'CHEF_DE_PROJET', is_admin: true },
//   };
//   return codeRoles[code] || null;
// };

// const handleTooltipToggle = () => {
//   showTooltip.value = !showTooltip.value;
// };

// const handleCodeInput = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   const value = target.value.toUpperCase();

//   codeStatus.value = '';
//   codeMessage.value = '';

//   form.code = value;
//   target.value = value;

//   if (value.length === 5) {
//     const roleInfo = getCodeRole(value);
//     if (roleInfo) {
//       codeStatus.value = 'valid';
//       codeMessage.value = 'Code valide';
//     } else {
//       codeStatus.value = 'invalid';
//       codeMessage.value = 'Code incorrect';
//     }
//   }
// };

const handleRegister = async () => {
  error.value = '';

  if (form.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères';
    return false;
  }

  if (form.password !== form.confirm_password) {
    error.value = 'Les mots de passe ne correspondent pas';
    return false;
  }

  loading.value = true;

  try {
    const authStore = useAuthStore();

    const registrationData = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
    };

    const response = await authStore.register(registrationData);

    status.value = true;
    statusMessage.value = 'Création de votre compte en cours...';

    setTimeout(() => {
      statusSpinner.value = false;
      statusMessage.value = 'Votre compte a été créé avec succès !';

      setTimeout(() => {
        navigateTo('/login');
      }, 800);
    }, 1200);

  } catch (err: any) {
    console.log(err);
    error.value = err.message || 'Une erreur est survenue lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};
</script>
