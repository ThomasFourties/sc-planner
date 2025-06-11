<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="user-info">
        <span class="user-role">{{ getRoleDisplay(currentUser?.role) }}</span>
      </div>
      <button @click="handleLogout" class="logout-btn">
        Déconnexion
      </button>
    </div>
    <div class="txt-wp">
      <p class="surtitle">{{ formattedDate }}</p>
      <h1 class="h1">Bonjour {{ currentUser?.first_name || 'Utilisateur' }} !</h1>
      <p class="soustitle">Aujourd'hui, <span>5 tâches</span> vous sont assignés dans 2 projets différents</p>
    </div>
    <div class="dashboard-content">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

const authStore = useAuthStore();

onMounted(() => {
  const dashboardLink = document.querySelector('.dashboard.nav-link');

  if (dashboardLink) {
    dashboardLink.classList.add('active');
  }
});

const date = new Date();
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formattedDate = date.toLocaleDateString('fr-FR', options);

// Récupérer les données de l'utilisateur connecté
const currentUser = computed(() => authStore.currentUser);

// Méthode pour afficher le rôle en français
const getRoleDisplay = (role) => {
  switch (role) {
    case 'SALARIE':
      return '👔 Salarié';
    case 'FREELANCE':
      return '💼 Freelance';
    case 'CHEF_DE_PROJET':
      return '👨‍💼 Chef de projet';
    case 'CLIENT':
    default:
      return '👤 Client';
  }
};

// Méthode de déconnexion
const handleLogout = async () => {
  authStore.logout();
  await navigateTo('/login');
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;
@use '../../assets/scss/utils/mixins' as *;

.dashboard {
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;

    .user-info {
      .user-role {
        background-color: $lightGray;
        color: $gray;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .logout-btn {
      background-color: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background-color: #dc2626;
      }
    }
  }

  .txt-wp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 120px;
  }

  .surtitle {
    text-transform: capitalize;
    color: $gray;
    font-weight: 400;
    font-size: 15px;
  }

  h1,
  .h1 {
    font-weight: 700;
    margin-bottom: 24px;
  }

  .soustitle {
    font-size: 15px;
    color: $black;
    font-weight: 400;

    span {
      text-decoration: underline;
    }
  }

  .dashboard-content {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 80%;
    margin: 0 auto;
    height: 300px;

    @include down(md) {
      width: 100%;
      flex-direction: column;
      gap: 10px;
    }

    .left,
    .right {
      background-color: $white;
      height: 100%;
      border: 1px solid $gray;
      border-radius: 4px;
    }

    .left {
      width: 33%;

      @include down(md) {
        width: 100%;
      }
    }

    .right {
      width: 66%;

      @include down(md) {
        width: 100%;
      }
    }
  }
}
</style>
