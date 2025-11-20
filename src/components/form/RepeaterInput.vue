<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import TextInput from './TextInput.vue';
import TextareaInput from './TextareaInput.vue';
import DeleteButton from '../button/DeleteButton.vue';
import type { RepeaterField } from '@/types';


interface RepeaterItem {
    [key: string]: any;
}

// --- Component Props & Emits ---
const props = defineProps({
    modelValue: { type: String as PropType<string | null>, default: '[]' }, 
    label: { type: String, required: true },
    fields: { type: Object as PropType<Record<string, RepeaterField>>, required: true },
    error: { type: String, default: '' },
    placeholder: { type: String, default: 'No items have been added yet.' }
});

const emit = defineEmits(['update:modelValue']);

// --- Internal State ---
const items = ref<RepeaterItem[]>([]);

const isInitialized = ref(false);

// --- Logic to Add & Remove Items ---
const addItem = () => {
    // Create a new blank item based on the structure defined in the 'fields' prop
    const newItem: RepeaterItem = {};
    Object.keys(props.fields).forEach(key => {
        newItem[key] = ''; // Initialize all fields with an empty string
    });
    items.value.push(newItem);
};

const removeItem = (index: number) => {
    items.value.splice(index, 1);
};

// --- Syncing with Parent Component (v-model) ---

// Watch for changes in our internal 'items' array and emit the JSON string to the parent
watch(items, (newValue) => {
    emit('update:modelValue', JSON.stringify(newValue));
}, { deep: true });

// Watch for changes in the 'modelValue' prop (from the parent) and parse it to update our internal state
watch(() => props.modelValue, (newVal) => {
    try {
        const parsedValue = JSON.parse(newVal || '[]');
        // Only update if the parsed value is different from our current items to avoid infinite loops
        if (JSON.stringify(parsedValue) !== JSON.stringify(items.value)) {
            items.value = Array.isArray(parsedValue) ? parsedValue : [];
        }
        if (!isInitialized.value && items.value.length === 0) {
            addItem();
        }
        isInitialized.value = true;
    } catch (e) {
        console.error("Invalid JSON string passed to RepeaterInput:", newVal);
        items.value = [];
    }
}, { immediate: true }); // 'immediate' ensures this runs on component mount

</script>

<template>
    <div class="w-full">
        <!-- 1. Component Header: Title and Primary "Add" Button -->
        <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ label }}
            </label>
            <button @click="addItem" type="button" class="btn btn-primary flex items-center gap-2">
                <Plus class="size-4"/>
                Add New
            </button>
        </div>

        <!-- 2. Main Container: Holds the list or the empty state -->
        <div class="bg-gray-50 dark:bg-gray-1000/30 border border-gray-200 dark:border-gray-700 rounded-lg">

            <!-- 3. The List of Items (v-if there are items) -->
            <ul v-if="items.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="(item, index) in items" :key="index" class="p-4 sm:p-6">
                    
                    <!-- Item Header: Title and Delete Button -->
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                            {{ label.slice(0,-1) }} #{{ index + 1 }}
                        </h3>
                        <DeleteButton 
                            @confirm="removeItem(index)" 
                            variant="danger" 
                            size="sm"
                        >
                            <Trash2 class="size-4"/>
                        </DeleteButton>
                    </div>

                    <!-- Item Body: The Form Fields -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div v-for="(fieldConfig, fieldKey) in fields" :key="fieldKey">
                            <TextInput
                                v-if="fieldConfig.type === 'text'"
                                :label="fieldConfig.label"
                                v-model="item[fieldKey]"
                                :placeholder="fieldConfig.placeholder"
                            />
                            <TextareaInput
                                v-if="fieldConfig.type === 'textarea'"
                                :label="fieldConfig.label"
                                v-model="item[fieldKey]"
                                :placeholder="fieldConfig.placeholder"
                                :rows="3"
                            />
                        </div>
                    </div>
                </li>
            </ul>

            <!-- 4. The Empty State (v-else) -->
            <div v-else class="text-center p-8">
                <div class="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-10 mb-2 text-gray-400"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                    <p class="font-semibold">{{ placeholder }}</p>
                    <p class="text-sm">Click the button below to add the first item.</p>
                    <button @click="addItem" type="button" class="btn btn-primary mt-4 flex items-center gap-2">
                        <Plus class="size-4"/>
                        Add First Item
                    </button>
                </div>
            </div>
        </div>

        <!-- 5. Display Validation Error -->
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    </div>
</template>