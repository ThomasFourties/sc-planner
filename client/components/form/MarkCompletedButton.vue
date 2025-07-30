<template>
  <button 
    @click="toggleCompleted"
    class="mark-completed-btn"
    :class="{ 
      'completed': isCompleted,
      'disabled': disabled 
    }"
    :disabled="disabled"
  >
    <div class="btn-content">
      <div class="icon-wrapper">
        <Check v-if="isCompleted" :size="16" />
        <CheckCircle v-else :size="16" />
      </div>
      <span class="btn-text">
        {{ isCompleted ? 'Terminé' : 'Marquer comme terminé' }}
      </span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { Check, CheckCircle } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'todo'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'completed']);

const isCompleted = computed(() => {
  return props.modelValue === 'done';
});

const toggleCompleted = () => {
  if (props.disabled) return;

  const newStatus = isCompleted.value ? 'todo' : 'done';
  emit('update:modelValue', newStatus);
  emit('completed', newStatus === 'done');
};
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.mark-completed-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  
  &:not(.completed):not(.disabled) {
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      transform: translateY(-1px);
    }
    
    .icon-wrapper {
      color: #9ca3af;
    }
  }
  
  &.completed {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
    opacity: 0.4; // Effet d'opacité demandé
    
    &:hover {
      background-color: #bbf7d0;
      opacity: 0.6;
    }
    
    .icon-wrapper {
      color: #16a34a;
    }
    
    .btn-text {
      text-decoration: line-through;
    }
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      background-color: transparent;
    }
  }

  .btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  .btn-text {
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
}

// Animation pour l'icône
.mark-completed-btn:not(.disabled):active {
  transform: scale(0.95);
}

// Animation de succès
.mark-completed-btn.completed .icon-wrapper {
  animation: successPulse 0.3s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style> 