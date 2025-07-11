<template>
  <div class="date-selector">
    <label class="label">{{ label }} :</label>
    <div class="date-input-wrapper">
      <VDatePicker v-model="internalValue" :masks="{ input: 'DD/MM/YYYY' }" mode="date" :popover="{
        placement: 'bottom-start',
        visibility: 'click'
      }" ref="datePicker">
        <template #default="{ inputValue, togglePopover }">
          <div class="date-display" @click="togglePopover">
            <Calendar :size="16" />
            <span v-if="inputValue">{{ inputValue }}</span>
            <span v-else class="placeholder">{{ placeholder }}</span>
          </div>
        </template>
      </VDatePicker>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Calendar } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  label: {
    type: String,
    default: 'Échéance'
  },
  placeholder: {
    type: String,
    default: 'Sélectionner une date'
  }
});

const emit = defineEmits(['update:modelValue']);

const datePicker = ref(null);

const internalValue = computed({
  get() {
    if (!props.modelValue) return null;
    return typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value ? value.toISOString().split('T')[0] : null);
  }
});
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;

  .label {
    min-width: fit-content;
  }

  .date-input-wrapper {
    .date-display {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background-color: #f2f2f2;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: $black;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 120px;

      button {
        background-color: transparent !important;
        border: none;
        cursor: pointer;
      }

      &:hover {
        opacity: 0.8;
      }

      .placeholder {
        color: #9ca3af;
        font-style: italic;
      }

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.5;
      }
    }
  }
}

// Override VCalendar styles
:deep(.vc-container) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.vc-header) {
  padding: 12px;
  height: auto;
  margin-top: 0;

  button {
    background-color: transparent !important;
  }

  .vc-title {
    color: $black;
    font-weight: 600;
  }

  .vc-arrow {
    color: $black;

    &:hover {
      background-color: #f3f4f6;
      color: $black;
    }
  }
}

:deep(button.vc-nav-item) {
  color: $black !important;
  background-color: transparent !important;
}

:deep(button.vc-nav-item.is-active) {
  color: $white !important;
  background-color: $blue !important;
}

:deep(.vc-day-content.vc-focusable.vc-focus.vc-attr.vc-attr.vc-highlight-content-solid.vc-blue) {
  color: $white !important;
  background-color: $blue !important;
}

:deep(.vc-nav-header) {
  button {
    background-color: transparent !important;
  }
}

:deep(.vc-weekday) {
  color: #6b7280;
  font-weight: 500;
}

:deep(.vc-day) {
  color: $black;

  &:hover {
    background-color: #f3f4f6;
  }

  &.is-selected {
    background-color: $black;
    color: white;
  }

  &.is-today {
    background-color: #f3f4f6;
    color: $black;
    font-weight: 600;
  }
}

:deep(.vc-nav) {
  .vc-nav-title {
    color: $black;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  .vc-nav-arrow {
    color: $black;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  .vc-nav-item {
    color: $black;

    &:hover {
      background-color: #f3f4f6;
    }

    &.is-active {
      background-color: $black;
      color: white;
    }
  }
}
</style>