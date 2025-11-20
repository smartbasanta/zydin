<script setup lang="ts">
import { type PropType, ref, type Ref, computed, toRef } from 'vue';
import { LoaderCircle, CameraIcon } from 'lucide-vue-next';
import {
    useFileUploader,
    type ComposableUploadSuccessPayload,
    type ComposableUploadErrorPayload,
    type ComposableUploadProgressPayload,
} from '@/types/media';

const props = defineProps({
    uploadUrl: { type: String, required: true },
    currentImageUrl: { type: String, default: '' },
    defaultImageUrl: { type: String, default: 'https://ui-avatars.com/api/?name=U&size=128' },
    formData: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    maxFileSizeMb: { type: Number, default: 5 },
    acceptedMimes: { type: String, default: 'image/jpeg,image/png,image/gif,image/webp' },
    ariaLabel: { type: String, default: 'Upload image' },
    wrapperClass: { type: String, default: 'relative group w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300' },
    imageClass: { type: String, default: 'w-full h-full object-cover' },
    fileFieldName: { type: String, default: 'file' },
});

const emit = defineEmits<{
    (e: 'upload-success', payload: ComposableUploadSuccessPayload): void;
    (e: 'upload-error', payload: ComposableUploadErrorPayload): void;
    (e: 'upload-progress', payload: ComposableUploadProgressPayload): void;
    (e: 'file-selected', file: File | null): void;
}>();

const currentImageUrlRef: Ref<string | undefined | null> = toRef(props, 'currentImageUrl');
const uploadProgress = ref<ComposableUploadProgressPayload | null>(null);

const uploader = useFileUploader({
    uploadUrl: props.uploadUrl,
    currentImageUrl: currentImageUrlRef,
    defaultImageUrl: props.defaultImageUrl,
    initialFormData: props.formData,
    maxFileSizeMb: props.maxFileSizeMb,
    acceptedMimes: props.acceptedMimes,
    fileFieldName: props.fileFieldName,
});

const handleFileChange = (event: Event) => {
    uploader.onFileInputChange(event);
    const selectedFile = uploader.uploaderForm.data[props.fileFieldName] as File | null;
    emit('file-selected', selectedFile);

    if (selectedFile) {
        uploader.submitSelectedFile({
            onSuccess: (payload) => emit('upload-success', payload),
            onError: (payload) => {
                uploadProgress.value = null;
                emit('upload-error', payload);
            },
            onProgress: (payload) => {
                uploadProgress.value = payload;
                emit('upload-progress', payload);
            },
            onFinish: () => {
                setTimeout(() => { uploadProgress.value = null; }, 500); // Keep progress at 100% briefly
            },
        });
    }
};

// --- UI ENHANCEMENT: SVG Circular Progress ---
const circumference = 2 * Math.PI * 45; // 2 * pi * radius (radius is 45 for a 100x100 box)
const progressOffset = computed(() => {
    const percentage = uploadProgress.value?.percentage ?? 0;
    return circumference - (percentage / 100) * circumference;
});
</script>

<template>
    <div class="image-uploader-component">
        <div :class="wrapperClass">
            <input
                type="file"
                :ref="uploader.fileInputRef"
                @change="handleFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :accept="acceptedMimes"
                :disabled="uploader.uploaderForm.isSubmitting"
                :aria-label="ariaLabel"
            />
            <slot
                :trigger="uploader.triggerFileInput"
                :isSubmitting="uploader.uploaderForm.isSubmitting"
                :displayImageUrl="uploader.displayImageUrl.value"
                :progress="uploadProgress"
                :errors="uploader.uploaderForm.errors"
            >
            <button
                type="button"
                @click="uploader.triggerFileInput"
                :disabled="uploader.uploaderForm.isSubmitting"
                class="w-full h-full focus:outline-none"
                :aria-label="ariaLabel"
                >
                <!-- Display Image -->
                <img
                    :src="uploader.displayImageUrl.value"
                    alt="Upload target"
                    :class="[imageClass, { 'blur-sm': uploader.uploaderForm.isSubmitting }]"
                    class="transition-all duration-300"
                />

                <!-- Hover/Focus Overlay -->
                <div
                    class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-300 ease-in-out"
                    :class="{ '!bg-black/60': uploader.uploaderForm.isSubmitting }"
                >
                    <CameraIcon
                        class="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity"
                    />
                </div>
            </button>
                <!-- Uploading State (Spinner and Progress Ring) -->
                <div v-if="uploader.uploaderForm.isSubmitting" class="absolute inset-0 flex items-center justify-center">
                    <!-- Circular Progress SVG -->
                    <svg class="absolute w-full h-full" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                        <circle
                            class="text-slate-300/50 dark:text-slate-600/50"
                            stroke="currentColor"
                            stroke-width="5"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            class="text-indigo-500 transition-all duration-300 ease-linear"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="progressOffset"
                        />
                    </svg>
                    <LoaderCircle class="w-10 h-10 text-white animate-spin" />
                </div>
            </slot>
        </div>
        <!-- Error Message -->
        <p v-if="uploader.uploaderForm.errors[props.fileFieldName]" class="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
            {{ uploader.uploaderForm.errors[props.fileFieldName] }}
        </p>
    </div>
</template>