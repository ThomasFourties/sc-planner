<template>
  <div class="dashboard">
    <div class="txt-wp">
      <p class="surtitle">{{ formattedDate }}</p>
      <h1 class="h1">Bonjour, {{ currentUser?.first_name || 'Utilisateur' }} !</h1>
      <p class="soustitle" v-if="!loadingTasks">
        Aujourd'hui, <span>{{tasks.filter(task => {
          const today = new Date();
          const taskDate = new Date(task.start_date);
          return taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getDate() === today.getDate();
        }).length}} tâches</span> vous sont assignées
      </p>
      <p class="soustitle" v-else>
        Chargement de vos tâches...
      </p>
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
definePageMeta({
  middleware: 'auth'
});

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

const getStatusText = (status) => {
  switch (status) {
    case 'todo': return 'À faire';
    case 'in_progress': return 'En cours';
    case 'done': return 'Terminé';
    case 'blocked': return 'Bloqué';
    case 'not_started': return 'Non commencé';
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
        // background-color: $lightGray;
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
    width: 90%;
    margin: 0 auto;

    @include down(md) {
      width: 100%;
      flex-direction: column;
      gap: 10px;
      height: auto;
    }

    .left,
    .right {
      background-color: transparent;
      height: 100%;
      border: none;
      border-radius: 4px;
      border: 1px solid $lightGray;

      @include down(md) {
        height: 400px;
      }
    }

    .left {
      width: 35%;
      background: $white;

      @include down(md) {
        width: 100%;
      }
    }

    .right {
      width: 65%;
      background: $white;

      @include down(md) {
        width: 100%;
      }
    }
  }

  // Styles pour les cartes
  .tasks-card {
    background: $white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
        border-radius: 6px;
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
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;

            &.priority-high {
              background: #fee2e2;
              color: #ef4444;
            }

            &.priority-medium {
              background: #fef3c7;
              color: #f59e0b;
            }

            &.priority-low {
              background: #d1fae5;
              color: #10b981;
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
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;

            &.status-todo {
              background: #f3f4f6;
              color: #6b7280;
            }

            &.status-in_progress {
              background: #dbeafe;
              color: #3b82f6;
            }

            &.status-done {
              background: #d1fae5;
              color: #10b981;
            }

            &.status-blocked {
              background: #fee2e2;
              color: #ef4444;
            }
          }

          .task-duration {
            font-size: 12px;
            color: $gray;
            background: #e5e7eb;
            padding: 2px 6px;
            border-radius: 8px;
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
