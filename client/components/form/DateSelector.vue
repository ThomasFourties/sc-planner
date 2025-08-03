<template>
  <div class="field-group">
    <label class="label">{{ label }} :</label>
    <input v-model="dateValue" type="date" class="date-input" :placeholder="placeholder" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

const dateValue = computed({
  get() {
    if (!props.modelValue) return '';
    // Si c'est une Date, la convertir en string YYYY-MM-DD
    if (props.modelValue instanceof Date) {
      return props.modelValue.toISOString().split('T')[0];
    }
    // Si c'est déjà une string, la retourner
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value || null);
  }
});
</script>

<style scoped lang="scss">
@use '../../assets/scss/base/variables' as *;

.field-group {
  display: flex;
  // flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px !important;

  .label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0 !important;
    color: #6b6b6b;
  }

  .date-input {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 14px;
    color: $black;
    background-color: white;
    transition: border-color 0.2s;
    width: fit-content !important;

    &:focus {
      outline: none;
      border-color: $blue;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
}
</style>