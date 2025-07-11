<template>
  <div class="time-selector">
    <label class="label">{{ label }} :</label>
    <div class="time-input-wrapper">
      <VDatePicker v-model="internalValue" mode="time" :timezone="timezone" :popover="{
        placement: 'bottom-start',
        keepVisibleOnInput: true
      }" @input="handleTimeChange">
        <template #default="{ inputValue, inputEvents, togglePopover }">
          <div class="time-display" @click="togglePopover">
            <Clock :size="16" />
            <span v-if="inputValue">{{ formatTimeValue(inputValue) }}</span>
            <span v-else class="placeholder">{{ placeholder }}</span>
          </div>
        </template>
      </VDatePicker>

      <!-- Affichage de la durée en heures -->
      <div v-if="durationHours" class="duration-hours">
        {{ durationHours }}h
      </div>
    </div>

    <!-- Option pour basculer entre local et UTC -->
    <div class="timezone-selector" v-if="showTimezone">
      <label class="timezone-label">
        <input type="radio" value="" v-model="timezone"> Local
      </label>
      <label class="timezone-label">
        <input type="radio" value="utc" v-model="timezone"> UTC
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Clock } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  label: {
    type: String,
    default: 'Durée estimée'
  },
  placeholder: {
    type: String,
    default: 'Sélectionner une durée'
  },
  showTimezone: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const timezone = ref('');

const internalValue = computed({
  get() {
    if (!props.modelValue) return null;

    // Convertir les heures en objet Date pour VCalendar
    const hours = typeof props.modelValue === 'string' ? parseFloat(props.modelValue) : props.modelValue;
    const date = new Date();
    date.setHours(Math.floor(hours));
    date.setMinutes((hours % 1) * 60);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  },
  set(value) {
    if (!value) {
      emit('update:modelValue', null);
      return;
    }

    // Convertir l'heure en nombre d'heures décimales
    const hours = value.getHours();
    const minutes = value.getMinutes();
    const totalHours = hours + (minutes / 60);

    emit('update:modelValue', totalHours);
  }
});

const durationHours = computed(() => {
  if (!props.modelValue) return null;
  const hours = typeof props.modelValue === 'string' ? parseFloat(props.modelValue) : props.modelValue;
  return hours.toFixed(2);
});

const formatTimeValue = (inputValue) => {
  if (!inputValue) return '';

  // Extraire les heures et minutes de la chaîne de temps
  const match = inputValue.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const totalHours = hours + (minutes / 60);
    return `${totalHours.toFixed(2)}h`;
  }

  return inputValue;
};

const handleTimeChange = (value) => {
  // Cette fonction est appelée quand l'utilisateur change l'heure
  // La logique est déjà gérée par le setter de internalValue
};
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.time-selector {
  display: flex;
  // flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;

  .label {
    min-width: fit-content;
  }

  .time-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;

    .time-display {
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

    .duration-hours {
      padding: 8px 12px;
      background-color: #e0f2fe;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
  }

  .timezone-selector {
    display: flex;
    gap: 15px;
    margin-top: 5px;

    .timezone-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: #6b7280;
      cursor: pointer;

      input[type="radio"] {
        margin: 0;
      }
    }
  }
}

// Override VCalendar styles pour le time picker
:deep(.vc-container) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.vc-time-picker) {
  padding: 12px;
}

:deep(.vc-time-select-group) {
  gap: 8px;
}

:deep(.vc-time-select) {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px;

  &:focus {
    border-color: $lightBlue;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}
</style>