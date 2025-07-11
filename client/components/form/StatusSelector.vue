<template>
  <div class="status-selector">
    <label class="label">Statut :</label>
    <div class="status-dropdown" @click="toggleDropdown" ref="dropdown">
      <div class="selected-status" :class="`status-${modelValue}`">
        <div class="status-square" :class="`status-${modelValue}`"></div>
        {{ getStatusLabel(modelValue) }}
        <ChevronDown :size="16" />
      </div>
      
      <div v-if="isOpen" class="dropdown-menu">
        <div 
          v-for="status in statuses" 
          :key="status.value"
          @click="selectStatus(status.value)"
          class="dropdown-item"
          :class="`status-${status.value}`"
        >
          <div class="status-square" :class="`status-${status.value}`"></div>
          {{ status.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'todo'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdown = ref(null);

const statuses = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'waiting_for_info', label: 'En attente d\'informations' },
  { value: 'blocked', label: 'Bloqué' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'to_validate', label: 'À valider' },
  { value: 'validated', label: 'Validé' },
  { value: 'to_timer', label: 'À timer' },
  { value: 'processed_prod', label: 'Traité en prod' },
  { value: 'processed_preprod', label: 'Traité en préprod' },
  { value: 'done', label: 'Terminé' }
];

const getStatusLabel = (value) => {
  return statuses.find(s => s.value === value)?.label || 'À faire';
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectStatus = (value) => {
  emit('update:modelValue', value);
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

.status-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;

  .label {
    min-width: fit-content;
  }

  .status-dropdown {
    position: relative;
    cursor: pointer;

    .selected-status {
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

      &:hover {
        opacity: 0.8;
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
      // min-width: 140px;
      width: 185px;
      margin-top: 4px;

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

  .status-square {
    width: 8px;
    height: 8px;
    border-radius: 2px;

    &.status-waiting_for_info {
      background-color: #f87171;
    }

    &.status-blocked {
      background-color: #f22121;
    }

    &.status-todo {
      background-color: #fb923c;
    }

    &.status-in_progress {
      background-color: #d97706;
    }

    &.status-processed_preprod {
      background-color: #7dd3fc;
    }

    &.status-processed_prod {
      background-color: #f9a8d4;
    }

    &.status-to_validate {
      background-color: #fde047;
    }

    &.status-validated {
      background-color: #bef264;
    }

    &.status-cancelled {
      background-color: #a3a3a3;
    }

    &.status-to_timer {
      background-color: #e9d5ff;
    }

    &.status-done {
      background-color: #a3e635;
    }
  }
}
</style> 