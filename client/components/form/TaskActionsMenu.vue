<template>
  <div class="task-actions-menu" ref="menuRef">
    <button @click="toggleMenu" class="menu-trigger" :class="{ 'active': isOpen }">
      <EllipsisVertical :size="20" />
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <div class="menu-item disabled" @click="handleShare">
        <Share2 />
        <span>Partager</span>
      </div>

      <div class="menu-item disabled" @click="handleDuplicate">
        <Copy />
        <span>Dupliquer</span>
      </div>

      <div class="menu-item disabled" @click="handleExport">
        <Download />
        <span>Exporter</span>
      </div>

      <div class="menu-separator"></div>

      <div class="menu-item disabled" @click="handleArchive">
        <Archive />
        <span>Archiver</span>
      </div>

      <div class="menu-item danger" @click="handleDelete">
        <Trash2 />
        <span>Supprimer</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  EllipsisVertical,
  Share2,
  Copy,
  Download,
  Archive,
  Trash2
} from 'lucide-vue-next';

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits([
  'share',
  'duplicate',
  'export',
  'archive',
  'delete'
]);

const isOpen = ref(false);
const menuRef = ref(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleShare = async () => {
  try {
    // Copier le lien dans le presse-papiers
    const taskUrl = `${window.location.origin}/tasks/${props.taskId}`;
    await navigator.clipboard.writeText(taskUrl);

    // Vous pouvez ajouter une notification ici
    console.log('Lien copié dans le presse-papiers');

    emit('share', props.taskId);
  } catch (error) {
    console.error('Erreur lors de la copie du lien:', error);
  }
  closeMenu();
};

const handleDuplicate = () => {
  emit('duplicate', props.taskId);
  closeMenu();
};

const handleExport = () => {
  emit('export', props.taskId);
  closeMenu();
};

const handleArchive = () => {
  emit('archive', props.taskId);
  closeMenu();
};

const handleDelete = () => {
  emit('delete', props.taskId);
  closeMenu();
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu();
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

.task-actions-menu {
  position: relative;
  display: inline-block;

  .menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;
    padding: 0;

    .lucide-ellipsis-vertical-icon {
      stroke-width: 2;
    }

    &:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    &.active {
      background-color: #e5e7eb;
      color: #111827;
    }

    svg {
      stroke-width: 1.5;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 50;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    margin-top: 4px;
    padding: 6px 0;
    animation: slideDown 0.15s ease-out;

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      // cursor: pointer;
      transition: all 0.2s;

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.5;
      }

      &:hover {
        background-color: #f9fafb;
      }

      &.danger {
        color: #dc2626;

        &:hover {
          background-color: #fef2f2;
        }
      }

      svg {
        stroke-width: 1.5;
        flex-shrink: 0;
      }

      span {
        flex: 1;
      }
    }

    .menu-separator {
      height: 1px;
      background-color: #e5e7eb;
      margin: 6px 0;
    }
  }
}
</style>