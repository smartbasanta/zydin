<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean | number | string;
  label: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return [true, 1, '1', 'true'].includes(props.modelValue);
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

// Generate a unique ID for ARIA attributes
const id = `toggle-switch-${Math.random().toString(36).substring(2, 9)}`;
</script>

<template>
  <div class="flex items-center justify-between" :class="{ 'opacity-50': disabled }">
    <!-- Label and Description -->
    <span class="flex flex-col">
      <label :for="id" class="font-medium text-gray-900 dark:text-white cursor-pointer">
        {{ label }}
      </label>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
    </span>

    <!-- The Switch -->
    <button
      :id="id"
      type="button"
      role="switch"
      :aria-checked="value"
      :disabled="disabled"
      @click="value = !value"
      :class="[
        value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
      ]"
    >
      <span
        aria-hidden="true"
        :class="[
          value ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        ]"
      ></span>
    </button>
  </div>
</template>