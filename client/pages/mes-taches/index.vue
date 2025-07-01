<template>
  <div class="tasks-page">
    <div class="header">
      <button @click="showForm = !showForm" class="toggle-form-btn">
        {{ showForm ? 'Masquer le formulaire' : 'Ajouter une tâche' }}
      </button>
    </div>

    <!-- Formulaire de création -->
    <div v-if="showForm" class="form-section">
      <CreateTaskForm @task-created="onTaskCreated" />
    </div>

    <!-- Liste des tâches -->
    <div class="tasks-section">
      <div v-if="loadingTasks" class="loading">
        Chargement des tâches...
      </div>

      <div v-else class="table-container">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>Nom de la tâche</th>
              <th>Statut</th>
              <th>Créé par</th>
              <th>Créé le</th>
              <th>À faire le</th>
              <th>Projets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Message si aucune tâche -->
            <tr v-if="tasks.length === 0" class="empty-row">
              <td colspan="7" class="empty-message">
                <div class="empty-content">
                  <div class="empty-icon">📝</div>
                  <div class="empty-text">Aucune tâche trouvée</div>
                  <div class="empty-subtext">Créez votre première tâche en cliquant sur le bouton ci-dessus</div>
                </div>
              </td>
            </tr>

            <!-- Lignes des tâches -->
            <tr v-else v-for="task in tasks" :key="task.id" class="task-row">
              <!-- Nom de la tâche -->
              <td class="task-name">
                <div class="task-info">
                  <span class="task-icon" :class="`priority-${task.priority}`">●</span>
                  <div>
                    <div class="name">{{ task.name }}</div>
                    <div v-if="task.description" class="description">{{ task.description }}</div>
                  </div>
                </div>
              </td>

              <!-- Statut -->
              <td class="task-status">
                <span class="status-badge" :class="`status-${task.status}`">
                  {{ getStatusText(task.status) }}
                </span>
              </td>

              <!-- Créé par -->
              <td class="task-creator">
                <div class="user-info">
                  <div class="name">{{ task.created_by.first_name }} {{ task.created_by.last_name }}</div>
                  <div class="email">{{ task.created_by.email }}</div>
                </div>
              </td>

              <!-- Créé le -->
              <td class="task-created">
                {{ formatDate(task.created_at) }}
              </td>

              <!-- À faire le -->
              <td class="task-due">
                <div v-if="task.start_date">
                  {{ formatDate(task.start_date) }}
                </div>
                <div v-else class="no-date">
                  Non planifié
                </div>
              </td>

              <!-- Projets -->
              <td class="task-project">
                <span class="project-placeholder">-</span>
              </td>

              <!-- Actions -->
              <td class="task-actions">
                <div class="actions-group">
                  <button @click="editTask(task)" class="edit-btn" title="Modifier">
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="delete-btn" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CreateTaskForm from '~/components/CreateTaskForm.vue';

definePageMeta({
  middleware: 'auth'
});

// État
const showForm = ref(false);
const tasks = ref([]);
const loadingTasks = ref(true);

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
  showForm.value = false;
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
.tasks-page {
  padding: 20px;
  max-width: 1400px;
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

.toggle-form-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
}

.form-section {
  margin-bottom: 40px;
  height: 60vh;
  overflow: scroll;
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

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  overflow-x: auto;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th {
    background-color: #f8f9fa;
    padding: 15px 12px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    font-size: 14px;
    white-space: nowrap;
  }

  td {
    padding: 15px 12px;
    border-bottom: 1px solid #dee2e6;
    vertical-align: top;
  }
}

.task-row {
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
}

.empty-row {
  .empty-message {
    text-align: center;
    padding: 60px 20px;
    border: none;
  }

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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

  .table-container {
    margin: 0 -20px;
    border-radius: 0;
  }

  .tasks-table {
    font-size: 12px;

    th,
    td {
      padding: 10px 8px;
    }
  }

  .task-info .description {
    max-width: 120px;
  }

  .empty-content {
    .empty-icon {
      font-size: 36px;
    }

    .empty-text {
      font-size: 16px;
    }
  }
}
</style>
