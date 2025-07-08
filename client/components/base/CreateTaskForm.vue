<template>
  <div class="create-task-form">
    <h2>Créer une nouvelle tâche</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Nom de la tâche -->
      <div class="form-group">
        <label for="name">Nom de la tâche *</label>
        <input id="name" v-model="form.name" type="text" required placeholder="Ex: Développer la page d'accueil" />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" rows="3"
          placeholder="Description détaillée de la tâche..."></textarea>
      </div>

      <!-- Durée estimée -->
      <div class="form-group">
        <label for="duration">Durée estimée (heures)</label>
        <input id="duration" v-model.number="form.duration" type="number" min="0" step="0.5" placeholder="Ex: 8" />
      </div>

      <!-- Assigné à -->
      <div class="form-group">
        <label for="assigned_to">Assigné à</label>
        <select id="assigned_to" v-model="form.assigned_to_id">
          <option value="">Personne (non assigné)</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.first_name }} {{ user.last_name }} ({{ user.email }})
          </option>
        </select>
      </div>

      <!-- Dates -->
      <div class="form-row">
        <div class="form-group">
          <label for="start_date">Date de début</label>
          <input id="start_date" v-model="form.start_date" type="datetime-local" />
        </div>

        <div class="form-group">
          <label for="end_date">Date de fin</label>
          <input id="end_date" v-model="form.end_date" type="datetime-local" />
        </div>
      </div>

      <!-- Priorité -->
      <div class="form-group">
        <label for="priority">Priorité</label>
        <select id="priority" v-model="form.priority">
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
        </select>
      </div>

      <!-- Statut -->
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

      <!-- Messages d'erreur/succès -->
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <!-- Bouton submit -->
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
const emit = defineEmits(['taskCreated']);

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
  position: absolute;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // max-width: 100%;
  width: calc(100% - 60px);
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
    color: #333;
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

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
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
</style>