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
        <input v-model="form.name" class="title-input" placeholder="Nom du client" required />
      </div>

      <div class="separator"></div>

      <MultiUserSelector v-model="form.userIds" :users="users" label="Personnes associées" />

      <div class="field-group">
        <label class="label">Description :</label>
        <textarea v-model="form.description" placeholder="Description du client..." class="description-textarea"
          rows="3" />
      </div>

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
        <button @click="handleSubmit" class="btn btn-primary" :disabled="!form.name.trim() || loading" aria-label="Enregistrer les modifications du client">
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { X, EllipsisVertical } from 'lucide-vue-next';
import MultiUserSelector from '~/components/form/MultiUserSelector.vue';

const props = defineProps({
  client: { type: Object, required: true }
});

const emit = defineEmits(['closeComplete', 'client-updated']);

const form = reactive({
  name: props.client.name || '',
  description: props.client.description || '',
  userIds: [],
  websiteProd: props.client.website_prod || '',
  websitePreprod: props.client.website_preprod || ''
});

const users = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/users');
  } catch (err) {
    console.error('Erreur chargement users:', err);
  }
};

const loadClientUsers = async () => {
  try {
    const clientUsers = await $fetch(`/api/users/client/${props.client.id}`);
    form.userIds.splice(0, form.userIds.length, ...clientUsers.map(u => u.id));
  } catch (err) {
    console.error('Erreur chargement users client:', err);
  }
};

const handleSubmit = async () => {
  if (!form.name.trim()) {
    error.value = 'Le nom du client est requis';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const clientData = {
      name: form.name.trim(),
      description: form.description || null,
      website_prod: form.websiteProd || null,
      website_preprod: form.websitePreprod || null,
      user_ids: [...form.userIds],
    };

    const updatedClient = await $fetch(`/api/clients/${props.client.id}`, {
      method: 'PATCH',
      body: clientData
    });

    if (typeof updatedClient === 'string' || !updatedClient || !updatedClient.id) {
      console.error('Réponse invalide du serveur:', updatedClient);
      throw new Error('Réponse invalide du serveur');
    }

    success.value = 'Client modifié avec succès !';
    emit('client-updated', updatedClient);
    emit('closeComplete');

  } catch (err) {
    console.error('Erreur complète:', err);
    error.value = err.data?.message || err.message || 'Erreur lors de la modification du client';
  } finally {
    loading.value = false;
  }
};

const handleClose = async () => {
  if (!form.name.trim()) {
    emit('closeComplete');
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const clientData = {
      name: form.name.trim(),
      description: form.description || null,
      website_prod: form.websiteProd || null,
      website_preprod: form.websitePreprod || null,
      user_ids: [...form.userIds],
    };

    const updatedClient = await $fetch(`/api/clients/${props.client.id}`, {
      method: 'PATCH',
      body: clientData
    });

    if (typeof updatedClient === 'object' && updatedClient && updatedClient.id) {
      emit('client-updated', updatedClient);
    }

  } catch (err) {
    console.error('Erreur lors de la sauvegarde automatique:', err);
  } finally {
    loading.value = false;
    emit('closeComplete');
  }
};

onMounted(async () => {
  await loadUsers();
  await loadClientUsers();
});

defineExpose({ handleClose });
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/modal' as *;
</style>
