<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue';
import { PlusCircleIcon, Trash2Icon, XCircleIcon } from 'lucide-vue-next';
import SelectInput from '@/components/form/SelectInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import InputError from '@/components/form/InputError.vue';

const model = defineModel<Record<string, any> | null>({ required: true });

const props = defineProps<{
    label?: string;
    error?: string | string[];
    hint?: string;
    keys?: string[];
    containerClass?: string | Record<string, boolean>;
    required?: boolean;
}>();

type EditorMode = 'key-value' | 'raw';
type KeyValuePair = { id: number; key: string; value: string };

const editorMode = ref<EditorMode>('key-value');
const parsingError = ref<string | null>(null);
const keyValuePairs = ref<KeyValuePair[]>([]);
const rawJsonText = ref<string>('');
const modeOptions = [{ value: 'key-value', label: 'Key-Value' }, { value: 'raw', label: 'Raw JSON' }];
let lastEmittedValue: string | null = null;
let uniqueIdCounter = 0;

const attrs = useAttrs();
const inputId = computed(() => (attrs.id as string) ?? `json-input-${Math.random().toString(36).substring(2, 9)}`);
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
defineOptions({ inheritAttrs: false });

const isRestrictedMode = computed(() => props.keys && props.keys.length > 0);

// --- CORE LOGIC ---

const tryParseValue = (value: string): any => {
    try {
        if (value.trim() === '') return '';
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

const addPair = () => {
    keyValuePairs.value.push({ id: uniqueIdCounter++, key: '', value: '' });
};

const removePair = (id: number) => {
    keyValuePairs.value = keyValuePairs.value.filter(p => p.id !== id);
    if (!isRestrictedMode.value && keyValuePairs.value.length === 0) {
        addPair();
    }
};

// IMPROVEMENT: New method to explicitly clear the value to null.
const clearValue = () => {
    model.value = null;
};

const isAddButtonDisabled = computed(() => {
    if (isRestrictedMode.value) {
        return keyValuePairs.value.length >= (props.keys?.length ?? 0);
    }
    const lastPair = keyValuePairs.value[keyValuePairs.value.length - 1];
    return !!(lastPair && !lastPair.key.trim());
});

const getKeyOptionsForPair = (pairId: number) => {
    if (!isRestrictedMode.value) return [];
    const usedKeysByOthers = new Set(keyValuePairs.value.filter(p => p.id !== pairId).map(p => p.key));
    return (props.keys ?? []).map(key => ({ value: key, label: key, disabled: usedKeysByOthers.has(key) }));
};

const syncStateFromModelValue = (newValue: Record<string, any> | null) => {
    parsingError.value = null;

    // IMPROVEMENT: Handle incoming null value correctly.
    if (newValue === null) {
        rawJsonText.value = '';
        keyValuePairs.value = [];
        // Add the initial empty pair for the user to start typing.
        if (!isRestrictedMode.value && editorMode.value === 'key-value') {
            addPair();
        }
        return;
    }

    rawJsonText.value = JSON.stringify(newValue, null, 2);
    let entries = Object.entries(newValue ?? {});

    if (isRestrictedMode.value) {
        const allowedKeys = new Set(props.keys);
        entries = entries.filter(([key]) => allowedKeys.has(key));
    }

    keyValuePairs.value = entries.map(([key, value]) => ({
        id: uniqueIdCounter++,
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
    }));

    if (!isRestrictedMode.value && editorMode.value === 'key-value' && keyValuePairs.value.length === 0) {
        addPair();
    }
};

// --- WATCHERS ---
watch(keyValuePairs, (pairs) => {
    if (editorMode.value !== 'key-value') return;

    // IMPROVEMENT: Check for the "truly empty" state and emit null instead of {}.
    const isTrulyEmpty = pairs.length === 0 || (pairs.length === 1 && !pairs[0].key.trim() && !pairs[0].value.trim());
    if (isTrulyEmpty && !isRestrictedMode.value) {
        if (model.value !== null) {
            lastEmittedValue = 'null';
            model.value = null;
        }
        return;
    }

    const newObject: Record<string, any> = {};
    pairs.forEach(pair => {
        if (pair.key) newObject[pair.key] = tryParseValue(pair.value);
    });

    const newJsonString = JSON.stringify(newObject);
    lastEmittedValue = newJsonString;
    model.value = newObject;

}, { deep: true });

watch(rawJsonText, (newText) => {
    if (editorMode.value !== 'raw') return;

    // IMPROVEMENT: If the raw text is empty, emit null.
    if (newText.trim() === '') {
        parsingError.value = null;
        if (model.value !== null) {
            lastEmittedValue = 'null';
            model.value = null;
        }
        return;
    }

    try {
        const parsed = JSON.parse(newText);
        parsingError.value = null;
        lastEmittedValue = JSON.stringify(parsed);
        model.value = parsed;
    } catch (e) {
        parsingError.value = 'Invalid JSON format.';
    }
});

watch(model, (newVal) => {
    const newJsonString = JSON.stringify(newVal);
    if (newJsonString === lastEmittedValue) return;
    syncStateFromModelValue(newVal);
}, { deep: true });

// Initial sync on mount
syncStateFromModelValue(model.value);

</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <div v-if="computedLabel" class="flex gap-2 items-start">
            <label :for="inputId" class="label">
                {{ computedLabel }}
                <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
            </label>
        </div>

        <div
            class="flex flex-col gap-4 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800/50">
            <!-- IMPROVEMENT: Added a clear button for explicit null control -->
            <div class="flex items-center justify-between gap-2">
                <SelectInput label="Input Mode" v-model="editorMode" :options="modeOptions" :disabled="isRestrictedMode"
                    container-class="flex-1" />
                <button type="button" @click="clearValue" v-if="model?.value !== null"
                    class="btn btn-secondary text-muted mt-5" title="Clear value">
                    <XCircleIcon class="w-4 h-4 mr-1" />
                    Clear
                </button>
            </div>

            <!-- Key-Value Editor -->
            <div v-if="editorMode === 'key-value'" class="flex flex-col gap-3">
                <div v-for="pair in keyValuePairs" :key="pair.id" class="flex items-center gap-2">
                    <template v-if="isRestrictedMode">
                        <SelectInput v-model="pair.key" :options="getKeyOptionsForPair(pair.id)"
                            placeholder="Select a key" container-class="flex-1" />
                    </template>
                    <template v-else>
                        <TextInput v-model="pair.key" placeholder="key" container-class="flex-1" />
                    </template>
                    <TextInput v-model="pair.value" placeholder='value' container-class="flex-1" />
                    <button type="button" @click="removePair(pair.id)"
                        class="p-2 text-red-500 hover:text-red-700 disabled:opacity-50" :disabled="isRestrictedMode">
                        <Trash2Icon class="w-4 h-4" />
                    </button>
                </div>
                <button v-if="!isRestrictedMode" type="button" @click="addPair" :disabled="isAddButtonDisabled"
                    class="flex items-center gap-1.5 text-sm btn btn-info font-medium mt-2 self-start">
                    <PlusCircleIcon class="w-4 h-4" /> Add Property
                </button>
                <p v-if="isRestrictedMode && keyValuePairs.length === 0" class="text-xs text-muted">No properties
                    defined.</p>
            </div>

            <!-- Raw JSON Editor -->
            <div v-if="editorMode === 'raw'" class="flex-grow">
                <textarea v-model="rawJsonText" class="input w-full h-full font-mono text-sm min-h-[150px]"
                    :class="{ 'invalid-input': parsingError }"
                    placeholder='{ "key": "value" } or leave empty for null'></textarea>
            </div>
        </div>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
        <InputError v-if="parsingError" :error="parsingError" class="mt-1" />
    </div>
</template>