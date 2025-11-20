<script setup lang="ts">
    import { ref, onMounted, computed, useAttrs } from 'vue';
    import InputError from '@/components/form/InputError.vue';

    export interface OptionObject {
        value: number | string;
        label: string;
        disabled?: boolean;
    }

    export type OptionType = string | OptionObject;

    const props = defineProps<{
        label?: string;
        error?: string | string[];
        hint?: string;
        options?: Record<string, string> | OptionType[] | null;
        containerClass?: string | Record<string, boolean>;
        isDirty?: boolean;
        placeholder?: string; 
        required?: boolean;
    }>();

    const model = defineModel<string | number | null>();

    const selectRef = ref<HTMLSelectElement | null>(null);

    onMounted(() => {
        if (selectRef.value?.hasAttribute('autofocus')) {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    selectRef.value?.focus();
                }
            }, 100);
        }
    });

    defineExpose({
        focus: () => {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    selectRef.value?.focus();
                }
            }, 100);
        },
    });

    const attrs = useAttrs();

    const capitalize = (str: string): string =>
        str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const computedLabel = computed(() => {
        if (props.label) return props.label;
        const nameAttr = attrs['name'] as string | undefined;
        return nameAttr ? capitalize(nameAttr) : '';
    });

    const inputId = computed(
        () => (attrs.id as string) ?? `select-${Math.random().toString(36).substring(2, 11)}`
    );

    // Normalize various options formats into a consistent OptionObject[]
    const normalizedOptions = computed<OptionObject[]>(() => {
        if (!props.options) return [];

        // Case 1: Array of strings
        if (Array.isArray(props.options) && props.options.every(val => typeof val === 'string')) {
            return (props.options as string[]).map(val => ({ value: val, label: val }));
        }

        // Case 2: Array of { value, label } objects (or compatible)
        if (Array.isArray(props.options) && props.options.every(val => typeof val === 'object' && val !== null && 'value' in val && 'label' in val)) {
            return props.options as OptionObject[];
        }

        // Case 3: Record<string, string> (object with key-value pairs)
        if (typeof props.options === 'object' && !Array.isArray(props.options)) {
            return Object.entries(props.options).map(([value, label]) => ({ value, label }));
        }

        return []; // Fallback for unsupported format
    });

    const placeholderText = computed(() => {
        if (props.placeholder) return props.placeholder;
        return `Select ${computedLabel.value ? computedLabel.value.toLowerCase() : 'an option'}`;
    });

    defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <div v-if="computedLabel || $slots['before-label'] || $slots['after-label']" class="flex gap-2 items-start">
            <slot name="before-label" />
            <label v-if="computedLabel" :for="inputId" class="label">
                {{ computedLabel }}
                <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
            </label>
            <slot name="after-label" />
        </div>

        <select
            :id="inputId"
            class="input"
            :class="{
                'invalid-input': error,
                'dirty-input': isDirty,
                'text-gray-500 dark:text-gray-400': !model && model !== 0,
            }"
            :aria-invalid="!!error"
            v-bind="attrs"
            v-model="model"
            ref="selectRef"
            :required="props.required"
        >
            <!-- Default placeholder option -->
            <!-- <option value="" disabled :selected="model === null || model === undefined || model === ''">
                {{ placeholderText }}
            </option> -->
            <option value="" selected>
                {{ placeholderText }}
            </option>

            <!-- Rendered options from normalizedOptions -->
            <template v-if="normalizedOptions.length > 0">
                <option
                    v-for="option in normalizedOptions"
                    :key="String(option.value)"
                    :value="option.value"
                    :disabled="option.disabled"
                >
                    {{ option.label }}
                </option>
            </template>
            <slot v-else />
        </select>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>

<!-- <style scoped>
/* Add component-specific styles if Tailwind classes are not enough */
/* Ensure the placeholder option is styled correctly */
select:invalid,
select option[value=""][disabled] {
  /* color: #9ca3af; /* Tailwind gray-400 */
}
/* For dark mode, you might need to adjust if default select styling is an issue */
/*
.dark select:invalid,
.dark select option[value=""][disabled] {
  color: #6b7280; /* Tailwind gray-500 */
/* }
*/
</style> -->