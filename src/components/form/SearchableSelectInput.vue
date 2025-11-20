<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import InputError from '@/components/form/InputError.vue';

// --- TYPE DEFINITIONS ---
export interface OptionObject {
    value: number | string | null; // Allow null for the clear option
    label: string;
    disabled?: boolean;
}
export type OptionType = string | OptionObject;

// --- PROPS & MODEL ---
const props = withDefaults(defineProps<{
    label?: string;
    error?: string | string[];
    hint?: string;
    options?: Record<string, string> | OptionType[] | null;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean;
    placeholder?: string;
    required?: boolean;
    initialVisibleOptions?: number;
    // --- NEW PROPS ---
    clearable?: boolean; // If true, a "None" option is added
    clearOptionLabel?: string; // The label for the clearable option
}>(), {
    initialVisibleOptions: 10,
    clearable: false, // Default to not being clearable
    clearOptionLabel: 'None', // Default label for the clear option
});

const model = defineModel<string | number | null>();

// --- STATE MANAGEMENT ---
const isOpen = ref(false);
const searchQuery = ref('');
const componentRoot = ref<HTMLDivElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

// --- COMPUTED PROPERTIES ---
const computedLabel = computed(() => props.label || '');
const inputId = `search-select-${Math.random().toString(36).substring(2, 11)}`;

// The special object for our "None" / "Clear" option
const clearOption = computed<OptionObject>(() => ({
    value: null, // Setting the model to null clears it
    label: props.clearOptionLabel,
}));

// Normalizes the various formats for the `options` prop into a consistent array
const normalizedOptions = computed<OptionObject[]>(() => {
    if (!props.options) return [];
    if (Array.isArray(props.options) && props.options.every(val => typeof val === 'string')) {
        return (props.options as string[]).map(val => ({ value: val, label: val }));
    }
    if (Array.isArray(props.options)) {
        // Ensure we don't have existing null values that conflict
        return (props.options as OptionObject[]).filter(opt => opt.value !== null);
    }
    if (typeof props.options === 'object') {
        return Object.entries(props.options).map(([value, label]) => ({ value, label }));
    }
    return [];
});

// The core search logic: filters options and intelligently includes the "clear" option
const filteredOptions = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    let results: OptionObject[] = [];

    // Filter the actual options based on the search query
    const matchingOptions = normalizedOptions.value.filter(option =>
        option.label.toLowerCase().includes(query) ||
        String(option.value).toLowerCase().includes(query)
    );

    // If the component is clearable, add the clear option at the top
    if (props.clearable) {
        results.push(clearOption.value);
    }

    // If there's no search query, show the initial visible slice
    if (!query) {
        results = results.concat(matchingOptions.slice(0, props.initialVisibleOptions));
    } else {
        // Otherwise, show all matching options
        results = results.concat(matchingOptions);
    }
    
    return results;
});

// Determines the text to display in the main input area
const selectedOptionLabel = computed(() => {
    // If model is null or undefined, there's no selection
    if (model.value === null || model.value === undefined) {
        return '';
    }
    const selected = normalizedOptions.value.find(opt => opt.value === model.value);
    return selected ? selected.label : '';
});

const placeholderText = computed(() => {
    return props.placeholder || `Select ${computedLabel.value ? computedLabel.value.toLowerCase() : 'an option'}`;
});

// --- METHODS ---
function selectOption(option: OptionObject) {
    if (option.disabled) return;
    model.value = option.value; // This will be `null` if the clear option is selected
    isOpen.value = false;
    searchQuery.value = ''; // Clear search on select
}

function openDropdown() {
    isOpen.value = true;
    nextTick(() => {
        searchInput.value?.focus();
    });
}

// --- WATCHERS & LIFECYCLE ---
const handleClickOutside = (event: MouseEvent) => {
    if (componentRoot.value && !componentRoot.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

watch(isOpen, (val) => {
    if (val) {
        document.addEventListener('click', handleClickOutside, true);
    } else {
        document.removeEventListener('click', handleClickOutside, true);
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true);
});
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass" ref="componentRoot">
        <!-- Label -->
        <label v-if="computedLabel" :for="inputId" class="label">
            {{ computedLabel }}
            <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
        </label>

        <!-- Custom Select Trigger -->
        <div class="relative">
            <button
                type="button"
                :id="inputId"
                @click="openDropdown"
                class="input text-left w-full flex justify-between items-center"
                :class="{
                    'invalid-input': error,
                    'dirty-input': isDirty,
                    'text-gray-500 dark:text-gray-400': !model // Corrected: was !modelValue
                }"
                :aria-expanded="isOpen"
                aria-haspopup="listbox"
            >
                <span v-if="selectedOptionLabel">{{ selectedOptionLabel }}</span>
                <span v-else class="text-gray-500 dark:text-gray-400">{{ placeholderText }}</span>
                <!-- Chevron Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 transition-transform duration-200" :class="{'rotate-180': isOpen}" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>

            <!-- Dropdown with Search -->
            <div
                v-if="isOpen"
                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
            >
                <!-- Search Input -->
                <div class="p-2">
                    <input
                        type="text"
                        ref="searchInput"
                        v-model="searchQuery"
                        placeholder="Search..."
                        class="input w-full"
                        @keydown.esc="isOpen = false"
                    />
                </div>

                <!-- Options List -->
                <ul
                    class="max-h-60 overflow-y-auto"
                    role="listbox"
                >
                    <li v-if="filteredOptions.length === 0 || (filteredOptions.length === 1 && clearable)" class="px-4 py-2 text-gray-500">
                        No options found.
                    </li>
                    <li
                        v-for="option in filteredOptions"
                        :key="String(option.label)"
                        @click="selectOption(option)"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        :class="{
                            'bg-blue-500 text-white': model === option.value,
                            'opacity-50 cursor-not-allowed': option.disabled,
                            'italic text-gray-500 dark:text-gray-400': option.value === null // Style for the clear option
                        }"
                        role="option"
                        :aria-selected="model === option.value"
                    >
                        {{ option.label }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- Hint and Error Messages -->
        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>