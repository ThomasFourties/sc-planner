<template>
  <div class="form-container">
    <div class="form-header">
      <div class="left" @click="handleClose">
        <X />
      </div>
      <div class="right">
        <!-- <MarkCompletedButton v-model="form.status" @completed="handleTaskCompleted" :disabled="!taskId" /> -->
        <TaskActionsMenu v-if="taskId" :task-id="taskId" @share="handleShare" @duplicate="handleDuplicate"
          @export="handleExport" @archive="handleArchive" @delete="handleDelete" />
        <EllipsisVertical v-else />
      </div>
    </div>

    <div class="form-body" :class="{ 'completed': form.status === 'done' }">
      <div class="form-top">
        <input v-model="form.name" class="title-input"
          :placeholder="taskId ? 'Nom de la tâche' : 'Créer une nouvelle tâche'" required />

        <PrioritySelector v-model="form.priority" />
      </div>

      <div class="separator"></div>

      <UserSelector v-model="form.assigned_to_id" :users="users" label="Assigné à" />

      <DateSelector v-model="form.start_date" label="Échéance" />

      <StatusSelector v-model="form.status" />

      <TimeSelector v-model="form.duration" label="Durée estimée" :show-timezone="false" />

      <!-- <UserSelector v-model="createdBy" :users="[currentUser]" label="Créé par" :disabled="true" /> -->

      <div class="form-nav">
        <div v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['tab', { active: activeTab === tab.id }]">
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
      <div v-if="taskId && initialTask?.created_by" class="created-by-section">
        <div class="created-by-info">
          <div class="user-avatar"></div>
          <div class="user-details">
            <div class="user-name">{{ initialTask.created_by?.first_name || '' }} {{ initialTask.created_by?.last_name || '' }}</div>
            <div class="created-label">Créé par</div>
          </div>
        </div>
      </div>

      <!-- Messages d'erreur/succès -->
      <!-- <div v-if="error" class="error-message">{{ error }}</div> -->
      <!-- <div v-if="success" class="success-message">{{ success }}</div> -->

      <button v-if="!taskId" @click="handleSubmit" :disabled="loading || !form.name.trim()" class="submit-btn">
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

// Props
const props = defineProps({
  taskId: {
    type: [String, Number],
    default: null
  },
  initialTask: {
    type: Object,
    default: null
  }
});

// Émissions
const emit = defineEmits(['taskCreated', 'taskUpdated', 'closeComplete', 'taskDeleted']);

// Stores
const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);

// État du formulaire
const form = reactive({
  name: '',
  description: '',
  duration: null,
  assigned_to_id: null,
  start_date: null,
  priority: 'medium',
  status: 'todo'
});

// État de l'interface
const loading = ref(false);
const error = ref('');
const success = ref('');
const users = ref([]);
const activeTab = ref('description');
const createdBy = ref(null);

// État de la modal de confirmation
const showDeleteConfirm = ref(false);
const taskToDelete = ref(null);

// Configuration des onglets
const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'comments', label: 'Commentaires' },
  { id: 'history', label: 'Historique' }
];

// const mockFiles = ref([
//   {
//     id: 1,
//     name: 'Guidelines.pdf',
//     type: 'PDF',
//     thumbnail: 'https://picsum.photos/40/40?random=1'
//   },
//   {
//     id: 2,
//     name: 'Screenshot.png',
//     type: 'PNG',
//     thumbnail: 'https://picsum.photos/40/40?random=2'
//   }
// ]);

const loadTaskData = (task) => {
  Object.assign(form, {
    name: task.name || '',
    description: task.description || '',
    duration: task.duration || null,
    assigned_to_id: task.assigned_to_id || null,
    start_date: task.start_date || null,
    priority: task.priority || 'medium',
    status: task.status || 'todo'
  });
};

// Charger les données initiales
onMounted(async () => {
  await loadUsers();

  if (currentUser.value) {
    createdBy.value = currentUser.value.id;
  }

  if (props.taskId && props.initialTask) {
    loadTaskData(props.initialTask);
  }
});

// Watcher pour les changements de tâche initiale
watch(() => props.initialTask, (newTask) => {
  if (newTask) {
    loadTaskData(newTask);
  }
}, { immediate: true });

// Méthodes
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

    // Nettoyer les champs vides (mais garder les valeurs null explicites)
    if (taskData.duration === null || taskData.duration === undefined || taskData.duration === '') {
      taskData.duration = 0;
    } else {
      // S'assurer que duration est un nombre
      taskData.duration = Number(taskData.duration);
    }
    // Ne pas supprimer assigned_to_id car null est une valeur valide (pas d'assignation)
    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.description) delete taskData.description;

    let result;

    if (props.taskId) {
      // Modification d'une tâche existante
      result = await $fetch(`/api/tasks/${props.taskId}`, {
        method: 'PUT',
        body: taskData,
      });

      emit('taskUpdated', result);
    } else {
      // Création d'une nouvelle tâche
      result = await $fetch('/api/tasks', {
        method: 'POST',
        body: taskData,
      });

      emit('taskCreated', result);

      // Réinitialiser le formulaire pour une nouvelle création
      resetForm();
    }

    // Fermer la modal immédiatement après création/modification
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
    status: 'todo'
  });
  activeTab.value = 'description';
};

const handleFileUpload = () => {
  // TODO: Implémenter l'upload de fichiers avec S3
  console.log('Upload de fichier à implémenter');
};

// // Nouvelles méthodes pour les actions
// const handleTaskCompleted = (isCompleted) => {
//   if (isCompleted) {
//     success.value = 'Tâche marquée comme terminée !';
//   } else {
//     success.value = 'Tâche remise en cours !';
//   }
// };

const handleShare = (taskId) => {
  success.value = 'Lien de la tâche copié dans le presse-papiers !';
};

const handleDuplicate = (taskId) => {
  // Logique pour dupliquer la tâche
  console.log('Dupliquer la tâche:', taskId);
};

const handleExport = (taskId) => {
  // Logique pour exporter la tâche
  console.log('Exporter la tâche:', taskId);
};

const handleArchive = (taskId) => {
  // Logique pour archiver la tâche
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
      method: 'DELETE' 
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
    // Pour la création, on ne fait rien ici car handleSubmit() gère déjà la fermeture
    // On ferme seulement si le formulaire est vide
    emit('closeComplete');
  }
};

const autoSave = async () => {
  try {
    const taskData = { ...form };

    // Nettoyer les champs vides (mais garder les valeurs null explicites)
    if (taskData.duration === null || taskData.duration === undefined || taskData.duration === '') {
      taskData.duration = 0;
    } else {
      // S'assurer que duration est un nombre
      taskData.duration = Number(taskData.duration);
    }
    // Ne pas supprimer assigned_to_id car null est une valeur valide (pas d'assignation)
    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.description) delete taskData.description;

    // 1. Mettre à jour la tâche
    await $fetch(`/api/tasks/${props.taskId}`, {
      method: 'PUT',
      body: taskData,
    });

    // 2. Récupérer la tâche complète avec les relations
    const updatedTask = await $fetch(`/api/tasks/${props.taskId}`);

    emit('taskUpdated', updatedTask);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde automatique:', err);

    // Gestion d'erreur améliorée
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

// Exposer les méthodes pour les refs parent
defineExpose({
  handleClose
});
</script>

<style lang="scss">
@use '../../assets/scss/base/modal' as *;
</style>