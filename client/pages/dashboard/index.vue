<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">{{ formattedDate }}</p>
      <h1 class="h1">Bonjour, {{ currentUser?.first_name || 'Utilisateur' }} !</h1>
      <p class="soustitle">
        Aujourd'hui,
        <NuxtLink to="/mes-taches" class="link">
          <span>{{tasks.filter(task => getMyTodayTasks(task, currentUser)).length}}</span>
        </NuxtLink>
        {{tasks.filter(task => getMyTodayTasks(task)).length <= 1 ? 'tâche vous est attribuée'
          : 'tâches vous sont attribuées'}} </p>
    </div>
    <div class="dashboard-content">
      <div class="left">
        <PieChart />
      </div>
      <div class="right">
        <Chart />
      </div>
    </div>
  </div>
</template>

<script setup>
// Le middleware global gère l'authentification

const tasks = ref([]);
const loadingTasks = ref(true);

const loadTasks = async () => {
  try {
    loadingTasks.value = true;
    tasks.value = await $fetch('/api/tasks/my-tasks');
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
    tasks.value = [];
  } finally {
    loadingTasks.value = false;
  }
};

const getMyTodayTasks = (task, currentUser) => {
  if (!currentUser || !task.assigned_to) {
    return false;
  }

  const todayDay = new Date().getDate();
  const taskDay = new Date(task.start_date).getDate();

  const myTaks = task.assigned_to.id === currentUser.id && taskDay === todayDay;

  return myTaks;
}

const getStatusText = (status) => {
  switch (status) {
    case 'todo': return 'À faire';
    case 'in_progress': return 'En cours';
    case 'waiting_for_info': return 'En attente d\'informations';
    case 'blocked': return 'Bloqué';
    case 'cancelled': return 'Annulé';
    case 'to_validate': return 'À valider';
    case 'validated': return 'Validé';
    case 'to_timer': return 'À timer';
    case 'processed_prod': return 'Traité en prod';
    case 'processed_preprod': return 'Traité en préprod';
    case 'done': return 'Terminé';
    default: return status;
  }
};


const authStore = useAuthStore();

onMounted(async () => {
  const dashboardLink = document.querySelector('.dashboard.nav-link');

  if (dashboardLink) {
    dashboardLink.classList.add('active');
  }

  await loadTasks();
});

const date = new Date();
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formattedDate = date.toLocaleDateString('fr-FR', options);

const currentUser = computed(() => authStore.currentUser);

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
        color: $black;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .txt-wp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 80px;
  }

  .surtitle {
    text-transform: capitalize;
    color: $gray;
    font-weight: 400;
    font-size: 16px;
  }

  h1,
  .h1 {
    font-weight: 700;
    margin-bottom: 40px;
  }

  .soustitle {
    font-size: 16px;
    color: $black;
    font-weight: 400;

    span {
      text-decoration: underline;
    }
  }

  .dashboard-content {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    height: 100%;
    // width: 90%;
    // margin: 0 auto;

    @include down(lg) {
      width: 100%;
      flex-direction: column;
      gap: 10px;
      height: auto;
    }

    .left,
    .right {
      background-color: transparent;
      height: auto;
      border: none;
      border-radius: 4px;
      border: 1px solid #d8d8d8;

      @include down(lg) {
        height: 400px;
      }
    }

    .left {
      width: 35%;
      background: $white;

      @include down(lg) {
        width: 100%;
      }
    }

    .right {
      width: 65%;
      background: $white;

      @include down(lg) {
        width: 100%;
      }
    }
  }

  // Styles pour les cartes
  .tasks-card {
    background: $white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    height: 100%;
    overflow-y: auto;

    h3 {
      margin: 0 0 20px 0;
      color: $black;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .tasks-card {

    .loading,
    .empty {
      text-align: center;
      color: $gray;
      padding: 40px;
    }

    .tasks-list {
      .task-item {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 15px;
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          h4 {
            margin: 0;
            font-size: 16px;
            color: $black;
          }

          .task-priority {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;

            &.priority-urgent {
              background: #fef2f2;
              color: #f87171;
            }

            &.priority-high {
              background: #fef3c7;
              color: #fb923c;
            }

            &.priority-medium {
              background: #fefce8;
              color: #facc15;
            }

            &.priority-low {
              background: #f0fdf4;
              color: #86efac;
            }
          }
        }

        .task-description {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: $gray;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .task-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;

            &.status-waiting_for_info {
              background: #fef2f2;
              color: #f87171;
            }

            &.status-todo {
              background: #fef3c7;
              color: #fb923c;
            }

            &.status-in_progress {
              background: #fef3c7;
              color: #d97706;
            }

            &.status-processed_preprod {
              background: #f0f9ff;
              color: #7dd3fc;
            }

            &.status-processed_prod {
              background: #fdf2f8;
              color: #f9a8d4;
            }

            &.status-to_validate {
              background: #fefce8;
              color: #fde047;
            }

            &.status-validated {
              background: #f0fdf4;
              color: #bef264;
            }

            &.status-cancelled {
              background: #f3f4f6;
              color: #a3a3a3;
            }

            &.status-to_timer {
              background: #faf5ff;
              color: #e9d5ff;
            }

            &.status-done {
              background: #f0fdf4;
              color: #a3e635;
            }

            &.status-blocked {
              background-color: #f22121;
              color: $white;
            }
          }

          .task-duration {
            font-size: 12px;
            color: $gray;
            background: #e5e7eb;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }

        .task-assignee {
          font-size: 12px;
          color: $gray;
          font-style: italic;
        }
      }
    }
  }
}
</style>
