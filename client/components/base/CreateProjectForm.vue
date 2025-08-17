<template>
  <div class="form-container">
    <div class="form-header">
      <div class="left" @click="handleClose">
        <X />
      </div>
      <div class="right">
        <EllipsisVertical />
      </div>
    </div>

    <div class="form-body">
      <div class="form-top">
        <input v-model="form.name" class="title-input" placeholder="Nom du projet" required />
      </div>

      <div class="separator"></div>

      <div class="dates-section">
        <div class="field-group half">
          <label class="label">Date de début :</label>
          <input v-model="form.start_date" type="date" class="date-input" />
        </div>
        <div class="field-group half">
          <label class="label">Date de fin :</label>
          <input v-model="form.end_date" type="date" class="date-input" />
        </div>
      </div>

      <div class="hours-section">
        <div class="field-group half">
          <label class="label">Heures vendues :</label>
          <input v-model.number="form.sold_hours" type="number" min="0" step="0.5" placeholder="0"
            class="hours-input" />
        </div>
        <div class="field-group half">
          <label class="label">Heures consommées :</label>
          <input v-model.number="form.spent_hours" type="number" min="0" step="0.5" placeholder="0"
            class="hours-input" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="handleSubmit" class="btn btn-primary" :disabled="!form.name || loading" aria-label="Créer le projet">
          {{ loading ? 'Création...' : 'Créer le projet' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
    emit('project-created', newProject);

  } catch (err) {
    error.value = err.data?.message || 'Erreur lors de la création du projet';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/modal' as *;
</style>