<script setup lang="ts">
import { ref, onMounted, computed, useAttrs, watch } from 'vue';
import InputError from '@/components/form/InputError.vue';

const props = defineProps<{
    label?: string;
    error?: string | string[] | null;
    hint?: string;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean;
    required?: boolean;
}>();

// The model should be a string in 'YYYY-MM-DD' format
const model = defineModel<string | null>();

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (inputRef.value?.hasAttribute('autofocus')) {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                inputRef.value?.focus();
            }
        }, 100);
    }
});

const attrs = useAttrs();
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
const inputId = computed(() => (attrs.id as string) ?? `date-input-${Math.random().toString(36).substring(2, 11)}`);

defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <label v-if="computedLabel" :for="inputId" class="label">
            {{ computedLabel }}
            <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
        </label>

        <div class="relative">
            <input
                :id="inputId"
                type="date"
                class="input"
                :class="{
                    'invalid-input': !!error,
                    'dirty-input': isDirty,
                    'text-gray-500 dark:text-gray-400': !model
                }"
                :aria-invalid="!!error"
                v-bind="$attrs"
                v-model="model"
                ref="inputRef"
                :required="props.required"
            />
        </div>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>

<style scoped>
/* Improve native date picker styling consistency */
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}
.dark input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>