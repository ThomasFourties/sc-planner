<template>
  <div class="create-task">
    <div class="task-header">
      <div class="left" @click="$emit('close')">
        <X />
      </div>
      <div class="right">
        <MarkCompletedButton 
          v-model="form.status" 
          @completed="handleTaskCompleted"
          :disabled="!taskId"
        />
        <TaskActionsMenu 
          v-if="taskId"
          :task-id="taskId"
          @share="handleShare"
          @duplicate="handleDuplicate"
          @export="handleExport"
          @archive="handleArchive"
          @delete="handleDelete"
        />
        <EllipsisVertical v-else />
      </div>
    </div>

    <div class="task-body" :class="{ 'completed': form.status === 'done' }">
      <div class="task-top">
        <input v-model="form.name" class="task-title-input"
          :placeholder="taskId ? 'Nom de la tâche' : 'Créer une nouvelle tâche'" required />

        <PrioritySelector v-model="form.priority" />
      </div>

      <div class="separator"></div>

      <UserSelector v-model="form.assigned_to_id" :users="users" label="Assigné à" />

      <DateSelector v-model="form.start_date" label="Échéance" />

      <StatusSelector v-model="form.status" />

      <TimeSelector 
        v-model="form.duration" 
        label="Durée estimée"
        :show-timezone="false"
      />

      <UserSelector v-model="createdBy" :users="[currentUser]" label="Créé par" :disabled="true" />

      <div class="task-nav">
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

      <div class="task-footer">
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

        <!-- Messages d'erreur/succès -->
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <button @click="handleSubmit" :disabled="loading || !form.name.trim()" class="submit-btn">
          <span v-if="loading">
            {{ taskId ? 'Modification...' : 'Création...' }}
          </span>
          <span v-else>
            {{ taskId ? 'Modifier la tâche' : 'Créer la tâche' }}
          </span>
        </button>
      </div>
    </div>
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
const emit = defineEmits(['taskCreated', 'taskUpdated', 'close', 'taskDeleted']);

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

// Configuration des onglets
const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'comments', label: 'Commentaires' },
  { id: 'history', label: 'Historique' }
];

// Mock files (à remplacer par la vraie logique d'upload)
const mockFiles = ref([
  {
    id: 1,
    name: 'Guidelines.pdf',
    type: 'PDF',
    thumbnail: 'https://picsum.photos/40/40?random=1'
  },
  {
    id: 2,
    name: 'Screenshot.png',
    type: 'PNG',
    thumbnail: 'https://picsum.photos/40/40?random=2'
  }
]);

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

    // Nettoyer les champs vides
    if (!taskData.duration) taskData.duration = 0;
    if (!taskData.assigned_to_id) delete taskData.assigned_to_id;
    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.description) delete taskData.description;

    let result;

    if (props.taskId) {
      // Modification d'une tâche existante
      result = await $fetch(`/api/tasks/${props.taskId}`, {
        method: 'PUT',
        body: taskData,
      });

      success.value = 'Tâche modifiée avec succès !';
      emit('taskUpdated', result);
    } else {
      // Création d'une nouvelle tâche
      result = await $fetch('/api/tasks', {
        method: 'POST',
        body: taskData,
      });

      success.value = 'Tâche créée avec succès !';
      emit('taskCreated', result);

      // Réinitialiser le formulaire pour une nouvelle création
      resetForm();
    }

    // Fermer la modal après création/modification
    setTimeout(() => {
      emit('close');
    }, 1000);

  } catch (err) {
    error.value = err.data?.message || err.message ||
      `Erreur lors de la ${props.taskId ? 'modification' : 'création'} de la tâche`;
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

// Nouvelles méthodes pour les actions
const handleTaskCompleted = (isCompleted) => {
  if (isCompleted) {
    success.value = 'Tâche marquée comme terminée !';
  } else {
    success.value = 'Tâche remise en cours !';
  }
};

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
  emit('taskDeleted', taskId);
  emit('close');
};
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.create-task {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: $white;
  padding: 20px;
  width: 40vw;
  min-width: 700px;
  max-height: 90vh;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .left {
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f3f4f6;
      }

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.5;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 10px;

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.5;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
        }
      }
    }
  }

  .task-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: opacity 0.3s ease;

    &.completed {
      opacity: 0.4; // Effet d'opacité quand terminé
    }

    .task-top {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .task-title-input {
      font-size: 24px;
      font-weight: 700;
      border: none;
      outline: none;
      border-radius: 0;
      padding: 8px 0;
      background: transparent;
      color: $black;
      border-bottom: 2px solid transparent;
      transition: border-color 0.2s;

      &:focus {
        border-bottom-color: #3b82f6;
      }

      &::placeholder {
        color: #9ca3af;
        font-weight: 600;
      }
    }

    .separator {
      width: 100%;
      height: 1px;
      background-color: #e0e0e0;
    }

    .selected-user {
      svg {
        stroke-width: 1.5;
        width: 10px;
      }
    }

    .task-nav {
      display: flex;
      gap: 20px;
      width: 100%;
      border-bottom: 1px solid #e0e0e0;

      .tab {
        cursor: pointer;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;

        &.active {
          font-weight: 600;
          color: $black;
          border-bottom-color: $black;
        }

        &:hover:not(.active) {
          color: #374151;
        }
      }
    }

    .tab-content {
      .description-textarea {
        width: 100%;
        height: 100px;
        border-radius: 5px;
        border: 1px solid #e5e7eb;
        padding: 15px;
        resize: vertical;
        background-color: #f9fafb;
        font-size: 14px;
        line-height: 1.5;

        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }

      .placeholder-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        background-color: #f9fafb;
        border-radius: 5px;
        border: 1px dashed #d1d5db;

        p {
          color: #6b7280;
          font-style: italic;
          margin: 0;
        }
      }
    }

    .task-footer {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .files {
        display: flex;
        flex-direction: column;
        gap: 10px;

        >p {
          font-size: 14px;
          font-weight: 600;
          color: $black;
          margin: 0;
        }

        .files-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;

          .file {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px 8px 8px;
            border: 1px solid #cecece;
            border-radius: 4px;
            background: white;

            .left {
              width: 40px;
              height: 40px;
              border-radius: 4px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .right {
              .file-name {
                font-size: 12px;
                font-weight: 600;
                margin: 0 0 4px 0;
                color: $black;
              }

              .footer {
                display: flex;
                gap: 4px;
                align-items: center;

                .file-type,
                .download {
                  font-size: 10px;
                  color: #6b7280;
                  margin: 0;
                }

                .download {
                  text-decoration: none;
                  cursor: pointer;

                  &:hover {
                    color: #3b82f6;
                  }
                }
              }
            }
          }

          .add-file {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            border: 1px dashed #cecece;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 72px;

            &:hover {
              border-color: #3b82f6;
              background-color: #f8fafc;
            }

            svg {
              width: 20px;
              height: 20px;
              stroke-width: 1.5;
              color: #6b7280;
            }
          }
        }
      }

      .error-message {
        color: #dc2626;
        font-size: 14px;
        padding: 8px 12px;
        background: #fee2e2;
        border-radius: 6px;
        border: 1px solid #fca5a5;
      }

      .success-message {
        color: #059669;
        font-size: 14px;
        padding: 8px 12px;
        background: #d1fae5;
        border-radius: 6px;
        border: 1px solid #6ee7b7;
      }

      .submit-btn {
        align-self: flex-end;
        padding: 12px 24px;
        background-color: $black;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: #374151;
          transform: translateY(-1px);
        }

        &:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }
}
</style>