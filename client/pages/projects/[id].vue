<template>
  <div class="project-detail-page">
    <!-- En-tête du projet -->
    <div v-if="project" class="project-header">
      <div class="project-info">
        <div class="breadcrumb">
          <button @click="navigateBack" class="back-btn">
            <ArrowLeft :size="16" />
            Retour au client
          </button>
        </div>
        <h1 class="project-title">{{ project.name }}</h1>
        <div class="project-meta">
          <div class="project-status" :class="`status-${project.status}`">
            {{ getStatusText(project.status) }}
          </div>
          <div v-if="project.description" class="project-description">
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
          <div class="hours-summary">
            <strong>{{ formatHours(project.spent_hours) }} / {{ formatHours(project.sold_hours) }} heures</strong>
            <div class="hours-progress-bar">
              <div 
                class="hours-progress-fill" 
                :style="{ 
                  width: `${Math.min((project.spent_hours || 0) / (project.sold_hours || 1) * 100, 100)}%`,
                  backgroundColor: getHoursProgressColor(project.spent_hours || 0, project.sold_hours || 1)
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="header">
      <div class="header-actions">
        <button @click="uiStore.toggleTaskForm()" class="toggle-form-btn">
          <Plus />
          Ajouter une tâche
        </button>
      </div>
    </div>

    <!-- Overlay -->
    <Overlay :opacity="uiStore.isTaskFormVisible ? 1 : 0" @click="handleTaskFormClose" />

    <!-- Formulaire de création/modification -->
    <div v-if="uiStore.isTaskFormVisible" class="form-section">
      <CreateTaskForm 
        ref="createTaskFormRef"
        :task-id="uiStore.isEditing ? uiStore.currentTask?.id : null"
        :initial-task="uiStore.currentTask"
        :project-id="projectId"
        @task-created="onTaskCreated" 
        @task-updated="onTaskUpdated"
        @task-deleted="onTaskDeleted"
        @closeComplete="handleTaskFormComplete" 
      />
    </div>

    <!-- Liste des tâches -->
    <div class="tasks-section">
      <div v-if="loadingTasks" class="loading">
        Chargement des tâches...
      </div>

      <div v-else class="tasks-container">
        <!-- Header fixe -->
        <div class="tasks-header">
          <div class="header-cell name-cell" @click="sortBy('name')">
            <span>Nom de la tâche</span>
            <div class="sort-indicator" :class="getSortClass('name')">
              <ChevronUp v-if="sortByField === 'name' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'name' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell status-cell" @click="sortBy('status')">
            <span>Statut</span>
            <div class="sort-indicator" :class="getSortClass('status')">
              <ChevronUp v-if="sortByField === 'status' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'status' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell priority-cell" @click="sortBy('priority')">
            <span>Priorité</span>
            <div class="sort-indicator" :class="getSortClass('priority')">
              <ChevronUp v-if="sortByField === 'priority' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'priority' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell assigned-cell">Assigné à</div>
          <div class="header-cell due-date-cell" @click="sortBy('due_date')">
            <span>Date limite</span>
            <div class="sort-indicator" :class="getSortClass('due_date')">
              <ChevronUp v-if="sortByField === 'due_date' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'due_date' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell duration-cell" @click="sortBy('duration')">
            <span>Durée</span>
            <div class="sort-indicator" :class="getSortClass('duration')">
              <ChevronUp v-if="sortByField === 'duration' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'duration' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
        </div>

        <!-- Liste des tâches -->
        <div class="tasks-list">
          <div v-if="filteredAndSortedTasks.length === 0" class="empty-state">
            <p>Aucune tâche pour ce projet</p>
          </div>
          
          <div
            v-for="task in filteredAndSortedTasks"
            :key="task.id"
            class="task-row"
            :class="{ 'is-completed': task.status === 'completed' }"
            @click="openTaskDetail(task)"
          >
            <!-- Nom de la tâche -->
            <div class="cell name-cell">
              <div class="task-name">
                {{ task.name }}
                <span v-if="task.created_by === authStore.user?.id" class="created-by-me">Créé par moi</span>
              </div>
            </div>

            <!-- Statut -->
            <div class="cell status-cell">
              <StatusSelector 
                :task="task" 
                @status-updated="onStatusUpdated" 
              />
            </div>

            <!-- Priorité -->
            <div class="cell priority-cell">
              <PrioritySelector 
                :task="task" 
                @priority-updated="onPriorityUpdated" 
              />
            </div>

            <!-- Assigné à -->
            <div class="cell assigned-cell">
              <div v-if="task.assigned_to" class="assignee-info">
                <div class="assignee-avatar">
                  {{ getInitials(task.assigned_to.first_name, task.assigned_to.last_name) }}
                </div>
                <span class="assignee-name">
                  {{ task.assigned_to.first_name }} {{ task.assigned_to.last_name }}
                </span>
              </div>
              <span v-else class="no-assignee">Non assigné</span>
            </div>

            <!-- Date limite -->
            <div class="cell due-date-cell">
              <span v-if="task.due_date" class="due-date" :class="getDueDateClass(task.due_date)">
                {{ formatDueDate(task.due_date) }}
              </span>
              <span v-else class="no-due-date">Aucune</span>
            </div>

            <!-- Durée -->
            <div class="cell duration-cell">
              <span class="duration">{{ formatDuration(task.duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panneau de détail des tâches -->
    <TaskDetailPanel 
      v-if="uiStore.isTaskDetailVisible"
      :task="uiStore.selectedTask"
      @task-updated="onTaskUpdated"
      @task-deleted="onTaskDeleted"
      @close="uiStore.closeTaskDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, ArrowLeft, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';
import { useUiStore } from '~/stores/ui';
import { useAuthStore } from '~/stores/auth';

// Composants
import CreateTaskForm from '~/components/base/CreateTaskForm.vue';
import TaskDetailPanel from '~/components/base/TaskDetailPanel.vue';
import StatusSelector from '~/components/form/StatusSelector.vue';
import PrioritySelector from '~/components/form/PrioritySelector.vue';

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const projectId = route.params.id;
const uiStore = useUiStore();
const authStore = useAuthStore();

// État
const project = ref(null);
const tasks = ref([]);
const loadingProject = ref(true);
const loadingTasks = ref(true);

// Tri et filtrage
const sortByField = ref('created_at');
const sortOrder = ref('desc');

// Charger le projet
const loadProject = async () => {
  try {
    loadingProject.value = true;
    project.value = await $fetch(`/api/projects/${projectId}`);
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error);
  } finally {
    loadingProject.value = false;
  }
};

// Charger les tâches du projet
const loadTasks = async () => {
  try {
    loadingTasks.value = true;
    tasks.value = await $fetch(`/api/tasks/project/${projectId}`);
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
    tasks.value = [];
  } finally {
    loadingTasks.value = false;
  }
};

// Navigation retour
const navigateBack = () => {
  if (project.value && project.value.client_id) {
    navigateTo(`/clients/${project.value.client_id}`);
  } else {
    navigateTo('/clients');
  }
};

// Fonctions utilitaires (réutilisées depuis mes-taches)
const formatHours = (hours) => {
  const numHours = parseFloat(hours);
  if (!numHours || numHours === 0 || isNaN(numHours)) return '0';
  
  if (numHours % 1 === 0) return numHours.toString();
  return parseFloat(numHours.toFixed(2)).toString();
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  const first = firstName ? firstName.charAt(0) : '';
  const last = lastName ? lastName.charAt(0) : '';
  return (first + last).toUpperCase();
};

const formatDueDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

const formatDuration = (duration) => {
  if (!duration) return 'Non définie';
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}min`;
};

const getDueDateClass = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 1) return 'due-soon';
  if (diffDays <= 7) return 'due-this-week';
  return '';
};

// Tri
const sortBy = (field) => {
  if (sortByField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortByField.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortClass = (field) => {
  if (sortByField.value !== field) return '';
  return sortOrder.value === 'asc' ? 'asc' : 'desc';
};

// Calculs
const filteredAndSortedTasks = computed(() => {
  let filtered = [...tasks.value];
  
  // Tri
  filtered.sort((a, b) => {
    let aValue = a[sortByField.value];
    let bValue = b[sortByField.value];
    
    if (sortByField.value === 'priority') {
      const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }
    
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
  
  return filtered;
});

// Gestion des événements
const handleTaskFormClose = () => {
  uiStore.closeTaskForm();
};

const handleTaskFormComplete = () => {
  uiStore.closeTaskForm();
};

const openTaskDetail = (task) => {
  uiStore.openTaskDetail(task);
};

const onTaskCreated = (newTask) => {
  tasks.value.unshift(newTask);
  uiStore.closeTaskForm();
};

const onTaskUpdated = (updatedTask) => {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
};

const onTaskDeleted = (taskId) => {
  tasks.value = tasks.value.filter(t => t.id !== taskId);
  uiStore.closeTaskDetail();
};

const onStatusUpdated = (updatedTask) => {
  onTaskUpdated(updatedTask);
};

const onPriorityUpdated = (updatedTask) => {
  onTaskUpdated(updatedTask);
};

// Chargement initial
onMounted(() => {
  loadProject();
  loadTasks();
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.project-detail-page {
  padding: 40px;
  min-height: 100vh;
}

.project-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .breadcrumb {
    margin-bottom: 16px;

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6B7280;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      transition: color 0.2s;

      &:hover {
        color: $blue;
      }
    }
  }

  .project-title {
    font-size: 32px;
    font-weight: 700;
    color: $black;
    margin: 0 0 16px 0;
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .project-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      width: fit-content;

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

    .project-description {
      color: #6B7280;
      font-size: 14px;
      line-height: 1.5;
    }

    .project-dates {
      display: flex;
      gap: 24px;
      font-size: 14px;

      .date-info {
        color: #6B7280;

        strong {
          color: #374151;
        }
      }
    }

    .hours-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;

      strong {
        color: #374151;
      }

      .hours-progress-bar {
        width: 200px;
        height: 8px;
        background: #F3F4F6;
        border-radius: 4px;
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

// Réutiliser les styles de mes-taches pour le reste
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 40px;

  .header-actions {
    display: flex;
    gap: 16px;

    .toggle-form-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: $blue;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #2563EB;
      }
    }
  }
}

.form-section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 800px;
}

.tasks-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6B7280;
  font-size: 16px;
}

.tasks-container {
  .tasks-header {
    display: grid;
    grid-template-columns: 2fr 120px 120px 180px 120px 100px;
    gap: 16px;
    padding: 16px 24px;
    background: #F9FAFB;
    border-bottom: 1px solid #E5E7EB;
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;

    .header-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: $blue;
      }

      .sort-indicator {
        opacity: 0.5;
        transition: opacity 0.2s;

        &.asc, &.desc {
          opacity: 1;
          color: $blue;
        }
      }
    }
  }

  .tasks-list {
    max-height: 60vh;
    overflow-y: auto;

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6B7280;
      font-style: italic;
    }

    .task-row {
      display: grid;
      grid-template-columns: 2fr 120px 120px 180px 120px 100px;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid #F3F4F6;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #F9FAFB;
      }

      &.is-completed {
        opacity: 0.6;

        .task-name {
          text-decoration: line-through;
        }
      }

      .cell {
        display: flex;
        align-items: center;
        font-size: 14px;
      }

      .name-cell {
        .task-name {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .created-by-me {
            font-size: 11px;
            color: $blue;
            font-weight: 500;
          }
        }
      }

      .assigned-cell {
        .assignee-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .assignee-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: $blue;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
          }

          .assignee-name {
            font-size: 13px;
          }
        }

        .no-assignee {
          color: #9CA3AF;
          font-style: italic;
        }
      }

      .due-date-cell {
        .due-date {
          &.overdue {
            color: #DC2626;
            font-weight: 500;
          }

          &.due-soon {
            color: #F59E0B;
            font-weight: 500;
          }

          &.due-this-week {
            color: #3B82F6;
          }
        }

        .no-due-date {
          color: #9CA3AF;
          font-style: italic;
        }
      }

      .duration-cell {
        .duration {
          font-size: 13px;
          color: #6B7280;
        }
      }
    }
  }
}
</style> 