<template>
  <div v-if="isVisible" class="confirm-modal-overlay" @click="handleOverlayClick">
    <div class="confirm-modal" @click.stop>
      <div class="modal-icon">
        <!-- <AlertTriangle /> -->
      </div>

      <div class="modal-content">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
      </div>

      <div class="modal-actions">
        <button @click="handleCancel" class="btn-cancel">
          {{ cancelText }}
        </button>
        <button @click="handleConfirm" class="btn-confirm" :class="{ 'danger': isDanger }">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Êtes-vous sûr de vouloir effectuer cette action ?'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  isDanger: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

const handleOverlayClick = () => {
  emit('cancel');
};
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  // backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}

.confirm-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  width: 90%;
  margin: 20px;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }

    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 16px;
  color: #f59e0b;
}

.modal-content {
  padding: 0 24px 16px;
  text-align: center;

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
  }

  .modal-message {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 24px;

  button {
    // padding: 8px 16px;
    // border-radius: 6px;
    // font-size: 14px;
    // font-weight: 500;
    // cursor: pointer;
    // transition: all 0.2s;
    // border: 1px solid transparent;
    // min-width: 80px;

    // &:focus {
    //   outline: none;
    //   box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    // }
  }

  .btn-cancel {
    background: #f9fafb;
    color: #374151;
    border-color: #d1d5db;

    // &:hover {
    //   background: #f3f4f6;
    //   border-color: #9ca3af;
    // }
  }

  .btn-confirm {
    background: #3b82f6;
    color: white;

    // &:hover {
    //   background: #2563eb;
    // }

    &.danger {
      background: #dc2626;

      // &:hover {
      //   background: #b91c1c;
      // }
    }
  }
}

@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
}
</style>