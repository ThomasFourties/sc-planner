<template>
  <div class="client-dashboard">
    <div v-if="loadingClient" class="loading">
      Chargement...
    </div>

    <div v-else-if="client" class="dashboard-content">
      <div class="client-header">

        <div class="client-info">

          <div class="client-logo">
            <div v-if="client.logo" class="logo-img">
              <img :src="client.logo" :alt="client.name" />

            </div>
            <div v-else class="logo-placeholder" :style="{ backgroundColor: getRandomColor(client?.id || 'default') }">
              {{ getInitials(client?.name) }}
            </div>
          </div>
          <div class="client-details">
            <div class="client-header-row">
              <div class="left">
                <h1 class="client-name">{{ client?.name || 'Client' }}</h1>
                <div v-if="client.website_prod || client.website_preprod" class="client-website">
                  <a v-if="client.website_preprod" :href="client.website_preprod" target="_blank">preprod</a>
                  <a v-if="client.website_prod" :href="client.website_prod" target="_blank">prod</a>
                </div>
              </div>
              <div class="client-actions">
                <button @click="openEditForm" class="edit-client-btn">
                  <Edit :size="16" />
                </button>
                <button @click="openDeleteConfirmation" class="delete-client-btn">
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
            <div class="client-meta">
              <div class="creation-date">
                <strong>Date de création</strong><br>
                {{ client?.created_at ? formatDate(client.created_at) : 'Non disponible' }}
              </div>
              <div class="contact-info">
                <strong>Personnes assignées</strong><br>
                <div v-if="!loadingUsers && users.length > 0" class="assigned-users">
                  <div v-for="user in users" :key="user.id" class="user-item">
                    {{ user.first_name }} {{ user.last_name }} — {{ user.email }}
                  </div>
                </div>
                <div v-else-if="!loadingUsers && users.length === 0" class="no-users">
                  <br>Aucun utilisateur assigné
                </div>
              </div>
              <div class="description">
                <strong>Description</strong><br>
                {{ client?.description || 'Aucune description disponible' }}
              </div>
              <div class="hours-stats">
                <strong>Heures vendues</strong><br>
                <div class="progress-container">
                  <div class="progress-circle">
                    <svg width="120" height="120" class="progress-svg">
                      <circle cx="60" cy="60" r="50" class="progress-bg" />
                      <circle cx="60" cy="60" r="50" class="progress-fill" :stroke-dasharray="circumference"
                        :stroke-dashoffset="progressOffset" />
                    </svg>
                    <div class="progress-text">
                      <div class="percentage">{{ Math.round(progressPercentage) }}%</div>
                      <div class="hours">{{ formatHours(totalSpentHours) }} / {{ formatHours(totalSoldHours) }} heures
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="projects-section">
        <div class="projects-header">
          <h2>Projets <span class="project-count">({{ projects.length }})</span></h2>
          <button @click="openProjectForm" class="add-project-btn btn">
            <Plus :size="16" />
            Ajouter un projet
          </button>
        </div>

        <Overlay :opacity="showProjectForm ? 1 : 0" @click="closeProjectForm" />

        <div v-if="showProjectForm" class="form-section">
          <CreateProjectForm :client-id="clientId" @project-created="onProjectCreated" @close="closeProjectForm" />
        </div>

        <Overlay :opacity="showEditForm ? 1 : 0" @click="closeEditForm" />

        <div v-if="showEditForm" class="form-section">
          <EditClientForm ref="editClientFormRef" :client="client" @client-updated="onClientUpdated"
            @closeComplete="handleEditFormClose" />
        </div>

        <Overlay :opacity="showDeleteConfirmation ? 1 : 0" @click="closeDeleteConfirmation" />

        <ConfirmModal :is-visible="showDeleteConfirmation" title="Supprimer le client"
          :message="`Êtes-vous sûr de vouloir supprimer le client '${client?.name}' ? Cette action est irréversible.`"
          confirm-text="Supprimer" cancel-text="Annuler" :is-danger="true" @confirm="deleteClient"
          @cancel="closeDeleteConfirmation" />

        <div v-if="loadingProjects" class="loading">
          Chargement des projets...
        </div>

        <div v-else class="projects-grid">
          <div v-for="project in projects" :key="project.id" class="project-card"
            @click="navigateToProject(project.id)">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <div class="project-status" :class="`status-${project.status}`">
                {{ getStatusText(project.status) }}
              </div>
            </div>

            <div class="project-progress">
              <div class="project-description" v-if="project.description">
                {{ project.description }}
              </div>

              <div class="project-dates" v-if="project.start_date || project.end_date">
                <div v-if="project.start_date" class="date-info">
                  <strong>Début :</strong> {{ formatDate(project.start_date) }}
                </div>
                <div v-if="project.end_date" class="date-info">
                  <strong>Fin :</strong> {{ formatDate(project.end_date) }}
                </div>
              </div>

              <div class="hours-info">
                <strong>{{ formatHours(project.spent_hours) }} / {{ formatHours(project.sold_hours) }} heures</strong>
                <div class="hours-progress-bar">
                  <div class="hours-progress-fill" :style="{
                    width: `${Math.min((project.spent_hours || 0) / (project.sold_hours || 1) * 100, 100)}%`,
                    backgroundColor: getHoursProgressColor(project.spent_hours || 0, project.sold_hours || 1)
                  }"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="projects.length === 0" class="empty-projects">
            <p>Aucun projet pour ce client</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Client non trouvé</p>
    </div>
  </div>
</template>

<script setup>
import { Plus, Edit, Trash2 } from 'lucide-vue-next';
import CreateProjectForm from '~/components/base/CreateProjectForm.vue';
import EditClientForm from '~/components/base/EditClientForm.vue';
import ConfirmModal from '~/components/base/ConfirmModal.vue';

const route = useRoute();
const clientId = route.params.id;

const client = ref(null);
const projects = ref([]);
const users = ref([]);
const loadingClient = ref(true);
const loadingProjects = ref(true);
const loadingUsers = ref(true);
const showProjectForm = ref(false);
const showEditForm = ref(false);
const showDeleteConfirmation = ref(false);
const deletingClient = ref(false);
const editClientFormRef = ref(null);

const avatarColors = [
  '#4F46E5', '#06B6D4', '#8B5CF6', '#EF4444', '#10B981',
  '#F59E0B', '#3B82F6', '#EC4899', '#6366F1', '#14B8A6'
];

const totalSoldHours = computed(() => {
  const total = projects.value.reduce((total, project) => {
    const soldHours = parseFloat(project.sold_hours) || 0;
    return total + soldHours;
  }, 0);
  return isNaN(total) ? 0 : total;
});

const totalSpentHours = computed(() => {
  const total = projects.value.reduce((total, project) => {
    const spentHours = parseFloat(project.spent_hours) || 0;
    return total + spentHours;
  }, 0);
  return isNaN(total) ? 0 : total;
});

const circumference = 2 * Math.PI * 50;
const progressPercentage = computed(() => {
  const sold = totalSoldHours.value;
  const spent = totalSpentHours.value;

  if (!sold || sold === 0 || isNaN(sold) || isNaN(spent)) return 0;

  const percentage = (spent / sold) * 100;
  return isNaN(percentage) ? 0 : Math.min(percentage, 100);
});

const progressOffset = computed(() => {
  return circumference - (progressPercentage.value / 100) * circumference;
});

const formatHours = (hours) => {
  const numHours = parseFloat(hours);
  if (!numHours || numHours === 0 || isNaN(numHours)) return '0';

  if (numHours % 1 === 0) return numHours.toString();

  return parseFloat(numHours.toFixed(2)).toString();
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (id) => {
  if (!id || typeof id !== 'string') {
    return avatarColors[0];
  }

  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatusText = (status) => {
  const statuses = {
    'planning': 'Planification',
    'in_progress': 'En cours',
    'on_hold': 'En pause',
    'completed': 'Terminé',
    'cancelled': 'Annulé'
  };
  return statuses[status] || status;
};

const getHoursProgressColor = (spent, sold) => {
  const spentNum = parseFloat(spent) || 0;
  const soldNum = parseFloat(sold) || 1;

  if (soldNum === 0) return '#3B82F6';

  const percentage = (spentNum / soldNum) * 100;
  if (isNaN(percentage)) return '#3B82F6';

  if (percentage >= 90) return '#EF4444';
  if (percentage >= 70) return '#F59E0B';
  return '#3B82F6';
};

const loadClient = async () => {
  try {
    loadingClient.value = true;
    client.value = await $fetch(`/api/clients/${clientId}`);
  } catch (error) {
    console.error('Erreur lors du chargement du client:', error);
  } finally {
    loadingClient.value = false;
  }
};

const loadProjects = async () => {
  try {
    loadingProjects.value = true;
    projects.value = await $fetch(`/api/projects/client/${clientId}`);
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
    projects.value = [];
  } finally {
    loadingProjects.value = false;
  }
};

const loadUsers = async () => {
  try {
    loadingUsers.value = true;
    users.value = await $fetch(`/api/users/client/${clientId}`);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    users.value = [];
  } finally {
    loadingUsers.value = false;
  }
};

const openProjectForm = () => {
  showProjectForm.value = true;
};

const closeProjectForm = () => {
  showProjectForm.value = false;
};

const onProjectCreated = (newProject) => {
  projects.value.unshift(newProject);
  showProjectForm.value = false;
};

const openEditForm = () => {
  showEditForm.value = true;
};

const closeEditForm = async () => {
  if (editClientFormRef.value) {
    await editClientFormRef.value.handleClose();
  } else {
    showEditForm.value = false;
  }
};

const handleEditFormClose = () => {
  showEditForm.value = false;
};

const onClientUpdated = async (updatedClient) => {
  if (updatedClient && updatedClient.id) {
    client.value = updatedClient;
  } else {
    await loadClient();
  }

  await Promise.all([loadUsers(), loadProjects()]);
};

const openDeleteConfirmation = () => {
  showDeleteConfirmation.value = true;
};

const closeDeleteConfirmation = () => {
  showDeleteConfirmation.value = false;
};

const deleteClient = async () => {
  try {
    deletingClient.value = true;

    await $fetch(`/api/clients/${clientId}`, {
      method: 'DELETE'
    });

    await navigateTo('/clients');
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
  } finally {
    deletingClient.value = false;
    showDeleteConfirmation.value = false;
  }
};

const navigateToProject = (projectId) => {
  navigateTo(`/projects/${projectId}`);
};

onMounted(() => {
  loadClient();
  loadProjects();
  loadUsers();
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.client-dashboard {
  padding: 40px;
  min-height: 100vh;

  @include down(md) {
    padding: 20px;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6B7280;
  font-size: 16px;
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #DC2626;
  font-size: 16px;
}

.client-header {
  background: white;
  border-radius: 4px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

  .client-info {
    display: flex;
    gap: 24px;

    @include down(md) {
      flex-direction: column;
    }

    .client-logo {
      .logo-img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .logo-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 32px;
      }
    }

    .client-details {
      flex: 1;

      .client-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        .left {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;

          .client-website {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: $black;
            text-transform: uppercase;
            font-weight: 600;
          }
        }

        .client-actions {
          display: flex;
          gap: 12px;
          align-items: center;

          .edit-client-btn,
          .delete-client-btn {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 4px;
            font-size: 14px;
            width: 36px;
            height: 36px;
            transition: all 0.2s ease;

            &:hover {
              background-color: #f3f4f6;
            }
          }

          .edit-client-btn {
            color: $black;

            &:hover {
              color: $blue;
              background-color: rgba(59, 130, 246, 0.1);
            }
          }

          .delete-client-btn {
            color: #6B7280;

            &:hover {
              color: #DC2626;
              background-color: rgba(220, 38, 38, 0.1);
            }
          }
        }
      }

      .client-name {
        font-size: 36px;
        font-weight: 700;
        color: $black;
        margin: 0;
      }

      .client-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;

        @include down(md) {
          grid-template-columns: 1fr;
        }

        >div {
          font-size: 14px;
          line-height: 1.6;

          strong {
            color: $black;
            font-weight: 600;
          }
        }

        .assigned-users {
          .user-item {
            color: #6B7280;
            font-size: 13px;
            margin-bottom: 2px;
          }
        }

        .no-users {
          color: #9CA3AF;
          font-style: italic;
          font-size: 13px;
        }

        .progress-container {
          margin-top: 8px;

          .progress-circle {
            position: relative;
            width: 120px;
            height: 120px;

            .progress-svg {
              transform: rotate(-90deg);

              .progress-bg {
                fill: none;
                stroke: #f3f4f6;
                stroke-width: 8;
              }

              .progress-fill {
                fill: none;
                stroke: $blue;
                stroke-width: 8;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.5s ease;
              }
            }

            .progress-text {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;

              .percentage {
                font-size: 24px;
                font-weight: 700;
                color: $black;
                line-height: 1;
              }

              .hours {
                font-size: 10px;
                color: #6B7280;
                line-height: 1.2;
                margin-top: 4px;
              }
            }
          }
        }
      }
    }
  }
}

.projects-section {
  .projects-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: $black;
      margin: 0;

      .project-count {
        color: #6B7280;
        font-weight: 400;
      }
    }

    .add-project-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .project-card {
      background: white;
      border-radius: 4px;
      padding: 20px;
      border: 1px solid #E5E7EB;
      transition: all 0.2s;
      cursor: pointer;

      &:hover {
        border-color: $blue;
      }

      // &:hover {
      //   transform: translateY(-2px);
      //   box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      // }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        .project-name {
          font-size: 16px;
          font-weight: 600;
          color: $black;
          margin: 0;
          flex: 1;
        }

        .project-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;

          &.status-planning {
            background: #FEF3C7;
            color: #92400E;
          }

          &.status-in_progress {
            background: #DBEAFE;
            color: #1E40AF;
          }

          &.status-on_hold {
            background: #FEE2E2;
            color: #991B1B;
          }

          &.status-completed {
            background: #D1FAE5;
            color: #065F46;
          }

          &.status-cancelled {
            background: #F3F4F6;
            color: #374151;
          }
        }
      }

      .project-progress {
        .project-description {
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .project-dates {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;

          .date-info {
            font-size: 12px;
            color: #6B7280;

            strong {
              color: #374151;
            }
          }
        }

        .hours-info {
          font-size: 12px;
          color: #6B7280;

          strong {
            color: #374151;
          }

          .hours-progress-bar {
            width: 100%;
            height: 6px;
            background: #F3F4F6;
            border-radius: 4px;
            margin-top: 6px;
            overflow: hidden;

            .hours-progress-fill {
              height: 100%;
              border-radius: 4px;
              transition: all 0.3s ease;
            }
          }
        }
      }
    }
  }

  .empty-projects {
    text-align: center;
    padding: 40px;
    color: #6B7280;
    font-style: italic;
  }

  .form-section {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 600px;
  }
}
</style>