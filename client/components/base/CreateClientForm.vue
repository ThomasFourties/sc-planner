<template>
  <div class="form-container">
    <div class="form-header no-border">
      <div class="left" @click="handleClose">
        <X />
      </div>
    </div>

    <div class="form-body alt-padding">
      <div class="form-top">
        <input v-model="form.name" class="title-input" placeholder="Nom du client" required />
      </div>

      <div class="separator"></div>

      <div class="field-group">
        <label class="label">Description :</label>
        <textarea v-model="form.description" placeholder="Description du client..." class="description-textarea" rows="3" />
      </div>

      <div class="field-group">
        <MultiUserSelector v-model="form.user_ids" :users="users" label="Personnes associées" />
      </div>

      <!-- <div class="hours-section">
        <div class="field-group half">
          <label class="label">Heures vendues :</label>
          <input v-model.number="form.soldHours" type="number" min="0" step="0.5" placeholder="0" class="hours-input" />
        </div>
        <div class="field-group half">
          <label class="label">Heures consommées :</label>
          <input v-model.number="form.spentHours" type="number" min="0" step="0.5" placeholder="0" class="hours-input" />
        </div>
      </div> -->

      <div class="website-section">
        <div class="field-group half">
          <label class="label">Site web (prod) :</label>
          <input v-model="form.websiteProd" type="url" placeholder="https://..." class="website-input" />
        </div>
        <div class="field-group half">
          <label class="label">Site web (préprod) :</label>
          <input v-model="form.websitePreprod" type="url" placeholder="https://..." class="website-input" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="handleSubmit" class="btn btn-primary" :disabled="!form.name || loading">
          {{ loading ? 'Création...' : 'Créer le client' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import MultiUserSelector from '~/components/form/MultiUserSelector.vue';

const emit = defineEmits(['client-created', 'close']);

const form = ref({
  name: '',
  description: '',
  user_ids: [],
  soldHours: null,
  spentHours: null,
  websiteProd: '',
  websitePreprod: '',
});

const users = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/users');
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err);
  }
};

const handleClose = () => {
  emit('close');
};

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Le nom du client est requis';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const clientData = {
      name: form.value.name.trim(),
      description: form.value.description || null,
      website_prod: form.value.websiteProd || null,
      website_preprod: form.value.websitePreprod || null,
      user_ids: form.value.user_ids, // ✅ assignation directe
    };

    const newClient = await $fetch('/api/clients', {
      method: 'POST',
      body: clientData,
    });

    success.value = 'Client créé avec succès !';
    emit('client-created', newClient);
    navigateTo(`/clients/${newClient.id}`);
  } catch (err) {
    error.value = err.data?.message || 'Erreur lors de la création du client';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/modal' as *;
</style>
