<template>
  <div class="multi-user-selector">
    <label class="label">{{ label }} :</label>
    
    <!-- Utilisateurs sélectionnés -->
    <div v-if="selectedUsers.length > 0" class="selected-users">
      <div v-for="user in selectedUsers" :key="user.id" class="selected-user-tag">
        <div class="user-avatar"></div>
        <span class="user-name">{{ user.first_name }} {{ user.last_name }}</span>
        <button @click="removeUser(user.id)" class="remove-btn">
          <X :size="14" />
        </button>
      </div>
    </div>

    <!-- Dropdown de sélection -->
    <div class="user-dropdown" @click="toggleDropdown" ref="dropdown">
      <div class="dropdown-trigger">
        <div class="trigger-content">
          <div class="user-avatar empty"></div>
          {{ selectedUsers.length === 0 ? 'Aucun utilisateur sélectionné' : `Ajouter un utilisateur` }}
        </div>
        <ChevronDown :size="16" />
      </div>

      <div v-if="isOpen" class="dropdown-menu">
        <div v-if="availableUsers.length === 0" class="dropdown-item disabled">
          Tous les utilisateurs sont déjà sélectionnés
        </div>
        <div 
          v-for="user in availableUsers" 
          :key="user.id" 
          @click="selectUser(user)" 
          class="dropdown-item"
        >
          <div class="user-avatar"></div>
          {{ user.first_name }} {{ user.last_name }}
          <span class="user-role">{{ getRoleDisplay(user.role) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown, X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Utilisateurs'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdown = ref(null);

// Utilisateurs sélectionnés avec leurs infos complètes
const selectedUsers = computed(() => {
  return props.users.filter(user => props.modelValue.includes(user.id));
});

// Utilisateurs disponibles (non sélectionnés)
const availableUsers = computed(() => {
  return props.users.filter(user => !props.modelValue.includes(user.id));
});

// Sélectionner un utilisateur
const selectUser = (user) => {
  const newSelection = [...props.modelValue, user.id];
  emit('update:modelValue', newSelection);
  isOpen.value = false;
};

// Retirer un utilisateur
const removeUser = (userId) => {
  const newSelection = props.modelValue.filter(id => id !== userId);
  emit('update:modelValue', newSelection);
};

// Toggle dropdown
const toggleDropdown = () => {
  if (availableUsers.value.length > 0) {
    isOpen.value = !isOpen.value;
  }
};

// Affichage du rôle
const getRoleDisplay = (role) => {
  const roles = {
    'SALARIE': 'Salarié',
    'FREELANCE': 'Freelance',
    'CHEF_DE_PROJET': 'Chef de projet',
    'CLIENT': 'Client'
  };
  return roles[role] || role;
};

// Fermer le dropdown en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/_variables.scss' as *;

.multi-user-selector {
  margin-bottom: 20px;

  .label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: $black;
    margin-bottom: 8px;
  }

  .selected-users {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;

    .selected-user-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 14px;

      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        flex-shrink: 0;
      }

      .user-name {
        font-weight: 500;
        color: $black;
      }

      .remove-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 2px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover {
          background: #e5e7eb;
          color: $black;
        }
      }
    }
  }

  .user-dropdown {
    position: relative;

    .dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: $blue;
      }

      .trigger-content {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: $black;

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;

          &.empty {
            background: #e5e7eb;
          }
        }
      }

      svg {
        width: 16px;
        height: 16px;
        color: #6b7280;
        transition: transform 0.2s;
      }

      &:hover svg {
        transform: rotate(180deg);
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 50;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 4px;

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 14px;

        &:hover:not(.disabled) {
          background: #f9fafb;
        }

        &.disabled {
          color: #9ca3af;
          cursor: default;
          font-style: italic;
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .user-role {
          margin-left: auto;
          font-size: 12px;
          color: #6b7280;
          font-weight: 400;
        }
      }
    }
  }
}
</style> 