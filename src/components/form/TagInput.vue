<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import InputError from '@/components/form/InputError.vue';
import { XIcon } from 'lucide-vue-next';

const props = defineProps<{
    label?: string;
    error?: string | string[] | null;
    hint?: string;
    placeholder?: string;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean;
    required?: boolean;
}>();

// v-model for an array of strings
const model = defineModel<string[]>({ default: () => [] });

const newTag = ref('');

const handleAddTag = () => {
    const tag = newTag.value.trim();
    if (tag && !model.value.includes(tag)) {
        model.value.push(tag);
        newTag.value = '';
    }
};

const handleRemoveTag = (index: number) => {
    model.value.splice(index, 1);
};

// Handle pasting multiple lines
const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText) {
        const tags = pastedText.split(/[\n,]+/).map(t => t.trim()).filter(Boolean);
        if (tags.length > 0) {
            const uniqueNewTags = tags.filter(t => !model.value.includes(t));
            model.value.push(...uniqueNewTags);
        }
    }
};


const attrs = useAttrs();
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
const inputId = computed(() => (attrs.id as string) ?? `tag-input-${Math.random().toString(36).substring(2, 11)}`);
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <label v-if="computedLabel" :for="inputId" class="label">
            {{ computedLabel }}
            <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
        </label>

        <div class="flex flex-col p-2 border rounded-lg transition-all"
             :class="{
                'border-gray-300 dark:border-gray-600': !error,
                'border-red-500 dark:border-red-400 ring-2 ring-red-500/20': !!error,
                'border-blue-500 dark:border-blue-400': isDirty && !error
             }"
        >
            <!-- Rendered Tags -->
            <div v-if="model.length > 0" class="flex flex-wrap gap-2 p-1">
                <span v-for="(tag, index) in model" :key="index"
                      class="flex items-center gap-1.5 px-2 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md"
                >
                    {{ tag }}
                    <button @click="handleRemoveTag(index)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100">
                        <XIcon class="w-3.5 h-3.5" />
                    </button>
                </span>
            </div>

            <!-- Input for new tag -->
            <input
                :id="inputId"
                type="text"
                v-model="newTag"
                @keydown.enter.prevent="handleAddTag"
                @paste="handlePaste"
                :placeholder="placeholder || 'Add item...'"
                class="w-full p-2 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
        </div>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>