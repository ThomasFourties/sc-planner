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

              <button class="btn" type="submit" :disabled="loading || cooldown > 0">
                <span v-if="!loading && cooldown === 0">Envoyer</span>
                <span v-else-if="loading">Envoi...</span>
                <span v-else>Renvoyer dans {{ cooldown }}s</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const message = ref('');
const cooldown = ref(0);
const cooldownInterval = ref<NodeJS.Timeout | null>(null);

onMounted(() => {
  if (process.client) {
    const savedCooldown = localStorage.getItem('forgot-password-cooldown');
    if (savedCooldown) {
      const expirationTime = parseInt(savedCooldown);
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((expirationTime - now) / 1000));

      if (remainingTime > 0) {
        cooldown.value = remainingTime;
        startCooldownTimer();
      }
    }
  }
});

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
    error.value = '';

    startCooldown();
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'envoi';
    success.value = false;
    message.value = '';
  } finally {
    loading.value = false;
  }
};

const startCooldown = () => {
  cooldown.value = 60;
  if (process.client) {
    const expirationTime = Date.now() + (60 * 1000);
    localStorage.setItem('forgot-password-cooldown', expirationTime.toString());
  }
  startCooldownTimer();
};

const startCooldownTimer = () => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }

  cooldownInterval.value = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      if (cooldownInterval.value) {
        clearInterval(cooldownInterval.value);
      }
      cooldownInterval.value = null;
      if (process.client) {
        localStorage.removeItem('forgot-password-cooldown');
      }
    }
  }, 1000);
};

onUnmounted(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }
});
</script>