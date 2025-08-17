<template>
  <div class="form-container">
    <div class="form-header">
      <div class="left" @click="handleClose">
        <X />
      </div>
      <div class="right">
        <!-- <MarkCompletedButton v-model="form.status" @completed="handleTaskCompleted" :disabled="!taskId" /> -->
        <TaskActionsMenu v-if="taskId" :task-id="taskId" @share="handleShare" @duplicate="handleDuplicate" @export="handleExport" @archive="handleArchive" @delete="handleDelete" />
        <EllipsisVertical v-else />
      </div>
    </div>

    <div class="form-body">
      <div class="form-top">
        <input v-model="form.name" class="title-input" :placeholder="taskId ? 'Nom de la tâche' : 'Créer une nouvelle tâche'" required />

        <PrioritySelector v-model="form.priority" />
      </div>

      <div class="separator"></div>

      <div class="project-info">
        <div v-if="projectInfo">
          <div class="project-info-item">
            <label class="label"
              >Projet: <a :href="`/projects/${projectInfo.id}`">{{ projectInfo.name }}</a></label
            >
          </div>
          <div v-if="clientInfo" class="client-info-item">
            <label class="label"
              >Client: <a :href="`/clients/${clientInfo.id}`">{{ clientInfo.name }}</a></label
            >
          </div>
        </div>
        <div v-else>
          <label class="label">Aucun projet associé</label>
        </div>
      </div>

      <UserSelector v-model="form.assigned_to_id" :users="users" label="Assigné à" />

      <DateSelector v-model="form.start_date" label="Échéance" />

      <StatusSelector v-model="form.status" />

      <TimeSelector v-model="form.duration" label="Durée estimée" :show-timezone="false" />

      <!-- <UserSelector v-model="createdBy" :users="[currentUser]" label="Créé par" :disabled="true" /> -->

      <div class="form-nav">
        <div v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['tab', { active: activeTab === tab.id }]">
          {{ tab.label }}
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="tab-content">
        <!-- Description -->
        <div v-if="activeTab === 'description'">
          <textarea v-model="form.description" placeholder="Description de la tâche..." class="description-textarea" />
        </div>

        <!-- Commentaires -->
        <div v-else-if="activeTab === 'comments'" class="placeholder-content">
          <p>Fonctionnalité des commentaires en cours de développement...</p>
        </div>

        <!-- Historique -->
        <div v-else-if="activeTab === 'history'" class="placeholder-content">
          <p>Historique des modifications en cours de développement...</p>
        </div>
      </div>

      <div class="separator"></div>

      <div class="files">
        <p>Fichiers</p>
        <div class="files-list">
          <!-- Files placeholder - à implémenter avec S3 -->
          <div class="file" v-for="file in mockFiles" :key="file.id">
            <div class="left">
              <img :src="file.thumbnail" :alt="file.name" />
            </div>
            <div class="right">
              <p class="file-name">{{ file.name }}</p>
              <div class="footer">
                <p class="file-type">{{ file.type }} —</p>
                <a href="#" class="download">Télécharger</a>
              </div>
            </div>
          </div>

          <div class="add-file" @click="handleFileUpload">
            <Plus />
          </div>
        </div>
      </div>

      <!-- Créé par -->
      <!-- <div v-if="taskId && initialTask?.created_by" class="created-by-section">
        <div class="created-by-info">
          <div class="user-avatar"></div>
          <div class="user-details">
            <div class="user-name">{{ initialTask.created_by?.first_name || '' }} {{ initialTask.created_by?.last_name
              || '' }}</div>
            <div class="created-label">Créé par</div>
          </div>
        </div>
      </div> -->

      <!-- Messages d'erreur/succès -->
      <!-- <div v-if="error" class="error-message">{{ error }}</div> -->
      <!-- <div v-if="success" class="success-message">{{ success }}</div> -->

      <button v-if="!taskId" @click="handleSubmit" :disabled="loading || !form.name.trim()" class="submit-btn" aria-label="Créer la tâche">
        {{ loading ? 'Création...' : 'Créer la tâche' }}
      </button>

      <!-- <button v-else @click="handleSubmit" :disabled="loading || !form.name.trim()" class="submit-btn btn">
        Enregistrer les modifications
      </button> -->
    </div>

    <!-- Modal de confirmation de suppression -->
    <ConfirmModal
      :is-visible="showDeleteConfirm"
      title="Supprimer la tâche"
      message="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
      confirm-text="Supprimer"
      cancel-text="Annuler"
      :is-danger="true"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { X, EllipsisVertical, Plus } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import PrioritySelector from '~/components/form/PrioritySelector.vue';
import StatusSelector from '~/components/form/StatusSelector.vue';
import UserSelector from '~/components/form/UserSelector.vue';
import DateSelector from '~/components/form/DateSelector.vue';
import TimeSelector from '~/components/form/TimeSelector.vue';
import TaskActionsMenu from '~/components/form/TaskActionsMenu.vue';
import MarkCompletedButton from '~/components/form/MarkCompletedButton.vue';
import ConfirmModal from '~/components/base/ConfirmModal.vue';

const props = defineProps({
  taskId: {
    type: [String, Number],
    default: null,
  },
  initialTask: {
    type: Object,
    default: null,
  },
  projectId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['taskCreated', 'taskUpdated', 'closeComplete', 'taskDeleted']);

const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);

const form = reactive({
  name: '',
  description: '',
  duration: null,
  assigned_to_id: null,
  start_date: null,
  priority: 'medium',
  status: 'todo',
  project_id: props.projectId || null,
});

if (props.projectId) {
  form.project_id = props.projectId;
}

const loading = ref(false);
const error = ref('');
const success = ref('');
const users = ref([]);
const activeTab = ref('description');
const createdBy = ref(null);

const projectInfo = ref(null);
const clientInfo = ref(null);

const showDeleteConfirm = ref(false);
const taskToDelete = ref(null);

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'comments', label: 'Commentaires' },
  { id: 'history', label: 'Historique' },
];

const loadTaskData = (task) => {
  Object.assign(form, {
    name: task.name || '',
    description: task.description || '',
    duration: task.duration || null,
    assigned_to_id: task.assigned_to_id || null,
    start_date: task.start_date || null,
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    project_id: task.project_id || props.projectId || null,
  });

  if (task.project) {
    projectInfo.value = task.project;
    if (task.project.client) {
      clientInfo.value = task.project.client;
    }
  }
};

const loadProjectInfo = async (projectId) => {
  if (!projectId) return;

  try {
    const project = await $fetch(`/api/projects/${projectId}`);
    projectInfo.value = project;
    if (project.client) {
      clientInfo.value = project.client;
    } else {
      clientInfo.value = null;
    }
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error);
  }
};

onMounted(async () => {
  await loadUsers();

  if (currentUser.value) {
    createdBy.value = currentUser.value.id;
  }

  if (props.taskId && props.initialTask) {
    loadTaskData(props.initialTask);
  } else if (props.initialTask) {
    loadTaskData(props.initialTask);
  } else if (props.projectId) {
    await loadProjectInfo(props.projectId);
  }
});

watch(
  () => props.projectId,
  async (newProjectId) => {
    if (newProjectId && !props.taskId) {
      await loadProjectInfo(newProjectId);
    }
  }
);

watch(
  () => props.initialTask,
  (newTask) => {
    if (newTask) {
      loadTaskData(newTask);
    }
  },
  { immediate: true }
);

const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/users');
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err);
  }
};

const handleSubmit = async () => {
  if (!form.name.trim()) {
    error.value = 'Le nom de la tâche est requis';
    return;
  }

  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const taskData = { ...form };

    if (taskData.duration === null || taskData.duration === undefined || taskData.duration === '') {
      taskData.duration = 0;
    } else {
      taskData.duration = Number(taskData.duration);
    }

    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.description) delete taskData.description;

    let result;

    if (props.taskId) {
      result = await $fetch(`/api/tasks/${props.taskId}`, {
        method: 'PUT',
        body: taskData,
      });

      emit('taskUpdated', result);
    } else {
      result = await $fetch('/api/tasks', {
        method: 'POST',
        body: taskData,
      });

      emit('taskCreated', result);

      resetForm();
    }

    emit('closeComplete');
  } catch (err) {
    console.error('Erreur détaillée:', err);
    let errorMessage = `Erreur lors de la ${props.taskId ? 'modification' : 'création'} de la tâche`;

    if (err.data?.message) {
      errorMessage = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message;
    } else if (err.statusMessage && typeof err.statusMessage === 'string') {
      errorMessage = err.statusMessage;
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message;
    }

    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    duration: null,
    assigned_to_id: null,
    start_date: null,
    priority: 'medium',
    status: 'todo',
    project_id: props.projectId || form.project_id,
  });
  activeTab.value = 'description';
};

const handleFileUpload = () => {
  console.log('Upload de fichier à implémenter');
};

const handleShare = (taskId) => {
  success.value = 'Lien de la tâche copié dans le presse-papiers !';
};

const handleDuplicate = (taskId) => {
  console.log('Dupliquer la tâche:', taskId);
};

const handleExport = (taskId) => {
  console.log('Exporter la tâche:', taskId);
};

const handleArchive = (taskId) => {
  console.log('Archiver la tâche:', taskId);
};

const handleDelete = (taskId) => {
  taskToDelete.value = taskId;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!taskToDelete.value) return;

  try {
    loading.value = true;
    await $fetch(`/api/tasks/${taskToDelete.value}`, {
      method: 'DELETE',
    });

    emit('taskDeleted', taskToDelete.value);
    emit('closeComplete');
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    error.value = 'Erreur lors de la suppression de la tâche';
  } finally {
    loading.value = false;
    showDeleteConfirm.value = false;
    taskToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  taskToDelete.value = null;
};

const handleClose = async () => {
  if (!form.name.trim()) return emit('closeComplete');

  if (props.taskId) {
    await autoSave();
    emit('closeComplete');
  } else {
    emit('closeComplete');
  }
};

const autoSave = async () => {
  try {
    const taskData = { ...form };

    if (taskData.duration === null || taskData.duration === undefined || taskData.duration === '') {
      taskData.duration = 0;
    } else {
      taskData.duration = Number(taskData.duration);
    }

    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.description) delete taskData.description;

    await $fetch(`/api/tasks/${props.taskId}`, {
      method: 'PUT',
      body: taskData,
    });

    const updatedTask = await $fetch(`/api/tasks/${props.taskId}`);

    emit('taskUpdated', updatedTask);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde automatique:', err);

    let errorMessage = 'Erreur lors de la sauvegarde automatique';
    if (err.data?.message) {
      errorMessage = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message;
    } else if (err.statusMessage && typeof err.statusMessage === 'string') {
      errorMessage = err.statusMessage;
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message;
    }

    error.value = errorMessage;
  }
};

defineExpose({
  handleClose,
});
</script>

<style lang="scss">
@use '../../assets/scss/base/modal' as *;

.project-info {
  margin-bottom: 20px;

  .project-info-item,
  .client-info-item {
    margin-bottom: 8px;

    .label {
      span {
        font-weight: 600;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .client-info-item {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #dee2e6;
  }
}
</style>
