<template>
  <main class="main-reset">
    <HeaderLog />
    <section class="section-reset form-style">
      <div class="wrapper">
        <FormLoader :status="status" :statusMessage="statusMessage" :statusSpinner="statusSpinner" />
        <div class="form-container">
          <div class="title-wp">
            <h1 class="title">Nouveau mot de passe</h1>
            <p class="subtitle">Entrez votre nouveau mot de passe</p>
          </div>

          <div class="reset-form">
            <form @submit.prevent="handleResetPassword">
              <div class="form-group">
                <label for="password">Nouveau mot de passe</label>
                <input type="password" id="password" v-model="password" required
                  placeholder="Votre nouveau mot de passe" minlength="8" />
              </div>

              <div class="form-group">
                <label for="confirm_password">Confirmer le mot de passe</label>
                <input type="password" id="confirm_password" v-model="confirm_password" required
                  placeholder="Confirmez votre mot de passe" minlength="8" />
              </div>

              <p class="msg" :class="{ active: error, red: error }">{{ error }}</p>

              <button class="btn" type="submit" :disabled="loading || !password || !confirm_password">
                <span v-if="!loading">Réinitialiser le mot de passe</span>
                <span v-else>Réinitialisation en cours...</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>


<script setup lang="ts">
const route = useRoute();

definePageMeta({
  middleware: 'guest',
  layout: false,
});

const loading = ref(false);
const error = ref('');
const success = ref(false);
const password = ref('');
const confirm_password = ref('');

const status = ref(false);
const statusMessage = ref('');
const statusSpinner = ref(true);

const token = computed(() => route.query.token as string);

onMounted(() => {
  if (!token.value) {
    error.value = 'Token de réinitialisation manquant';
    status.value = true;
    statusMessage.value = 'Token de réinitialisation manquant. Veuillez demander un nouveau lien de réinitialisation.';
  }
});

const handleResetPassword = async () => {
  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères';
    return;
  }

  if (password.value !== confirm_password.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    const authStore = useAuthStore();
    const result = await authStore.resetPassword({
      token: token.value,
      new_password: password.value,
      confirm_password: confirm_password.value
    });

    status.value = true;
    statusMessage.value = 'Réinitialisation de votre mot de passe en cours...';
    statusSpinner.value = true;

    setTimeout(() => {
      statusSpinner.value = false;
      statusMessage.value = 'Votre mot de passe a été réinitialisé avec succès !';

      setTimeout(() => {
        navigateTo('/login');
      }, 800);
    }, 1200);

  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la réinitialisation';
    status.value = true;
    statusMessage.value = err.message || 'Erreur lors de la réinitialisation du mot de passe';
    statusSpinner.value = false;
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
};
</script>