<!-- <template>
  <div class="create-task-form">
    <div class="form-header">
      <button type="button" @click="$emit('close')" class="close-btn" title="Fermer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/200/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <input class="input-task-name" id="name" v-model="form.name" type="text" required
          placeholder="Nom de la tâche" />
      </div>

      <div class="form-group">
        <label for="assigned_to">Responsable</label>
        <select id="assigned_to" v-model="form.assigned_to_id">
          <option value="">Personne (non assigné)</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.first_name }} {{ user.last_name }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start_date">Echéance</label>
          <input id="start_date" v-model="form.start_date" type="datetime-local" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start_date">Projets</label>
          <input id="start_date" v-model="form.start_date" />
        </div>
      </div>

      <div class="form-group">
        <label for="duration">Durée estimée (heures)</label>
        <input id="duration" v-model.number="form.duration" type="number" min="0" step="0.5" placeholder="Ex: 8" />
      </div>

      <div class="form-group">
        <label for="priority">Priorité</label>
        <select id="priority" v-model="form.priority">
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select id="status" v-model="form.status">
          <option value="todo">À faire</option>
          <option value="not_started">Non commencé</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
          <option value="blocked">Bloqué</option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" rows="3"
          placeholder="Description détaillée de la tâche..."></textarea>
      </div>


      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <button type="submit" :disabled="loading" class="submit-btn">
        <span v-if="loading">Création...</span>
        <span v-else>Créer la tâche</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// Props et émissions
const emit = defineEmits(['taskCreated', 'close']);

// État du formulaire
const form = reactive({
  name: '',
  description: '',
  duration: null,
  assigned_to_id: '',
  start_date: '',
  end_date: '',
  priority: 'medium',
  status: 'todo',
});

// État de l'interface
const loading = ref(false);
const error = ref('');
const success = ref('');
const users = ref([]);

// Charger les utilisateurs au montage
onMounted(async () => {
  try {
    users.value = await $fetch('/api/users');
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err);
  }
});

// Soumettre le formulaire
const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    // Préparer les données
    const taskData = { ...form };

    // Nettoyer les champs vides
    if (!taskData.duration) taskData.duration = 0;
    if (!taskData.assigned_to_id) delete taskData.assigned_to_id;
    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.end_date) delete taskData.end_date;
    if (!taskData.description) delete taskData.description;

    // Créer la tâche
    const newTask = await $fetch('/api/tasks', {
      method: 'POST',
      body: taskData,
    });

    success.value = 'Tâche créée avec succès !';

    // Réinitialiser le formulaire
    Object.assign(form, {
      name: '',
      description: '',
      duration: null,
      assigned_to_id: '',
      start_date: '',
      end_date: '',
      priority: 'medium',
      status: 'todo',
    });

    // Émettre l'événement
    emit('taskCreated', newTask);

  } catch (err) {
    error.value = err.data?.message || err.message || 'Erreur lors de la création de la tâche';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.create-task-form {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 60px);
  max-width: 55vw;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #333;
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;

}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }

  input,
  textarea,
  select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: fit-content;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  .input-task-name {
    font-size: 30px;
    border: none;
    outline: none;
    border-radius: 0;
    width: 100%;
    padding: 10px;
    // border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  }

  textarea {
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: 0;
}

.success-message {
  color: #28a745;
  font-size: 14px;
  margin: 0;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
}
</style> -->

<template>
  <div class="create-task">
    <div class="task-header">
      <div class="left">
        <X />
      </div>

      <div class="right">
        <EllipsisVertical />
      </div>
    </div>

    <div class="task-body">
      <div class="task-top">
        <h2>Créer une nouvelle tâche</h2>
        <p class="priority">Priorité : <span>
            <Flag /> Moyenne
          </span></p>
      </div>
      <div class="separator"></div>
      <p class="assigned-to">Assigné à : <span><i class="pdp"></i> John Doe</span></p>
      <p class="due-date">Echéance : <span>2021-01-01</span></p>
      <p class="status">Statut : <span> <i class="square"></i> À faire</span></p>
      <p class="duration">Durée estimée : <span>8 heures</span></p>
      <p class="created-by">Créé par : <span><i class="pdp"></i> John Doe</span></p>
      <div class="task-nav">
        <div class="description active">Description</div>
        <div class="comments">Commentaires</div>
        <div class="history">Historique</div>
      </div>

      <textarea placeholder="Description de la tâche" class="description-textarea" />
      <div class="separator"></div>
      <div class="task-footer">
        <div class="files">
          <p>Fichier</p>

          <div class="files-list">
            <div class="file">
              <div class="left">
                <img src="https://picsum.photos/200/200" alt="pdf" />
              </div>

              <div class="right">
                <p class="file-name">Guideline.pdf</p>
                <div class="footer">
                  <p class="file-type">PDF —</p>
                  <a href="#" class="download">Télécharger</a>
                </div>
              </div>

            </div>

            <div class="file">
              <div class="left">
                <img src="https://picsum.photos/200/200" alt="pdf" />
              </div>

              <div class="right">
                <p class="file-name">Screenshot.png</p>
                <div class="footer">
                  <p class="file-type">PNG —</p>
                  <a href="#" class="download">Télécharger</a>
                </div>
              </div>
            </div>

            <div class="add-file">
              <Plus />
            </div>
          </div>
        </div>

        <button class="submit-btn">Créer la tâche</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, EllipsisVertical, Plus, Flag } from 'lucide-vue-next';

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
  border-radius: 8px;

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .left,
    .right {
      cursor: pointer;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    .left {
      svg {
        stroke-width: 1.5;
      }
    }
  }

  .task-body {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .task-top {
      display: flex;
      flex-direction: column;
      gap: 5px;

      h2 {
        margin-bottom: 0;
      }

    }

    .separator {
      width: 100%;
      height: 1px;
      background-color: #e0e0e0;
    }

    .description-textarea {
      width: 100%;
      height: 100px;
      border-radius: 5px;
      border: none;
      padding: 15px;
      resize: none;
      background-color: #f2f2f2;
    }

    .priority,
    .assigned-to,
    .due-date,
    .status,
    .duration,
    .created-by {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      font-weight: 500;
      color: #6b6b6b;
      width: 10%;

      span {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        background-color: #f2f2f2;
        border-radius: 4px;
        font-size: 12px;
        color: $black;
        font-weight: 400;

        .square {
          width: 8px;
          height: 8px;
          background: red;
          border-radius: 2px;
        }

        .pdp {
          width: 15px;
          height: 15px;
          background: red;
          border-radius: 50px;
        }

        svg {
          width: 15px;
        }
      }
    }

    .task-nav {
      display: flex;
      gap: 20px;
      width: 100%;

      div {
        cursor: pointer;
        padding: 10px;

        &.active {
          font-weight: 600;
          border-bottom: 1px solid $black;
        }
      }
    }

    .task-footer {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .files {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .files-list {
          display: flex;
          gap: 10px;

          .file {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            width: fit-content;
            padding: 5px 20px 5px 5px;
            border: 1px solid #cecece;
            border-radius: 4px;

            .left {
              width: 40px;
              aspect-ratio: 1/1;
              height: 40px;


              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .right {
              width: 100%;

              .file-name {
                font-size: 12px;
                font-weight: 600;
              }

              .file-type {
                font-size: 10px;
                color: $gray;
              }

              .download {
                font-size: 10px;
                color: $gray;
              }
            }

            .footer {
              display: flex;
              gap: 4px;
            }
          }


          .add-file {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border: 1px solid #cecece;
            border-radius: 4px;
            aspect-ratio: 1 / 1;
            width: 52px;

            svg {
              width: 20px;
              height: 20px;
              stroke-width: 1.5;
            }
          }
        }
      }
    }

    .submit-btn {
      align-self: flex-end;
      margin-top: 10px;
    }
  }
}
</style>