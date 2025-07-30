<template>
  <div class="priority-selector">
    <label class="label">Priorité :</label>
    <div class="priority-dropdown" @click="toggleDropdown" ref="dropdown">
      <div class="selected-priority" :class="`priority-${modelValue}`">
        <Flag :size="16" />
        {{ getPriorityLabel(modelValue) }}
        <ChevronDown :size="16" />
      </div>

      <div v-if="isOpen" class="dropdown-menu">
        <div v-for="priority in priorities" :key="priority.value" @click="selectPriority(priority.value)"
          class="dropdown-item" :class="`priority-${priority.value}`">
          <Flag :size="16" />
          {{ priority.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Flag, ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'medium'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdown = ref(null);

const priorities = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Élevée' }, 
  { value: 'urgent', label: 'Urgente' }
];

const getPriorityLabel = (value) => {
  return priorities.find(p => p.value === value)?.label || 'Moyenne';
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectPriority = (value) => {
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

.priority-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;
  margin-top: 10px;

  .label {
    min-width: fit-content;
  }

  .priority-dropdown {
    position: relative;
    cursor: pointer;

    .selected-priority {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s;

      &.priority-low {
        background-color: #f0fdf4;
        color: #166534;
      }

      &.priority-medium {
        background-color: #fefce8;
        color: #ca8a04;
      }

      &.priority-high {
        background-color: #fef3c7;
        color: #ea580c;
      }

      &.priority-urgent {
        background-color: #fef2f2;
        color: #dc2626;
      }

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
      border-radius: 4px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      width: 120px;
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
        border-radius: 4px;
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

        svg {
          width: 20px;
          height: 20px;
          stroke-width: 1.5;
        }

        &:first-child {
          border-radius: 4px 4px 0 0;
        }

        &:last-child {
          border-radius: 0 0 4px 4px;
        }

        &.priority-low {
          color: #166534;

          &:hover {
            background-color: #f0fdf4;
          }
        }

        &.priority-medium {
          color: #ca8a04;

          &:hover {
            background-color: #fefce8;
          }
        }

        &.priority-high {
          color: #ea580c;

          &:hover {
            background-color: #fef3c7;
          }
        }

        &.priority-urgent {
          color: #dc2626;

          &:hover {
            background-color: #fef2f2;
          }
        }
      }
    }
  }
}
</style>