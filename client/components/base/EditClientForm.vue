<template>
  <div class="edit-client">
    <div class="client-header">
      <div class="left" @click="handleClose">
        <X />
      </div>
      <div class="right">
        <EllipsisVertical />
      </div>
    </div>

    <div class="client-body">
      <div class="client-top">
        <input v-model="form.name" class="client-title-input" placeholder="Nom du client" required />
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

      <!-- Messages d'erreur seulement -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { X, EllipsisVertical } from 'lucide-vue-next';
import MultiUserSelector from '~/components/form/MultiUserSelector.vue';

const props = defineProps({
  client: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['closeComplete', 'client-updated']);

// Formulaire réactif pré-rempli avec les données du client
const form = reactive({
  name: props.client.name || '',
  description: props.client.description || '',
  userIds: [],
  websiteProd: props.client.website_prod || '',
  websitePreprod: props.client.website_preprod || '',
});

const users = ref([]);
const error = ref('');
const isInitialLoadComplete = ref(false);
const watcherEnabled = ref(false);

// Charger les utilisateurs
const loadUsers = async () => {
  try {
    console.log('Chargement des utilisateurs...');
    users.value = await $fetch('/api/users');
    console.log('Utilisateurs chargés:', users.value.length);
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err);
  }
};

// Charger les utilisateurs assignés au client
const loadClientUsers = async () => {
  try {
    console.log('Chargement des utilisateurs assignés au client...');
    const clientUsers = await $fetch(`/api/users/client/${props.client.id}`);
    form.userIds = clientUsers.map(user => user.id);
    console.log('Utilisateurs assignés chargés:', form.userIds);
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs du client:', err);
  }
};

// Auto-sauvegarde des informations du client (à la fermeture)
const autoSave = async () => {
  if (!form.name.trim()) {
    error.value = 'Le nom du client est requis';
    return;
  }

  error.value = '';

  try {
    // Préparer les données du client seulement
    const clientData = {
      name: form.name.trim(),
      description: form.description || null,
      website_prod: form.websiteProd || null,
      website_preprod: form.websitePreprod || null,
    };

    // Modifier le client
    const updatedClient = await $fetch(`/api/clients/${props.client.id}`, {
      method: 'PUT',
      body: clientData
    });

    console.log('Informations client sauvegardées avec succès');

    // Émettre l'événement avec le client mis à jour seulement à la fermeture
    emit('client-updated', updatedClient);

  } catch (err) {
    console.error('Erreur lors de la modification du client:', err);
    error.value = 'Erreur lors de la modification du client';
  }
};

// Fermeture avec auto-sauvegarde
const handleClose = async () => {
  console.log('=== FERMETURE DU FORMULAIRE ===');
  
  // Désactiver le watcher avant la fermeture
  watcherEnabled.value = false;
  
  // Sauvegarder les informations du client seulement si le nom est présent
  if (form.name.trim()) {
    await autoSave();
  }
  
  emit('closeComplete');
};

// Watcher pour sauvegarder automatiquement les changements d'utilisateurs
watch(() => form.userIds, async (newUserIds, oldUserIds) => {
  // Ne déclencher que si le watcher est activé et qu'il y a eu un vrai changement
  if (watcherEnabled.value && oldUserIds !== undefined && JSON.stringify(newUserIds) !== JSON.stringify(oldUserIds)) {
    console.log('Changement détecté dans les utilisateurs assignés:', newUserIds);
    
    // Désactiver temporairement le watcher
    watcherEnabled.value = false;
    
    try {
      await autoSaveUsers();
    } finally {
      // Réactiver le watcher après l'opération
      setTimeout(() => {
        watcherEnabled.value = true;
        console.log('Watcher réactivé');
      }, 1000);
    }
  }
}, { deep: true });

// Auto-sauvegarde spécifique pour les utilisateurs
const autoSaveUsers = async () => {
  try {
    console.log('Sauvegarde automatique des utilisateurs...');
    
    // Récupérer les utilisateurs actuellement assignés
    const currentUsers = await $fetch(`/api/users/client/${props.client.id}`);
    const currentUserIds = currentUsers.map(user => user.id);

    // Préparer les opérations d'assignation/désassignation
    const usersToUnassign = currentUserIds.filter(userId => !form.userIds.includes(userId));
    const usersToAssign = form.userIds.filter(userId => !currentUserIds.includes(userId));

    console.log('Utilisateurs à désassigner:', usersToUnassign);
    console.log('Utilisateurs à assigner:', usersToAssign);

    // Exécuter les désassignations
    if (usersToUnassign.length > 0) {
      const unassignPromises = usersToUnassign.map(async (userId) => {
        try {
          await $fetch(`/api/users/${userId}/unassign-client`, {
            method: 'PATCH'
          });
          console.log(`Utilisateur ${userId} désassigné avec succès`);
        } catch (err) {
          console.error(`Erreur lors de la désassignation de l'utilisateur ${userId}:`, err);
        }
      });

      await Promise.allSettled(unassignPromises);
    }

    // Exécuter les assignations
    if (usersToAssign.length > 0) {
      const assignPromises = usersToAssign.map(async (userId) => {
        try {
          await $fetch(`/api/users/${userId}/assign-client`, {
            method: 'PATCH',
            body: { clientId: props.client.id }
          });
          console.log(`Utilisateur ${userId} assigné avec succès`);
        } catch (err) {
          console.error(`Erreur lors de l'assignation de l'utilisateur ${userId}:`, err);
        }
      });

      await Promise.allSettled(assignPromises);
    }

         console.log('Assignations/désassignations terminées avec succès');
     
   } catch (err) {
     console.error('Erreur lors de la sauvegarde automatique des utilisateurs:', err);
     error.value = 'Erreur lors de la modification des utilisateurs';
   }
 };

// Chargement initial
onMounted(async () => {
  console.log('=== DÉBUT CHARGEMENT INITIAL ===');
  await loadUsers();
  await loadClientUsers();
  
  // Marquer la fin du chargement initial et activer le watcher
  setTimeout(() => {
    isInitialLoadComplete.value = true;
    watcherEnabled.value = true;
    console.log('=== CHARGEMENT INITIAL TERMINÉ - WATCHER ACTIVÉ ===');
  }, 1000);
});

// Exposer la méthode pour les refs parent
defineExpose({
  handleClose
});
</script>

<style lang="scss" scoped>
// Réutiliser les mêmes styles que CreateClientForm
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.edit-client {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  .client-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #E5E7EB;

    .left,
    .right {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #F3F4F6;
      }

      svg {
        color: #6B7280;
      }
    }
  }

  .client-body {
    padding: 24px;

    .client-top {
      margin-bottom: 24px;

      .client-title-input {
        width: 100%;
        border: none;
        outline: none;
        font-size: 24px;
        font-weight: 600;
        color: $black;
        background: transparent;
        padding: 0;

        &::placeholder {
          color: #D1D5DB;
        }
      }
    }

    .separator {
      height: 1px;
      background: #E5E7EB;
      margin-bottom: 24px;
    }

    .field-group {
      margin-bottom: 20px;

      &.half {
        width: calc(50% - 8px);
        display: inline-block;
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }
      }

      &.full {
        width: 100%;
      }

      .label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: $black;
        margin-bottom: 8px;
      }

      input,
      textarea {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: $blue;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        &::placeholder {
          color: #9CA3AF;
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }
    }

    .hours-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;

      @include down(sm) {
        flex-direction: column;
        gap: 0;
      }
    }

    .website-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;

      @include down(sm) {
        flex-direction: column;
        gap: 0;
      }
    }

    .contact-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;

      @include down(sm) {
        flex-direction: column;
        gap: 0;
      }
    }

    .error-message {
      background: #FEE2E2;
      color: #DC2626;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .success-message {
      background: #D1FAE5;
      color: #065F46;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .client-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;

      button {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .cancel-btn {
        background: white;
        color: #6B7280;
        border: 1px solid #D1D5DB;

        &:hover:not(:disabled) {
          background: #F9FAFB;
        }
      }

      .submit-btn {
        background: $blue;
        color: white;
        border: none;

        &:hover:not(:disabled) {
          background: #2563EB;
        }
      }
    }
  }
}
</style>