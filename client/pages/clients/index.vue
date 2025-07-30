<template>
  <div class="clients-dashboard">
    <header class="dashboard-header">
      <h1>Nos clients <span>({{ clients.length }})</span></h1>
      <button @click="openClientForm" class="add-client-btn btn">
        <Plus :size="16" />
        Ajouter un client
      </button>
    </header>

    <!-- Overlay -->
    <Overlay :opacity="showClientForm ? 1 : 0" @click="closeClientForm" />

    <!-- Formulaire de création de client -->
    <div v-if="showClientForm" class="form-section">
      <CreateClientForm @client-created="onClientCreated" @close="closeClientForm" />
    </div>

    <section class="clients-section">

      <div v-if="loadingClients" class="loading">
        Chargement des clients...
      </div>

      <div v-else class="clients-grid">
        <div v-for="client in clients" :key="client.id" class="client-card" @click="navigateToClient(client.id)">
          <div class="client-logo">
            <div v-if="client.logo" class="logo-img">
              <img :src="client.logo" :alt="client.name" />
            </div>
            <div v-else class="logo-placeholder" :style="{ backgroundColor: getRandomColor(client.id) }">
              {{ getInitials(client.name) }}
            </div>
          </div>

          <div class="client-info">
            <h3 class="client-name">{{ client.name || 'Client sans nom' }}</h3>
            <p class="client-description">{{ client.description || 'Aucune description' }}</p>

            <div class="contact-info" v-if="client.contact_email || client.website">
              <p v-if="client.contact_email" class="contact-email">{{ client.contact_email }}</p>
              <p v-if="client.website" class="contact-website">{{ client.website }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loadingClients && clients.length === 0" class="empty-state">
        <p>Aucun client trouvé</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next';
import CreateClientForm from '~/components/base/CreateClientForm.vue';

definePageMeta({
  middleware: 'auth'
});

// État
const clients = ref([]);
const loadingClients = ref(true);
const showClientForm = ref(false);

// Couleurs prédéfinies pour les avatars
const avatarColors = [
  '#4F46E5', '#06B6D4', '#8B5CF6', '#EF4444', '#10B981',
  '#F59E0B', '#3B82F6', '#EC4899', '#6366F1', '#14B8A6'
];

// Charger les clients
const loadClients = async () => {
  try {
    loadingClients.value = true;
    clients.value = await $fetch('/api/clients');
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error);
    clients.value = [];
  } finally {
    loadingClients.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (id) => {
  // Utilise l'ID pour générer une couleur consistante pour chaque client
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// Gestion du formulaire modal
const openClientForm = () => {
  showClientForm.value = true;
};

const closeClientForm = () => {
  showClientForm.value = false;
};

const onClientCreated = (newClient) => {
  const normalizedClient = {
    ...newClient,
    website: newClient.website_prod || newClient.website_preprod || '',
    contact_email: newClient.contact_email || '', // si dispo
  };
  clients.value.unshift(normalizedClient);
  showClientForm.value = false;
};

// Navigation vers le détail d'un client
const navigateToClient = (clientId) => {
  navigateTo(`/clients/${clientId}`);
};

// Chargement initial
onMounted(() => {
  loadClients();
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;
@use '../../assets/scss/utils/_mixins.scss' as *;

.clients-dashboard {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  @include down(md) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  h1 {
    // font-size: 32px;
    // font-weight: 600;
    color: $black;
    margin: 0;

    span {
      font-size: 16px;
      color: $gray;
    }
  }

  .add-client-btn {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.form-section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 600px;
}

.clients-section {
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: $black;
    margin-bottom: 24px;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6B7280;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6B7280;
  font-size: 16px;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  @include down(lg) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @include down(md) {
    grid-template-columns: 1fr;
  }
}

.client-card {
  background: white;
  border-radius: 4px;
  padding: 24px;
  border: 1px solid #E5E7EB;
  transition: all 0.1s ease;
  cursor: pointer;

  &:hover {
    //   transform: translateY(-2px);
    //   box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    border-color: $blue;
  }

  .client-logo {
    margin-bottom: 16px;

    .logo-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .logo-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .client-info {
    .client-name {
      font-size: 18px;
      font-weight: 600;
      color: $black;
      margin: 0 0 8px 0;
    }

    .client-description {
      font-size: 14px;
      color: #6B7280;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }

    .contact-info {

      .contact-email,
      .contact-website {
        font-size: 12px;
        color: #9CA3AF;
        margin: 4px 0;
      }

      .contact-website {
        text-decoration: underline;
      }
    }
  }
}
</style>