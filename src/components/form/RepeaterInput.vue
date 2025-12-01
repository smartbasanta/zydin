<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { GripVerticalIcon, Plus, PlusIcon, Trash2, Trash2Icon } from 'lucide-vue-next';
import TextInput from './TextInput.vue';
import TextareaInput from './TextareaInput.vue';
import DeleteButton from '../button/DeleteButton.vue';
import type { RepeaterField, RepeaterItem } from '@/types';

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
    // console.log(newVal);
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
    <div class="w-full rounded-xl border border-muted my-4 transition-all duration-200 hover:shadow-md">
        <!-- Header: Label + Add Button -->
        <div class="flex p-4 items-center justify-between">
            <label class="block text-sm font-semibold section-title">
                {{ label }}
            </label>
            <button 
                @click="addItem" 
                type="button" 
                class="btn btn-sm btn-primary"
            >
                <PlusIcon class="size-4 mr-1.5"/>
                Add New Item
            </button>
        </div>

        <!-- Container -->
        <div class="">
            
            <!-- List of Items -->
            <TransitionGroup name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2">
                <div 
                    v-for="(item, index) in items" 
                    :key="index" 
                    class="relative py-6 m-4 group border px-4 rounded-3xl"
                >
                    <!-- Item Actions (Top Right) -->
                    <div class="absolute top-4 right-4 flex items-center gap-2">
                        <span class="text-xs border px-2 py-1 rounded-md">
                            #{{ index + 1 }}
                        </span>
                        <button 
                            @click="removeItem(index)" 
                            type="button"
                            class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Remove Item"
                        >
                            <Trash2Icon class="size-4"/>
                        </button>
                    </div>

                    <!-- Dynamic Form Fields Grid -->
                    <div class="pr-8 md:pr-0">
                        <!-- Loop through the 'fields' definition to render inputs -->
                        <div 
                            v-for="(fieldConfig, fieldKey) in fields" 
                            :key="fieldKey"
                            :class="{ 'md:col-span-2': fieldConfig.type === 'textarea' }"
                        >
                            <!-- Render Text Input -->
                            <TextInput
                                v-if="fieldConfig.type === 'text'"
                                :label="fieldConfig.label"
                                v-model="item[fieldKey]"
                                :placeholder="fieldConfig.placeholder"
                            />
                            
                            <!-- Render Textarea Input -->
                            <TextareaInput
                                v-if="fieldConfig.type === 'textarea'"
                                :label="fieldConfig.label"
                                v-model="item[fieldKey]"
                                :placeholder="fieldConfig.placeholder"
                                :rows="3"
                            />
                        </div>
                    </div>
                </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="items.length === 0" class="p-8 text-center rounded-xl border border-dashed border-muted bg-gray-50 dark:bg-gray-900/30">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-3">
                    <GripVerticalIcon class="size-6" />
                </div>
                <h3 class="text-sm font-semibold section-title mb-1">No items added</h3>
                <p class="text-xs text-muted mb-4">{{ placeholder }}</p>
                <button @click="addItem" type="button" class="btn btn-primary">
                    <PlusIcon class="size-4 mr-2"/>
                    Add First Item
                </button>
            </div>

        </div>

        <!-- Validation Error -->
        <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* Use the global theme variables for background colors */
.bg-card {
    background-color: var(--card-bg);
}

/* Simple list transition animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>