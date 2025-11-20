<script setup lang="ts">
import { ref, watch, computed, useAttrs, nextTick } from 'vue';
import { PlusCircleIcon, Trash2Icon } from 'lucide-vue-next';
import TextInput from '@/components/form/TextInput.vue';
import InputError from '@/components/form/InputError.vue';

const model = defineModel<string[] | null>({ required: true });

const props = defineProps<{
    label?: string;
    error?: string | string[];
    hint?: string;
    containerClass?: string | Record<string, boolean>;
    required?: boolean;
}>();

type ArrayItem = { key: number; value: string };
const internalItems = ref<ArrayItem[]>([]);
let uniqueKeyCounter = 0;

/**
 * Syncs the internal state FROM the v-model.
 * This should only run when the model is changed externally.
 */
const syncStateFromModel = (newModelValue: string[] | null) => {
    const modelAsStrings = newModelValue || [];
    internalItems.value = modelAsStrings.map(value => ({
        key: uniqueKeyCounter++,
        value: value,
    }));
    // Always ensure there is one empty input field at the end for adding new items.
    internalItems.value.push({ key: uniqueKeyCounter++, value: '' });
};

const addItem = async () => {
    if (isAddButtonDisabled.value) return;
    internalItems.value.push({ key: uniqueKeyCounter++, value: '' });
    // Focus the new input field that was just created
    await nextTick();
    const inputs = document.querySelectorAll<HTMLInputElement>('[data-array-input]');
    inputs[inputs.length - 1]?.focus();
};

const removeItem = (keyToRemove: number) => {
    internalItems.value = internalItems.value.filter(item => item.key !== keyToRemove);
    // If all items are removed, ensure there is always one empty input.
    if (internalItems.value.length === 0) {
        internalItems.value.push({ key: uniqueKeyCounter++, value: '' });
    }
    // Update the model after removing an item
    updateModel();
};

// This function is now only called when an item is added or removed, or on blur.
const updateModel = () => {
    const newModelValue = internalItems.value
        .map(item => item.value.trim())
        .filter(value => value !== '' || internalItems.value.length === 1); // Keep the last empty string if it's the only item

    if (newModelValue.length === 1 && newModelValue[0] === '') {
        model.value = null;
    } else {
        model.value = newModelValue.filter(v => v !== '');
    }
};

// Check if the add button should be disabled
const isAddButtonDisabled = computed(() => {
    if (internalItems.value.length === 0) return true;
    const lastItem = internalItems.value[internalItems.value.length - 1];
    return lastItem.value.trim() === '';
});

// Watch for external changes to the model (like form resets or data loading).
// We use a deep watch but compare with a stringified version to prevent loops.
let lastSyncedModelJson = JSON.stringify(model.value);
watch(model, (newModelValue) => {
    const newModelJson = JSON.stringify(newModelValue);
    // Only re-sync if the change came from outside, not from our own updateModel() call.
    if (newModelJson !== lastSyncedModelJson) {
        syncStateFromModel(newModelValue);
        lastSyncedModelJson = newModelJson;
    }
}, { deep: true });

// Sync on mount
syncStateFromModel(model.value);

// Update parent model whenever an input loses focus, ensuring the final value is synced.
const handleBlur = () => {
    // Trim empty values from the end
    while (internalItems.value.length > 1 && internalItems.value[internalItems.value.length - 2].value.trim() === '' && internalItems.value[internalItems.value.length - 1].value.trim() === '') {
        internalItems.value.pop();
    }
    updateModel();
    lastSyncedModelJson = JSON.stringify(model.value);
};


// --- Standard attribute and ID handling ---
const attrs = useAttrs();
const inputId = computed(() => (attrs.id as string) ?? `array-input-${Math.random().toString(36).substring(2, 9)}`);
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <div v-if="computedLabel" class="flex gap-2 items-start">
            <label :for="inputId" class="label">
                {{ computedLabel }}
                <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
            </label>
        </div>

        <div class="flex flex-col gap-3">
            <div v-for="(item, index) in internalItems" :key="item.key" class="flex items-center gap-2">
                <TextInput
                    v-model="item.value"
                    :placeholder="`Enter item ${index + 1}`"
                    container-class="flex-1"
                    data-array-input="true"
                    @blur="handleBlur"
                    @keydown.enter.prevent="addItem"
                />
                <button
                    v-if="index === internalItems.length - 1"
                    type="button"
                    @click="addItem"
                    :disabled="isAddButtonDisabled"
                    class="btn btn-icon is-square btn-success"
                    title="Add new item"
                >
                    <PlusCircleIcon class="w-5 h-5" />
                </button>
                <button
                    v-else
                    type="button"
                    @click="removeItem(item.key)"
                    class="btn btn-icon is-square btn-danger"
                    title="Remove item"
                >
                    <Trash2Icon class="w-4 h-4" />
                </button>
            </div>
        </div>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>