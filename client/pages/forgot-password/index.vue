<template>
  <main class="main-reset">
    <HeaderLog />
    <section class="section-reset">
      <div class="wrapper">
        <div class="reset-container">
          <h1 class="title">Mot de passe oublié</h1>
          <p class="subtitle">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>

          <div class="reset-form">
            <form @submit.prevent="handleForgotPassword">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" />
              </div>
              <button class="btn" type="submit">
                <span>Envoyer le lien de réinitialisation</span>
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
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.reset-container {
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

.reset-form {
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

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
});

const toast = useToast();

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const successMessage = ref('');

const handleForgotPassword = async () => {
  if (!email.value) {
    error.value = 'Veuillez entrer votre adresse email';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const authStore = useAuthStore();
    const result = await authStore.forgotPassword(email.value);

    success.value = true;
    successMessage.value = result.message;
    toast.showSuccess(result.message);
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'envoi';
    toast.showError(error.value);
  } finally {
    loading.value = false;
  }
};
</script>