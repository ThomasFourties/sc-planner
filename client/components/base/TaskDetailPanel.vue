<template>
  <div class="task-detail-panel">
    <div class="task-header">
      <input v-model="editableTask.name" class="task-title-input" placeholder="Nom de la tâche" @keydown.ctrl.s.prevent="saveTask" />
      <button class="mark-completed-btn" :class="{ completed: editableTask.is_completed }" @click="toggleCompleted">
        <svg v-if="editableTask.is_completed" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ editableTask.is_completed ? 'Marqué comme terminé' : 'Marquer comme terminé' }}
      </button>
    </div>

    <div class="task-details">
      <div class="detail-section">
        <div class="detail-row">
          <label class="detail-label">Responsable</label>
          <select v-model="editableTask.assigned_to_id" class="detail-select">
            <option value="">Sélectionner un responsable</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}</option>
          </select>
        </div>

        <div class="detail-row">
          <label class="detail-label">À faire le</label>
          <input v-model="editableTask.start_date" type="date" class="detail-input" />
        </div>

        <div class="detail-row">
          <label class="detail-label">Créé par</label>
          <select v-model="editableTask.created_by_id" class="detail-select" disabled>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}</option>
          </select>
        </div>

        <div class="detail-row">
          <label class="detail-label">Client</label>
          <select v-model="editableTask.client_id" class="detail-select">
            <option value="">Sélectionner un client</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <div class="detail-row">
          <label class="detail-label">Projet</label>
          <select v-model="editableTask.project_id" class="detail-select">
            <option value="">Sélectionner un projet</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="detail-row">
          <label class="detail-label">Dépendance(s)</label>
          <select v-model="editableTask.dependency_id" class="detail-select">
            <option value="">Aucune dépendance</option>
            <option v-for="task in availableTasks" :key="task.id" :value="task.id">
              {{ task.name }}
            </option>
          </select>
        </div>

        <div class="detail-row detail-row--full">
          <label class="detail-label">Champs</label>
          <div class="fields-grid">
            <div class="field-item">
              <span class="field-label">Priorité</span>
              <select v-model="editableTask.priority" class="field-select">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
            <div class="field-item">
              <span class="field-label">Statut</span>
              <select v-model="editableTask.status" class="field-select">
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="blocked">Bloqué</option>
                <option value="done">Terminé</option>
              </select>
            </div>
            <div class="field-item">
              <span class="field-label">Estimation temps</span>
              <input v-model.number="editableTask.duration" type="number" placeholder="1100" class="field-input" />
            </div>
          </div>
        </div>

        <div class="detail-row detail-row--full">
          <label class="detail-label">Description</label>
          <textarea v-model="editableTask.description" class="description-textarea" placeholder="Ajouter une description..." rows="4"></textarea>
        </div>
      </div>

      <div class="activity-section">
        <h4 class="activity-title">Activité</h4>
        <div class="activity-list">
          <div class="activity-item">
            <span class="activity-user">Michel Bouquet</span>
            <span class="activity-action">a créé la tâche</span>
            <span class="activity-time">il y a {{ getTimeAgo(editableTask.created_at) }}</span>
          </div>
          <div v-if="editableTask.updated_at !== editableTask.created_at" class="activity-item">
            <span class="activity-user">Michel Bouquet</span>
            <span class="activity-action">a modifié cette tâche</span>
            <span class="activity-time">il y a {{ getTimeAgo(editableTask.updated_at) }}</span>
          </div>
        </div>

        <div class="collaborators">
          <span class="collaborators-label">Collaborateurs</span>
          <div class="collaborators-list">
            <div class="collaborator-avatar" style="background-color: #ef4444"></div>
            <div class="collaborator-avatar" style="background-color: $lightBlue"></div>
            <div class="collaborator-avatar" style="background-color: #10b981"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="task-actions">
      <button @click="saveTask" class="save-btn">Sauvegarder</button>
      <span class="save-shortcut">Ctrl + S</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

const editableTask = ref({
  ...props.task,
  is_completed: props.task.is_completed || false,
  start_date: props.task.start_date ? new Date(props.task.start_date).toISOString().split('T')[0] : '',
  client_id: props.task.client_id || '',
  project_id: props.task.project_id || '',
});

const users = ref([
  { id: '1', first_name: 'Thomas', last_name: 'Fourties' },
  { id: '2', first_name: 'Michel', last_name: 'Bouquet' },
  { id: '3', first_name: 'Étienne', last_name: 'Dumas' },
]);

const clients = ref([
  { id: '1', name: 'EURECIA' },
  { id: '2', name: 'TMA' },
  { id: '3', name: 'SUPERCOLOR' },
]);

const projects = ref([
  { id: '1', name: 'HELLO ASSO' },
  { id: '2', name: 'TFC' },
  { id: '3', name: 'THE SEA CLEANERS' },
]);

const availableTasks = computed(() => {
  return [];
});

const toggleCompleted = () => {
  editableTask.value.is_completed = !editableTask.value.is_completed;
  if (editableTask.value.is_completed) {
    editableTask.value.status = 'done';
  }
};

const saveTask = () => {
  if (editableTask.value.start_date) {
    editableTask.value.start_date = new Date(editableTask.value.start_date).toISOString();
  }

  emit('save', { ...editableTask.value });
};

const getTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'quelques secondes';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
  return `${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
};

const handleKeydown = (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveTask();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;

.task-detail-panel {
  width: 100%;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.task-title-input {
  flex: 1;
  font-size: 24px;
  font-weight: 600;
  border-radius: 0;
  border: none;
  outline: none;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;

  &:focus {
    border-bottom-color: $lightBlue;
  }
}

.mark-completed-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background-color: #f8fafc;
  }

  &.completed {
    background-color: #dcfce7;
    border-color: #16a34a;
    color: #15803d;
  }
}

.task-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 16px;

  &--full {
    grid-column: 1 / -1;
    display: block;
  }
}

.detail-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.detail-select,
.detail-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: $lightBlue;
    box-shadow: 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f8fafc;
    color: #64748b;
  }
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.field-select,
.field-input {
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: $lightBlue;
  }
}

.description-textarea {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: $lightBlue;
    box-shadow: 0 0 4px rgba(59, 130, 246, 0.1);
  }
}

.activity-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.activity-user {
  font-weight: 500;
  color: #374151;
}

.activity-action {
  color: #6b7280;
}

.activity-time {
  color: #9ca3af;
  font-size: 12px;
}

.collaborators {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collaborators-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.collaborators-list {
  display: flex;
  gap: 8px;
}

.collaborator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

.task-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.save-btn {
  padding: 12px 24px;
  background-color: $lightBlue;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
}

.save-shortcut {
  font-size: 12px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .task-details {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .task-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
