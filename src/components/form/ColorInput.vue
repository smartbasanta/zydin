<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import InputError from '@/components/form/InputError.vue';

// REFACTORED: Use defineModel for v-model binding. It can be null.
const model = defineModel<string | null>();

// REFACTORED: Match the props from your established pattern
const props = defineProps<{
    label?: string;
    error?: string | string[];
    hint?: string;
    containerClass?: string | Record<string, boolean>;
    required?: boolean;
    defaultColor?: string;
}>();

// REFACTORED: Standard attribute, ID, and label handling
const attrs = useAttrs();
const inputId = computed(() => (attrs.id as string) ?? `color-input-${Math.random().toString(36).substring(2, 9)}`);
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
defineOptions({ inheritAttrs: false });

/**
 * NEW: A computed property with a getter and setter.
 * This is the modern, safe way to manage the component's state.
 * It fixes the TypeScript error by design.
 */
const displayColor = computed({
    // GET: Provide the v-model's value, or fall back to the default color for the UI.
    get() {
        return model.value || props.defaultColor || '#000000';
    },
    // SET: When the user changes the color (via either input), update the v-model.
    set(newValue: string) {
        model.value = newValue;
    }
});

</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <!-- REFACTORED: Standardized label block -->
        <div v-if="computedLabel" class="flex gap-2 items-start">
            <label :for="inputId" class="label">
                {{ computedLabel }}
                <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
            </label>
        </div>

        <div class="flex items-center">
            <!-- The native color picker swatch -->
            <input
                type="color"
                :id="inputId"
                v-model="displayColor"
                class="w-10 h-10 p-1 border-0 bg-transparent cursor-pointer rounded-lg"
                aria-label="Color Picker Swatch"
            />
            <!-- The text input for the hex code -->
            <input
                type="text"
                v-model="displayColor"
                v-bind="attrs"
                class="input ml-2 flex-1"
                :class="{ 'invalid-input': error }"
                placeholder="#FFFFFF"
                :aria-invalid="!!error"
                :required="props.required"
            />
        </div>

        <!-- REFACTORED: Standardized hint and error block -->
        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>