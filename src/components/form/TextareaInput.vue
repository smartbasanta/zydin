<script setup lang="ts">
import { ref, onMounted, computed, useAttrs } from 'vue';
import InputError from '@/components/form/InputError.vue';

const props = defineProps<{
    label?: string;
    error?: string | string[]; // Allow array for multiple error messages for one field
    hint?: string;
    maxLength?: number;
    rows?: number;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean; // To indicate if the input has been touched/modified by the user
}>();

const model = defineModel<string | null>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

onMounted(() => {
    if (textareaRef.value?.hasAttribute('autofocus')) {
        setTimeout(() => {
            // Ensure focus only if no other element has focus or body is focused
            if (!document.activeElement || document.activeElement === document.body) {
                textareaRef.value?.focus();
            }
        }, 100); // Small delay to ensure DOM is ready
    }
});

defineExpose({
    focus: () => {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                textareaRef.value?.focus();
            }
        }, 100);
    },
});

const attrs = useAttrs();

const capitalize = (str: string): string =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const computedLabel = computed(() => {
    // Prioritize explicit label prop
    if (props.label) return props.label;
    // Fallback to generating from 'name' attribute
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});

const maxLengthError = computed(() => {
    const value = model.value ?? '';
    if (props.maxLength && String(value).length > props.maxLength) {
        return `Max length of ${props.maxLength} characters exceeded.`;
    }
    return ''; // No error
});

const typedCharCount = computed(() => String(model.value ?? '').length);

// Ensure a unique ID for accessibility, fallback to random if not provided via attributes
const inputId = computed(() => (attrs.id as string) ?? `textarea-${Math.random().toString(36).substring(2, 11)}`);

// Prevent inheriting non-prop attributes onto the root div, they will be passed to textarea via v-bind="$attrs"
defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <!-- Label and Slots -->
        <div v-if="computedLabel || $slots['before-label'] || $slots['after-label']" class="flex gap-2 items-start">
            <slot name="before-label" />
            <label v-if="computedLabel" :for="inputId" class="label">
                {{ computedLabel }}
            </label>
            <slot name="after-label" />
        </div>

        <!-- Textarea and Character Counter -->
        <div class="relative">
            <textarea
                :id="inputId"
                class="input"
                :class="{
                    'invalid-input': error || maxLengthError, // Apply invalid style if error or maxLengthError
                    'dirty-input': isDirty, // Apply dirty style if provided
                }"
                :aria-invalid="!!(error || maxLengthError)"
                v-bind="$attrs"
                v-model="model"
                ref="textareaRef"
                :maxlength="props.maxLength"
                :rows="props.rows ?? 3"
            ></textarea>

            <div
                v-if="props.maxLength"
                class="absolute -bottom-5 right-0 text-xs font-medium text-gray-500 dark:text-gray-400"
                aria-live="polite"
            >
                {{ typedCharCount }}/{{ props.maxLength }}
            </div>
        </div>

        <!-- Hint and Error Display -->
        <slot /> <!-- For any additional content passed into the default slot -->
        <p v-if="hint && !error && !maxLengthError" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
        <InputError v-if="maxLengthError" :error="maxLengthError" class="mt-1" />
    </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed, though most should come from global/Tailwind */
/* For example, if you wanted a specific transition for the dirty-input class */
/*
.dirty-input {
    transition: border-color 0.3s ease-in-out;
}
*/
</style>