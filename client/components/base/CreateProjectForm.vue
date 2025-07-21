<template>
  <div class="create-project">
    <div class="project-header">
      <div class="left" @click="handleClose">
        <X />
      </div>
      <div class="right">
        <EllipsisVertical />
      </div>
    </div>

    <div class="project-body">
      <div class="project-top">
        <input 
          v-model="form.name" 
          class="project-title-input"
          placeholder="Nom du projet" 
          required 
        />
      </div>

      <div class="separator"></div>

      <div class="field-group">
        <label class="label">Description :</label>
        <textarea 
          v-model="form.description" 
          placeholder="Description du projet..." 
          class="description-textarea"
          rows="3"
        />
      </div>

      <div class="status-section">
        <div class="field-group half">
          <label class="label">Statut :</label>
          <select v-model="form.status" class="status-select">
            <option value="planning">Planification</option>
            <option value="in_progress">En cours</option>
            <option value="on_hold">En pause</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div class="field-group half">
          <label class="label">Date de début :</label>
          <input 
            v-model="form.start_date" 
            type="date"
            class="date-input"
          />
        </div>
      </div>

      <div class="dates-section">
        <div class="field-group half">
          <label class="label">Date de fin :</label>
          <input 
            v-model="form.end_date" 
            type="date"
            class="date-input"
          />
        </div>
        <div class="field-group half">
          <!-- Espace pour équilibrer la mise en page -->
        </div>
      </div>

      <div class="hours-section">
        <div class="field-group half">
          <label class="label">Heures vendues :</label>
          <input 
            v-model.number="form.sold_hours" 
            type="number" 
            min="0"
            step="0.5"
            placeholder="0"
            class="hours-input"
          />
        </div>
        <div class="field-group half">
          <label class="label">Heures consommées :</label>
          <input 
            v-model.number="form.spent_hours" 
            type="number" 
            min="0"
            step="0.5"
            placeholder="0"
            class="hours-input"
          />
        </div>
      </div>

      <div class="separator"></div>

      <!-- Messages d'erreur/succès -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <div class="form-actions">
        <button @click="handleClose" class="btn btn-secondary">
          Annuler
        </button>
        <button @click="handleSubmit" class="btn btn-primary" :disabled="!form.name || loading">
          {{ loading ? 'Création...' : 'Créer le projet' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X, EllipsisVertical } from 'lucide-vue-next';

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['project-created', 'close']);

// État du formulaire
const form = ref({
  name: '',
  description: '',
  status: 'planning',
  start_date: '',
  end_date: '',
  sold_hours: null,
  spent_hours: null,
  client_id: props.clientId
});

const loading = ref(false);
const error = ref('');
const success = ref('');

// Fermer le formulaire
const handleClose = () => {
  emit('close');
};

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Le nom du projet est requis';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    // Préparer les données
    const projectData = {
      name: form.value.name.trim(),
      description: form.value.description || null,
      status: form.value.status,
      start_date: form.value.start_date || null,
      end_date: form.value.end_date || null,
      sold_hours: form.value.sold_hours || 0,
      spent_hours: form.value.spent_hours || 0,
      client_id: props.clientId
    };

    // Créer le projet
    const newProject = await $fetch('/api/projects', {
      method: 'POST',
      body: projectData
    });

    success.value = 'Projet créé avec succès !';
    
    setTimeout(() => {
      emit('project-created', newProject);
    }, 1000);

  } catch (err) {
    error.value = err.data?.message || 'Erreur lors de la création du projet';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.create-project {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;

    .left {
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f3f4f6;
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .right svg {
      width: 20px;
      height: 20px;
      color: #6b7280;
    }
  }

  .project-body {
    padding: 24px;

    .project-top {
      margin-bottom: 24px;

      .project-title-input {
        width: 100%;
        font-size: 24px;
        font-weight: 600;
        border: none;
        outline: none;
        background: transparent;
        color: $black;
        padding: 8px 0;

        &::placeholder {
          color: #9ca3af;
        }

        &:focus {
          outline: 2px solid $blue;
          outline-offset: 2px;
          border-radius: 4px;
        }
      }
    }

    .separator {
      height: 1px;
      background: #e5e7eb;
      margin: 24px 0;
    }

    .field-group {
      margin-bottom: 20px;

      &.half {
        width: calc(50% - 8px);
        display: inline-block;
        
        &:first-child {
          margin-right: 16px;
        }
      }

      .label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: $black;
        margin-bottom: 8px;
      }

      .description-textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        color: $black;
        resize: vertical;
        min-height: 80px;

        &:focus {
          outline: none;
          border-color: $blue;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        &::placeholder {
          color: #9ca3af;
        }
      }

      .status-select,
      .date-input,
      .hours-input {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        color: $black;

        &:focus {
          outline: none;
          border-color: $blue;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }

      .status-select {
        background: white;
        cursor: pointer;
      }
    }

    .status-section,
    .dates-section,
    .hours-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;

      @include down(md) {
        flex-direction: column;
        gap: 0;

        .field-group.half {
          width: 100%;
          margin-right: 0;
        }
      }
    }

    .error-message {
      color: #dc2626;
      font-size: 14px;
      padding: 12px;
      background: #fef2f2;
      border-radius: 8px;
      border: 1px solid #fca5a5;
      margin-bottom: 20px;
    }

    .success-message {
      color: #059669;
      font-size: 14px;
      padding: 12px;
      background: #f0fdf4;
      border-radius: 8px;
      border: 1px solid #6ee7b7;
      margin-bottom: 20px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;

      .btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &.btn-secondary {
          background: #f9fafb;
          color: #374151;
          border: 1px solid #d1d5db;

          &:hover {
            background: #f3f4f6;
          }
        }

        &.btn-primary {
          background: $blue;
          color: white;
          border: 1px solid $blue;

          &:hover {
            background: darken($blue, 10%);
          }

          &:disabled {
            background: #9ca3af;
            border-color: #9ca3af;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style> 