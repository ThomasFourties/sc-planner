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
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required
                  placeholder="Confirmez votre mot de passe" minlength="8" />
              </div>

              <!-- <p class="msg" :class="{ active: error, red: error }">{{ error }}</p> -->

              <button class="btn" type="submit" :disabled="loading || !password || !confirmPassword">
                <span v-if="!loading">Réinitialiser le mot de passe</span>
                <span v-else>Réinitialisation en cours...</span>
              </button>
            </form>

            <!-- Message de succès -->
            <!-- <div v-if="success" class="success-message">
              <div class="success-icon">✅</div>
              <h2>Mot de passe réinitialisé !</h2>
              <p>{{ successMessage }}</p>
              <p class="small-text">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <NuxtLink to="/login" class="btn">
                Se connecter
              </NuxtLink>
            </div> -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

// .reset-container {
//   display: flex;
//   flex-direction: column;
//   align-content: center;
//   justify-content: center;
//   width: 100%;
//   max-width: 550px;
//   margin: 0 auto;
//   padding: 20px;
//   text-align: center;

//   .title {
//     font-size: 32px;
//     margin-bottom: 10px;
//   }

//   .subtitle {
//     font-size: 16px;
//     color: $lightGray;
//     margin-bottom: 30px;
//   }
// }

// .reset-form {
//   .form-group {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     margin-bottom: 20px;

//     label {
//       font-size: 14px;
//       text-align: left;
//     }

//     input {
//       padding: 12px;
//       border: 1px solid #ccc;
//       border-radius: 4px;
//       font-size: 16px;
//     }
//   }

//   .btn {
//     width: 100%;
//     padding: 12px;
//     background-color: #007bff;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     font-size: 16px;
//     cursor: pointer;

//     &:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }
//   }
// }

// .success-message {
//   text-align: center;
//   padding: 40px 20px;

//   .success-icon {
//     font-size: 48px;
//     margin-bottom: 20px;
//   }

//   h2 {
//     color: $green;
//     margin-bottom: 15px;
//     font-size: 24px;
//   }

//   p {
//     margin-bottom: 10px;
//     color: $gray;
//   }

//   .small-text {
//     font-size: 14px;
//     color: $lightGray;
//     margin-bottom: 30px;
//   }

//   .btn {
//     text-decoration: none;
//     display: inline-block;
//   }
// }</style>

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
const confirmPassword = ref('');

const status = ref(false);
const statusMessage = ref('');
const statusSpinner = ref(false);

const fakeStatus = () => {
  status.value = true;
  statusMessage.value = 'En cours de réinitialisation de votre mot de passe...';
  statusSpinner.value = true;

  setTimeout(() => {
    statusSpinner.value = false;
    statusMessage.value = 'Mot de passe réinitialisé avec succès';

    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  }, 1200);
}

fakeStatus();

const token = computed(() => route.query.token as string);

onMounted(() => {
  if (!token.value) {
    error.value = 'Token de réinitialisation manquant';
  }
});

const handleResetPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    error.value = 'Entrez les deux mots de passe';
    return;
  }

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères';
    return;
  }

  const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  if (!passwordRegex.test(password.value)) {
    error.value = 'Le mot de passe doit contenir au moins une majuscule et un chiffre';
    return;
  }

  // loading.value = true;
  // error.value = '';
  // success.value = false;

  statusMessage.value = 'En cours de réinitialisation de votre mot de passe...';
  statusSpinner.value = true;

  try {
    const authStore = useAuthStore();
    const result = await authStore.resetPassword(token.value, password.value, confirmPassword.value);

    success.value = true;
    statusMessage.value = 'Mot de passe réinitialisé avec succès';
  } catch (err: any) {
    // error.value = err.message || 'Erreur lors de la réinitialisation';
    // console.error('Erreur:', err);
    // statusMessage.value = 'Erreur lors de la réinitialisation';
  } finally {
    statusSpinner.value = false;
  }
};
</script>