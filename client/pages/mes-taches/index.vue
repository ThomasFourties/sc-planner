<template>
  <div class="tasks-page">
    <div class="header">
      <div class="header-actions">
        <!-- <button @click="uiStore.toggleTaskForm()" class="toggle-form-btn">
          <Plus />
          Ajouter une tâche
        </button> -->
        <!-- <button @click="showArchives" class="archives-btn">
          <Archive />
          Archives
        </button> -->
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
          <div class="header-cell checkbox-cell">
            <!-- <span>Terminé</span> -->
          </div>
          <div class="header-cell name-cell" @click="sortBy('name')">
            <span :class="{ 'active': sortByField === 'name' }">Nom de la tâche</span>
            <div class="sort-indicator" :class="getSortClass('name')">
              <ChevronUp v-if="sortByField === 'name' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'name' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell status-cell" @click="sortBy('status')">
            <span :class="{ 'active': sortByField === 'status' }">Statut</span>
            <div class="sort-indicator" :class="getSortClass('status')">
              <ChevronUp v-if="sortByField === 'status' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'status' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell creator-cell" @click="sortBy('created_by')">
            <span :class="{ 'active': sortByField === 'created_by' }">Créé par</span>
            <div class="sort-indicator" :class="getSortClass('created_by')">
              <ChevronUp v-if="sortByField === 'created_by' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'created_by' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell date-cell" @click="sortBy('created_at')">
            <span :class="{ 'active': sortByField === 'created_at' }">Créé le</span>
            <div class="sort-indicator" :class="getSortClass('created_at')">
              <ChevronUp v-if="sortByField === 'created_at' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'created_at' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell date-cell" @click="sortBy('start_date')">
            <span :class="{ 'active': sortByField === 'start_date' }">À faire le</span>
            <div class="sort-indicator" :class="getSortClass('start_date')">
              <ChevronUp v-if="sortByField === 'start_date' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'start_date' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell priority-cell" @click="sortBy('priority')">
            <span :class="{ 'active': sortByField === 'priority' }">Priorité</span>
            <div class="sort-indicator" :class="getSortClass('priority')">
              <ChevronUp v-if="sortByField === 'priority' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'priority' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <!-- <div class="header-cell project-cell">
            <span>Projet</span>
          </div> -->
          <div class="header-cell client-cell">
            <span>Client</span>
          </div>
          <!-- <div class="header-cell actions-cell">
            <span>Actions</span>
          </div> -->
        </div>

        <!-- Contenu scrollable -->
        <div class="tasks-body">
          <!-- Message si aucune tâche -->
          <div v-if="sortedTasks.length === 0" class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">📝</div>
              <div class="empty-text">Aucune tâche trouvée</div>
              <div class="empty-subtext">Créez votre première tâche en cliquant sur le bouton ci-dessus</div>
            </div>
          </div>

          <!-- Lignes des tâches -->
          <div v-else v-for="task in sortedTasks" :key="task.id" class="task-row" :class="{ 'completed': task.completed }" @click="editTask(task)">
            <!-- Checkbox de complétion -->
            <div class="task-cell checkbox-cell" @click.stop>
              <input 
                type="checkbox" 
                :checked="task.completed" 
                @change="toggleTaskCompleted(task)"
                class="task-checkbox"
              />
            </div>
            <!-- Nom de la tâche -->
            <div class="task-cell name-cell">
              <div class="task-info">
                <span class="task-icon" :class="`priority-${task.priority}`">●</span>
                <div>
                  <div class="name">{{ task.name }}</div>
                  <div v-if="task.description" class="description">{{ task.description }}</div>
                </div>
              </div>
            </div>

            <!-- Statut -->
            <div class="task-cell status-cell" @click.stop>
              <div class="status-dropdown" @click="toggleStatusDropdown(task.id, $event)" :ref="`status-dropdown-${task.id}`">
                <span class="status-badge" :class="`status-${task.status}`">
                  {{ getStatusText(task.status) }}
                </span>
                <div v-if="openStatusDropdown === task.id" class="status-dropdown-menu" :style="dropdownPosition">
                  <div 
                    v-for="status in availableStatuses" 
                    :key="status.value"
                    @click="updateTaskStatus(task, status.value)"
                    class="status-dropdown-item"
                    :class="`status-${status.value}`"
                  >
                    <div class="status-indicator" :class="`status-${status.value}`"></div>
                    {{ status.label }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Créé par -->
            <div class="task-cell creator-cell">
              <div class="user-info">
                <div class="name">{{ task.created_by?.first_name || '' }} {{ task.created_by?.last_name || '' }}</div>
                <!-- <div v-if="task.created_by.id === authStore.currentUser?.id" class="created-by-me">Créé par moi</div> -->
              </div>
            </div>

            <!-- Créé le -->
            <div class="task-cell date-cell">
              {{ formatDate(task.created_at) }}
            </div>

            <!-- À faire le -->
            <div class="task-cell date-cell">
              <div v-if="task.start_date">
                {{ formatDate(task.start_date) }}
              </div>
              <div v-else class="no-date">
                Non planifié
              </div>
            </div>

            <!-- Priorité -->
            <div class="task-cell priority-cell" @click.stop>
              <div class="priority-dropdown" @click="togglePriorityDropdown(task.id, $event)" :ref="`priority-dropdown-${task.id}`">
                <span class="priority-badge" :class="`priority-${task.priority}`">
                  {{ getPriorityText(task.priority) }}
                </span>
                <div v-if="openPriorityDropdown === task.id" class="priority-dropdown-menu" :style="priorityDropdownPosition">
                  <div 
                    v-for="priority in availablePriorities" 
                    :key="priority.value"
                    @click="updateTaskPriority(task, priority.value)"
                    class="priority-dropdown-item"
                    :class="`priority-${priority.value}`"
                  >
                    <div class="priority-indicator" :class="`priority-${priority.value}`">●</div>
                    {{ priority.label }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Projet -->
            <!-- <div class="task-cell project-cell">
              <div v-if="task.project" class="project-info">
                <div class="project-name">{{ task.project.name }}</div>
                <div v-if="task.project.description" class="project-description">{{ task.project.description }}</div>
              </div>
              <div v-else class="no-project">
                Aucun projet
              </div>
            </div> -->

            <!-- Client -->
            <div class="task-cell client-cell">
              <div v-if="task.project?.client" class="client-info">
                <div class="client-name"><a :href="`/clients/${task.project.client.id}`">{{ task.project.client.name }}</a></div>
              </div>
              <div v-else class="no-client">
                -
              </div>
            </div>

            <!-- Actions -->
            <!-- <div class="task-cell actions-cell">
              <div class="actions-group">
                <button @click="editTask(task)" class="edit-btn" title="Modifier">
                  ✏️
                </button>
                <button @click="deleteTask(task.id)" class="delete-btn" title="Supprimer">
                  🗑️
                </button>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, ChevronUp, ChevronDown, ChevronsUpDown, Archive } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
// import { useUIStore } from '~/stores/ui';
import { useAuthStore } from '~/stores/auth';

// Le middleware global gère l'authentification

// Store
const uiStore = useUIStore();
const authStore = useAuthStore();

// État
const tasks = ref([]);
const loadingTasks = ref(true);
const createTaskFormRef = ref(null);

// État du tri
const sortByField = ref('status');
const sortOrder = ref('asc'); // 'asc' ou 'desc'

// État du dropdown de statut
const openStatusDropdown = ref(null);
const dropdownPosition = ref({});

// État du dropdown de priorité
const openPriorityDropdown = ref(null);
const priorityDropdownPosition = ref({});

// Ordre des statuts pour le tri
const statusOrder = {
  'todo': 1,
  'in_progress': 2,
  'waiting_for_info': 3,
  'blocked': 4,
  'cancelled': 5,
  'to_validate': 6,
  'validated': 7,
  'to_timer': 8,
  'processed_prod': 9,
  'processed_preprod': 10,
  'done': 11
};

// Ordre des priorités pour le tri
const priorityOrder = {
  'low': 1,
  'medium': 2,
  'high': 3,
  'urgent': 4
};

// Statuts disponibles
const availableStatuses = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'waiting_for_info', label: 'En attente d\'informations' },
  { value: 'blocked', label: 'Bloqué' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'to_validate', label: 'À valider' },
  { value: 'validated', label: 'Validé' },
  { value: 'to_timer', label: 'À timer' },
  { value: 'processed_prod', label: 'Traité en prod' },
  { value: 'processed_preprod', label: 'Traité en préprod' },
  { value: 'done', label: 'Terminé' }
];

// Priorités disponibles
const availablePriorities = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Élevée' },
  { value: 'urgent', label: 'Urgente' }
];

// Tâches triées
const sortedTasks = computed(() => {
  if (tasks.value.length === 0) return [];

  const sorted = [...tasks.value].sort((a, b) => {
    let aValue, bValue;

    // Gérer les différents types de tri
    switch (sortByField.value) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'status':
        aValue = statusOrder[a.status] || 999;
        bValue = statusOrder[b.status] || 999;
        break;
      case 'priority':
        aValue = priorityOrder[a.priority] || 999;
        bValue = priorityOrder[b.priority] || 999;
        break;
      case 'created_by':
        aValue = `${a.created_by?.first_name || ''} ${a.created_by?.last_name || ''}`.toLowerCase();
        bValue = `${b.created_by?.first_name || ''} ${b.created_by?.last_name || ''}`.toLowerCase();
        break;
      case 'created_at':
      case 'start_date':
        aValue = a[sortByField.value] ? new Date(a[sortByField.value]).getTime() : 0;
        bValue = b[sortByField.value] ? new Date(b[sortByField.value]).getTime() : 0;
        break;
      default:
        aValue = a[sortByField.value] || '';
        bValue = b[sortByField.value] || '';
    }

    // Comparer les valeurs
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
});

// Fonction de tri
const sortBy = (field) => {
  if (sortByField.value === field) {
    // Inverser l'ordre si on clique sur la même colonne
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Nouveau champ, commencer par asc
    sortByField.value = field;
    sortOrder.value = 'asc';
  }
};

// Fonctions pour les indicateurs visuels
const getSortClass = (field) => {
  if (sortByField.value !== field) return '';
  return sortOrder.value === 'asc' ? 'sort-asc' : 'sort-desc';
};

// Charger les tâches
const loadTasks = async () => {
  try {
    loadingTasks.value = true;
    tasks.value = await $fetch('/api/tasks/my-tasks');
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
  } finally {
    loadingTasks.value = false;
  }
};

// Gestionnaire de création de tâche
const onTaskCreated = (newTask) => {
  tasks.value.unshift(newTask);
  uiStore.closeTaskForm();
};

// Gestionnaire de modification de tâche
const onTaskUpdated = (updatedTask) => {
  const index = tasks.value.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
  uiStore.closeTaskForm();
};

// Gestionnaire de suppression de tâche
const onTaskDeleted = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId);
  uiStore.closeTaskForm();
};

// Formatage des textes
const getStatusText = (status) => {
  const statuses = {
    'todo': 'À faire',
    'in_progress': 'En cours',
    'waiting_for_info': 'En attente d\'informations',
    'blocked': 'Bloqué',
    'cancelled': 'Annulé',
    'to_validate': 'À valider',
    'validated': 'Validé',
    'to_timer': 'À timer',
    'processed_prod': 'Traité en prod',
    'processed_preprod': 'Traité en préprod',
    'done': 'Terminé'
  };
  return statuses[status] || status;
};

const getPriorityText = (priority) => {
  const priorities = {
    'low': 'Faible',
    'medium': 'Moyenne',
    'high': 'Élevée',
    'urgent': 'Urgente'
  };
  return priorities[priority] || priority;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Actions sur les tâches
const editTask = (task) => {
  uiStore.openTaskEdit(task);
};

const deleteTask = async (taskId) => {
  try {
    await $fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    tasks.value = tasks.value.filter(task => task.id !== taskId);
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
  }
};

const showArchives = () => {
  // TODO: Implémenter la page des archives
  console.log('Afficher les archives');
};

// Fonctions pour le dropdown de statut
const toggleStatusDropdown = (taskId, event) => {
  if (openStatusDropdown.value === taskId) {
    openStatusDropdown.value = null;
    return;
  }

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  
  dropdownPosition.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  };
  
  openStatusDropdown.value = taskId;
};

const updateTaskStatus = async (task, newStatus) => {
  if (task.status === newStatus) {
    openStatusDropdown.value = null;
    return;
  }

  try {
    const updatedTask = await $fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
    
    // Mettre à jour la tâche dans la liste
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask };
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
    // Afficher une notification d'erreur à l'utilisateur
    if (error.statusMessage) {
      alert(`Erreur: ${error.statusMessage}`);
    } else if (error.message) {
      alert(`Erreur: ${error.message}`);
    } else {
      alert('Erreur lors de la mise à jour du statut');
    }
  } finally {
    openStatusDropdown.value = null;
  }
};

// Fonctions pour le dropdown de priorité
const togglePriorityDropdown = (taskId, event) => {
  if (openPriorityDropdown.value === taskId) {
    openPriorityDropdown.value = null;
    return;
  }

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  
  priorityDropdownPosition.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  };
  
  openPriorityDropdown.value = taskId;
};

const updateTaskPriority = async (task, newPriority) => {
  if (task.priority === newPriority) {
    openPriorityDropdown.value = null;
    return;
  }

  try {
    const updatedTask = await $fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { priority: newPriority }
    });
    
    // Mettre à jour la tâche dans la liste
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask };
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la priorité:', error);
  } finally {
    openPriorityDropdown.value = null;
  }
};

// Fonction pour basculer le statut de complétion
const toggleTaskCompleted = async (task) => {
  try {
    const updatedTask = await $fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { completed: !task.completed }
    });
    
    // Mettre à jour la tâche dans la liste
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask };
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de complétion:', error);
  }
};

const handleTaskFormClose = async () => {
  if (createTaskFormRef.value?.handleClose) {
    await createTaskFormRef.value.handleClose();
  } else {
    uiStore.closeTaskForm();
  }
};

const handleTaskFormComplete = () => {
  // Cette fonction est appelée quand l'auto-sauvegarde est terminée
  uiStore.closeTaskForm();
};

// Fermer les dropdowns quand on clique à l'extérieur
const handleClickOutside = (event) => {
  if (!event.target.closest('.status-dropdown')) {
    openStatusDropdown.value = null;
  }
  if (!event.target.closest('.priority-dropdown')) {
    openPriorityDropdown.value = null;
  }
};

// Chargement initial
onMounted(() => {
  loadTasks();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/mixins' as *;


.tasks-page {
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .archives-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    // padding: 10px 16px;
    background-color: #6b7280;
    color: white;
    // border: none;
    // border-radius: 4px;
    // font-size: 14px;
    // font-weight: 500;
    // cursor: pointer;
    // transition: all 0.2s;

    // &:hover {
    //   background-color: #4b5563;
    //   // transform: translateY(-1px);
    // }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.form-section {
  // Le formulaire est maintenant en position fixed, plus besoin de styles spéciaux
}

.tasks-section {
  h2 {
    margin-bottom: 20px;
    color: #333;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.tasks-container {
  background: white;
  border-radius: 4px;
  box-shadow:0 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: auto;
  max-height: calc(100vh - 314px);
  display: flex;
  flex-direction: column;
}

.tasks-header {
  display: grid;
  grid-template-columns: 0.2fr 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  padding: 0 12px;
  min-height: 48px;
  align-items: center;
  flex-shrink: 0;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 6px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  span.active {
    color: #007bff;
  }

  &:hover {
    color: #007bff;
  }

  span:first-child {
    white-space: nowrap;
  }
}

.sort-indicator {
  display: flex;
  align-items: center;
  margin-left: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;

  &.sort-asc,
  &.sort-desc {
    opacity: 1;
    color: #007bff;
  }
}

.tasks-body {
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c3c6;
    border-radius: 4px;
  }
}

.task-row {
  display: grid;
  grid-template-columns: 0.2fr 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid #dee2e6;
  transition: all 0.2s;
  min-height: 60px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
    // transform: translateY(-2px);
  }

  &:last-child {
    border-bottom: none;
  }

  &.completed {
    opacity: 0.5;
    
    .task-info .name {
      text-decoration: line-through;
    }
  }
}

.task-cell {
  padding: 12px 6px;
  overflow: hidden;
}

.checkbox-cell {
  min-width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  cursor: pointer;
  accent-color: #10b981;
}

.name-cell {
  min-width: 200px;
}

.status-cell {
  min-width: 120px;
  position: relative;

  .status-dropdown {
    position: relative;
    cursor: pointer;

    .status-badge {
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .status-dropdown-menu {
      position: fixed;
      z-index: 9999;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      max-height: 250px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #c0c3c6;
        border-radius: 4px;
      }

      .status-dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;

        &:first-child {
          border-radius: 4px 4px 0 0;
        }

        &:last-child {
          border-radius: 0 0 4px 4px;
        }

        &:hover {
          background-color: #f3f4f6;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 2px;

          &.status-waiting_for_info {
            background-color: #f87171;
          }

          &.status-blocked {
            background-color: #f22121;
          }

          &.status-todo {
            background-color: #fb923c;
          }

          &.status-in_progress {
            background-color: #d97706;
          }

          &.status-processed_preprod {
            background-color: #7dd3fc;
          }

          &.status-processed_prod {
            background-color: #f9a8d4;
          }

          &.status-to_validate {
            background-color: #fde047;
          }

          &.status-validated {
            background-color: #bef264;
          }

          &.status-cancelled {
            background-color: #a3a3a3;
          }

          &.status-to_timer {
            background-color: #e9d5ff;
          }

          &.status-done {
            background-color: #a3e635;
          }
        }
      }
    }
  }
}

.creator-cell {
  min-width: 150px;
}

.date-cell {
  min-width: 100px;
  font-size: 14px;
  color: #495057;
  white-space: nowrap;
}

.priority-cell {
  min-width: 100px;
  position: relative;

  .priority-dropdown {
    position: relative;
    cursor: pointer;

    .priority-badge {
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .priority-dropdown-menu {
      position: fixed;
      z-index: 9999;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
      min-width: 140px;
      max-height: 250px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #c0c3c6;
        border-radius: 4px;
      }

      .priority-dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;

        &:first-child {
          border-radius: 4px 4px 0 0;
        }

        &:last-child {
          border-radius: 0 0 4px 4px;
        }

        &:hover {
          background-color: #f3f4f6;
        }

        .priority-indicator {
          font-size: 12px;

          &.priority-low {
            color: #86efac;
          }

          &.priority-medium {
            color: #facc15;
          }

          &.priority-high {
            color: #fb923c;
          }

          &.priority-urgent {
            color: #f87171;
          }
        }
      }
    }
  }
}

.project-cell {
  min-width: 120px;
}

.client-cell {
  min-width: 120px;
}

.actions-cell {
  min-width: 80px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 60px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: #495057;
}

.empty-subtext {
  font-size: 14px;
  color: #6c757d;
  max-width: 300px;
  line-height: 1.4;
}

.task-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .task-icon {
    font-size: 12px;
    margin-top: 2px;

    &.priority-urgent {
      color: #f87171;
    }

    &.priority-high {
      color: #fb923c;
    }

    &.priority-medium {
      color: #facc15;
    }

    &.priority-low {
      color: #86efac;
    }
  }

  .name {
    font-weight: 500;
    color: #212529;
    margin-bottom: 4px;
  }

  .description {
    font-size: 12px;
    color: #6c757d;
    // max-width: 200px;
    // max-width: 330px;
    max-width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  &.status-waiting_for_info {
    background-color: #f87171;
    color: white;
  }

  &.status-blocked {
    background-color: #f22121;
    color: white;
  }

  &.status-todo {
    background-color: #fb923c;
    color: white;
  }

  &.status-in_progress {
    background-color: #d97706;
    color: white;
  }

  &.status-processed_preprod {
    background-color: #7dd3fc;
    color: #0c4a6e;
  }

  &.status-processed_prod {
    background-color: #f9a8d4;
    color: #831843;
  }

  &.status-to_validate {
    background-color: #fde047;
    color: #713f12;
  }

  &.status-validated {
    background-color: #bef264;
    color: #365314;
  }

  &.status-cancelled {
    background-color: #a3a3a3;
    color: white;
  }

  &.status-to_timer {
    background-color: #e9d5ff;
    color: #581c87;
  }

  &.status-done {
    background-color: #a3e635;
    color: #365314;
  }
}

.priority-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  &.priority-low {
    background-color: #86efac;
    color: #15803d;
  }

  &.priority-medium {
    background-color: #fde047;
    color: #a16207;
  }

  &.priority-high {
    background-color: #fb923c;
    color: white;
  }

  &.priority-urgent {
    background-color: #f87171;
    color: white;
  }
}

.user-info {
  .name {
    font-weight: 500;
    color: #212529;
    margin-bottom: 2px;
  }

  .email {
    font-size: 12px;
    color: #6c757d;
  }

  .created-by-me {
    font-size: 10px;
    color: #9ca3af;
    font-style: italic;
    margin-top: 2px;
  }
}

.task-created,
.task-due {
  font-size: 14px;
  color: #495057;
  white-space: nowrap;
}

.no-date {
  color: #6c757d;
  font-style: italic;
}

.project-info {
  .project-name {
    font-weight: 500;
    color: #212529;
    margin-bottom: 2px;
    font-size: 14px;
  }

  .project-description {
    font-size: 12px;
    color: #6c757d;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.no-project {
  color: #6c757d;
  font-style: italic;
  font-size: 14px;
}

.client-info {
  .client-name {
    font-weight: 500;
    color: #212529;
    margin-bottom: 2px;
    font-size: 14px;
  }

  .client-company {
    font-size: 12px;
    color: #6c757d;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.no-client {
  color: #6c757d;
  font-style: italic;
  font-size: 14px;
}



.actions-group {
  display: flex;
  gap: 8px;

  button {
    padding: 6px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .edit-btn {
    background-color: #e9ecef;

    &:hover {
      background-color: #dee2e6;
    }
  }

  .delete-btn {
    background-color: #f8d7da;

    &:hover {
      background-color: #f5c6cb;
    }
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .tasks-container {
    // height: calc(100vh - 280px);
    margin: 0 -20px;
    border-radius: 0;
  }

  .tasks-header {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr;
    gap: 8px;
    padding: 0 8px;
    min-height: 44px;
  }

  .header-cell {
    padding: 8px 4px;
    font-size: 12px;
  }

  .task-row {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr;
    gap: 8px;
    padding: 0 8px;
    min-height: 56px;
  }

  .task-cell {
    padding: 8px 4px;
  }

  .name-cell {
    min-width: 120px;
  }

  .status-cell {
    min-width: 80px;
  }

  .creator-cell {
    min-width: 100px;
  }

  .date-cell {
    min-width: 80px;
    font-size: 12px;
  }

  .priority-cell {
    min-width: 70px;
  }

  .project-cell {
    min-width: 80px;
  }

  .client-cell {
    min-width: 80px;
  }

  .actions-cell {
    min-width: 60px;
  }

  .task-info .description {
    max-width: 120px;
  }

  .user-info {
    .name {
      font-size: 12px;
    }

    .email {
      font-size: 10px;
    }
  }

  .empty-content {
    .empty-icon {
      font-size: 36px;
    }

    .empty-text {
      font-size: 16px;
    }
  }

  .actions-group {
    button {
      padding: 4px;
      font-size: 12px;
    }
  }
}
</style>
