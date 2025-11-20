<script setup lang="ts">
import { ref, computed, useAttrs, watch } from 'vue';
import InputError from '@/components/form/InputError.vue';
import { UploadCloudIcon, XIcon, FileIcon } from 'lucide-vue-next';

const props = defineProps<{
    label?: string;
    error?: string | string[] | null;
    hint?: string;
    accept?: string;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean;
    required?: boolean;
}>();

// Using defineModel is great for v-model
const model = defineModel<File | null>();

const fileInputRef = ref<HTMLInputElement | null>(null);

// This watcher correctly handles external changes like a form reset
watch(model, (newFile) => {
    if (!newFile) {
        // If the model is cleared externally, reset the native input
        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    }
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        model.value = target.files[0];
    } else {
        model.value = null;
    }
};

// --- CORRECTED & EXPLICIT CLEAR FUNCTION ---
const clearFile = () => {
    // 1. Update the v-model to notify the parent
    model.value = null;

    // 2. Explicitly reset the underlying native file input.
    //    This is crucial so the user can select the same file again if they want.
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

const selectedFileName = computed(() => model.value?.name ?? '');

const attrs = useAttrs();
const capitalize = (str: string): string => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const computedLabel = computed(() => {
    if (props.label) return props.label;
    const nameAttr = attrs['name'] as string | undefined;
    return nameAttr ? capitalize(nameAttr) : '';
});
const inputId = computed(() => (attrs.id as string) ?? `file-input-${Math.random().toString(36).substring(2, 11)}`);

defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <label v-if="computedLabel" :for="inputId" class="label">
            {{ computedLabel }}
            <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
        </label>

        <div
            class="relative flex flex-col items-center justify-center w-full min-h-[8rem] p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200"
            :class="{
                'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700': !error,
                'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10': !!error,
                'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20': isDirty && !error
            }"
            @click="fileInputRef?.click()"
            @dragover.prevent
            @drop.prevent="handleFileChange"
        >
            <div v-if="!model" class="text-center">
                <UploadCloudIcon class="w-8 h-8 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Click to upload <span class="font-normal text-gray-500">or drag and drop</span>
                </p>
                <p class="text-xs mt-1 text-muted">{{ hint }}</p>
            </div>

            <!-- This `v-else` block now correctly shows when a file is selected -->
            <div v-else class="text-center">
                <FileIcon class="w-10 h-10 mx-auto mb-2 text-blue-500 dark:text-blue-400" />
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 break-all px-8">
                    {{ selectedFileName }}
                </p>
                <button
                    @click.stop="clearFile"
                    type="button"
                    class="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    aria-label="Remove file"
                >
                    <XIcon class="w-4 h-4" />
                </button>
            </div>
            
            <input
                :id="inputId"
                ref="fileInputRef"
                type="file"
                class="hidden"
                :accept="props.accept"
                :required="props.required && !model"
                v-bind="$attrs"
                @change="handleFileChange"
            />
        </div>
        <InputError v-if="error" :error="error" class="mt-1" />
    </div>
</template>