<template>
  <div class="tasks-page">
    <div class="header">
      <button @click="uiStore.toggleTaskForm()" class="toggle-form-btn">
        <Plus />
        Ajouter une tâche
      </button>
    </div>

    <!-- Overlay -->
    <Overlay :opacity="uiStore.isTaskFormVisible ? 1 : 0" @click="uiStore.closeTaskForm()" />

    <!-- Formulaire de création -->
    <div v-if="uiStore.isTaskFormVisible" class="form-section">
      <CreateTaskForm @task-created="onTaskCreated" @close="uiStore.closeTaskForm()" />
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
          <div class="header-cell creator-cell" @click="sortBy('created_by')">
            <span>Créé par</span>
            <div class="sort-indicator" :class="getSortClass('created_by')">
              <ChevronUp v-if="sortByField === 'created_by' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'created_by' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell date-cell" @click="sortBy('created_at')">
            <span>Créé le</span>
            <div class="sort-indicator" :class="getSortClass('created_at')">
              <ChevronUp v-if="sortByField === 'created_at' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'created_at' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell date-cell" @click="sortBy('start_date')">
            <span>À faire le</span>
            <div class="sort-indicator" :class="getSortClass('start_date')">
              <ChevronUp v-if="sortByField === 'start_date' && sortOrder === 'asc'" :size="14" />
              <ChevronDown v-else-if="sortByField === 'start_date' && sortOrder === 'desc'" :size="14" />
              <ChevronsUpDown v-else :size="14" />
            </div>
          </div>
          <div class="header-cell project-cell">
            <span>Projets</span>
          </div>
          <div class="header-cell actions-cell">
            <span>Actions</span>
          </div>
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
          <div v-else v-for="task in sortedTasks" :key="task.id" class="task-row">
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
            <div class="task-cell status-cell">
              <span class="status-badge" :class="`status-${task.status}`">
                {{ getStatusText(task.status) }}
              </span>
            </div>

            <!-- Créé par -->
            <div class="task-cell creator-cell">
              <div class="user-info">
                <div class="name">{{ task.created_by.first_name }} {{ task.created_by.last_name }}</div>
                <div class="email">{{ task.created_by.email }}</div>
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

            <!-- Projets -->
            <div class="task-cell project-cell">
              <span class="project-placeholder">-</span>
            </div>

            <!-- Actions -->
            <div class="task-cell actions-cell">
              <div class="actions-group">
                <button @click="editTask(task)" class="edit-btn" title="Modifier">
                  ✏️
                </button>
                <button @click="deleteTask(task.id)" class="delete-btn" title="Supprimer">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useUIStore } from '~/stores/ui';

definePageMeta({
  middleware: 'auth'
});

// Store
const uiStore = useUIStore();

// État
const tasks = ref([]);
const loadingTasks = ref(true);

// État du tri
const sortByField = ref('created_at');
const sortOrder = ref('asc'); // 'asc' ou 'desc'

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
        aValue = a.status || '';
        bValue = b.status || '';
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

// Formatage des textes
const getStatusText = (status) => {
  const statuses = {
    'todo': 'À faire',
    'not_started': 'Non commencé',
    'in_progress': 'En cours',
    'done': 'Terminé',
    'blocked': 'Bloqué'
  };
  return statuses[status] || status;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Actions sur les tâches
const editTask = (task) => {
  // TODO: Implémenter l'édition
  alert(`Édition de la tâche "${task.name}" - À implémenter`);
};

const deleteTask = async (taskId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    return;
  }

  try {
    await $fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    tasks.value = tasks.value.filter(task => task.id !== taskId);
  } catch (error) {
    alert('Erreur lors de la suppression de la tâche');
  }
};

// Chargement initial
onMounted(() => {
  loadTasks();
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    margin: 0;
    color: #333;
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
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100vh - 314px);
  display: flex;
  flex-direction: column;
}

.tasks-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr 0.8fr;
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
    border-radius: 10px;
  }
}

.task-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr 0.8fr;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s;
  min-height: 60px;
  align-items: center;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.task-cell {
  padding: 12px 6px;
  overflow: hidden;
}

.name-cell {
  min-width: 200px;
}

.status-cell {
  min-width: 120px;
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

.project-cell {
  min-width: 80px;
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

    &.priority-high {
      color: #dc3545;
    }

    &.priority-medium {
      color: #ffc107;
    }

    &.priority-low {
      color: #28a745;
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
    max-width: 200px;
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

  &.status-todo {
    background-color: #fff3cd;
    color: #856404;
  }

  &.status-not_started {
    background-color: #f8d7da;
    color: #721c24;
  }

  &.status-in_progress {
    background-color: #cce5ff;
    color: #004085;
  }

  &.status-done {
    background-color: #d1ecf1;
    color: #0c5460;
  }

  &.status-blocked {
    background-color: #f5c6cb;
    color: #721c24;
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

.project-placeholder {
  color: #6c757d;
  font-style: italic;
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
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 0.6fr;
    gap: 8px;
    padding: 0 8px;
    min-height: 44px;
  }

  .header-cell {
    padding: 8px 4px;
    font-size: 12px;
  }

  .task-row {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 0.6fr;
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

  .project-cell {
    min-width: 60px;
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
