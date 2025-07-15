<template>
  <div class="user-selector">
    <label class="label">{{ label }} :</label>
    <div class="user-dropdown" @click="toggleDropdown" ref="dropdown">
      <div class="selected-user">
        <div v-if="selectedUser" class="user-info">
          <div class="user-avatar red"></div>
          {{ selectedUser.first_name }} {{ selectedUser.last_name }}
        </div>
        <div v-else class="empty-selection">
          <div class="user-avatar empty"></div>
          Aucun utilisateur
        </div>
        <ChevronDown :size="16" />
      </div>

      <div v-if="isOpen" class="dropdown-menu">
        <div @click="selectUser(null)" class="dropdown-item">
          <div class="user-avatar empty"></div>
          Aucun utilisateur
        </div>
        <div v-for="user in users" :key="user.id" @click="selectUser(user)" class="dropdown-item">
          <div class="user-avatar red"></div>
          {{ user.first_name }} {{ user.last_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  users: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Assigné à'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdown = ref(null);

const selectedUser = computed(() => {
  if (!props.modelValue) return null;
  return props.users.find(user => user.id === props.modelValue);
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectUser = (user) => {
  emit('update:modelValue', user ? user.id : null);
  isOpen.value = false;
};

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

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.user-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;

  .label {
    min-width: fit-content;
  }

  .user-dropdown {
    position: relative;
    cursor: pointer;

    .selected-user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background-color: #f2f2f2;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: $black;
      transition: all 0.2s;
      min-width: 150px;
      justify-content: space-between;

      .user-info,
      .empty-selection {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.5;
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 10;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #c0c3c6;
        border-radius: 10px;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:first-child {
          border-radius: 6px 6px 0 0;
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }

        &:hover {
          background-color: #f3f4f6;
        }
      }
    }
  }

  .user-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;

    &.red {
      background-color: #ef4444;
    }

    &.empty {
      background-color: #d1d5db;
      border: 2px dashed #9ca3af;
    }
  }
}
</style>