<template>
  <main class="main-reset">
    <HeaderLog />
    <section class="section-reset form-style">
      <div class="wrapper">
        <div class="form-container">
          <div class="title-wp">
            <h1 class="title">Mot de passe oublié ?</h1>
            <p class="subtitle">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          <div class="reset-form">
            <form @submit.prevent="handleForgotPassword">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required />
              </div>

              <p class="msg" :class="{ active: error, red: error }">{{ error }}</p>
              <p class="msg" :class="{ active: success, green: success }">{{ message }}</p>

              <button class="btn" type="submit" :disabled="loading">
                <span v-if="!loading">Envoyer</span>
                <span v-else>Envoi...</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<!-- 
<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.reset-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  .title {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    color: $lightGray;
    margin-bottom: 30px;
  }
}

.reset-form {
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;

    label {
      font-size: 14px;
      text-align: left;
    }

    input {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
  }

  .btn {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style> -->

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
});

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const message = ref('');

const handleForgotPassword = async () => {
  if (!email.value) {
    error.value = 'Entrez un email';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = false;

  try {
    const authStore = useAuthStore();
    const result = await authStore.forgotPassword(email.value);

    success.value = true;
    message.value = result.message;
    console.log('✅ Email envoyé !', result);
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'envoi';
    console.error('❌ Erreur:', err);
  } finally {
    loading.value = false;
  }
};
</script>