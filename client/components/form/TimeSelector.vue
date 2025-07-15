<template>
  <div class="time-selector">
    <label class="label">{{ label }} :</label>
    <div class="time-input-wrapper">
      <div class="duration-controls">
        <button @click="decrement" class="control-btn" :disabled="internalValue <= 0">
          <Minus :size="16" />
        </button>
        
        <div class="duration-display">
          <input 
            v-model="displayValue" 
            @input="handleManualInput"
            @blur="validateInput"
            class="duration-input"
            type="number"
            step="0.5"
            min="0"
            placeholder="0"
          />
          <span class="unit">h</span>
        </div>
        
        <button @click="increment" class="control-btn">
          <Plus :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Plus, Minus } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0
  },
  label: {
    type: String,
    default: 'Durée estimée'
  },
  step: {
    type: Number,
    default: 0.5
  }
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get() {
    const value = props.modelValue;
    return typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const displayValue = ref(internalValue.value.toString());

const increment = () => {
  const newValue = Math.round((internalValue.value + props.step) * 2) / 2;
  internalValue.value = newValue;
  displayValue.value = newValue.toString();
};

const decrement = () => {
  const newValue = Math.max(0, Math.round((internalValue.value - props.step) * 2) / 2);
  internalValue.value = newValue;
  displayValue.value = newValue.toString();
};

const handleManualInput = (event) => {
  const value = parseFloat(event.target.value) || 0;
  if (value >= 0) {
    internalValue.value = value;
  }
};

const validateInput = (event) => {
  const value = parseFloat(event.target.value);
  if (isNaN(value) || value < 0) {
    displayValue.value = internalValue.value.toString();
  } else {
    displayValue.value = value.toString();
    internalValue.value = value;
  }
};

// Synchroniser displayValue avec internalValue
watch(() => props.modelValue, (newValue) => {
  const value = typeof newValue === 'string' ? parseFloat(newValue) || 0 : newValue || 0;
  displayValue.value = value.toString();
}, { immediate: true });
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.time-selector {
  display: flex;
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

    .duration-controls {
      display: flex;
      align-items: center;
      gap: 2px;
      background-color: #f2f2f2;
      border-radius: 6px;
      padding: 2px;

      .control-btn {
        display: flex;
        align-items: center;
        padding: 0;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        color: #6b7280;

        &:hover:not(:disabled) {
          background-color: #e5e7eb;
          color: $black;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        svg {
          width: 16px;
          height: 16px;
          stroke-width: 2;
        }
      }

      .duration-display {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 8px;

        .duration-input {
          width: 60px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          color: $black;
          text-align: center;
          outline: none;

          // Masquer les flèches spinner
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          &[type=number] {
            -moz-appearance: textfield;
          }

          &::placeholder {
            color: #9ca3af;
          }
        }

        .unit {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }
      }
    }
  }
}
</style>