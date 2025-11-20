<script setup lang="ts">
import { type PropType, ref, type Ref, computed, toRef } from 'vue';
import { LoaderCircle, CameraIcon, FileIcon, UploadCloudIcon } from 'lucide-vue-next';
import {
    useFileUploader,
    type ComposableUploadSuccessPayload,
    type ComposableUploadErrorPayload,
    type ComposableUploadProgressPayload,
} from '@/types/media';

const props = defineProps({
    uploadUrl: { type: String, required: true },
    currentFileUrl: { type: String, default: '' },
    defaultFileUrl: { type: String, default: '' },
    formData: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    maxFileSizeMb: { type: Number, default: 5 },
    acceptedMimes: { type: String, default: 'image/jpeg,image/png,image/gif,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ariaLabel: { type: String, default: 'Upload file' },
    wrapperClass: { type: String, default: 'relative group w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center' },
    fileFieldName: { type: String, default: 'file' },
});

const emit = defineEmits<{
    (e: 'upload-success', payload: ComposableUploadSuccessPayload): void;
    (e: 'upload-error', payload: ComposableUploadErrorPayload): void;
    (e: 'upload-progress', payload: ComposableUploadProgressPayload): void;
    (e: 'file-selected', file: File | null): void;
}>();

const currentFileUrlRef: Ref<string | undefined | null> = toRef(props, 'currentFileUrl');
const uploadProgress = ref<ComposableUploadProgressPayload | null>(null);
const selectedFile = ref<File | null>(null);

const uploader = useFileUploader({
    uploadUrl: props.uploadUrl,
    currentImageUrl: currentFileUrlRef, // The composable uses this for display logic
    defaultImageUrl: props.defaultFileUrl,
    initialFormData: props.formData,
    maxFileSizeMb: props.maxFileSizeMb,
    acceptedMimes: props.acceptedMimes,
    fileFieldName: props.fileFieldName,
});

const handleFileChange = (event: Event) => {
    uploader.onFileInputChange(event);
    selectedFile.value = uploader.uploaderForm.data[props.fileFieldName] as File | null;
    emit('file-selected', selectedFile.value);

    if (selectedFile.value) {
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
                setTimeout(() => { uploadProgress.value = null; }, 500);
            },
        });
    }
};

const isImage = computed(() => {
    const file = selectedFile.value;
    if (file) {
        return file.type.startsWith('image/');
    }
    const url = uploader.displayImageUrl.value;
    if (url) {
        const extension = url.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
    }
    return false;
});

const circumference = 2 * Math.PI * 45;
const progressOffset = computed(() => {
    const percentage = uploadProgress.value?.percentage ?? 0;
    return circumference - (percentage / 100) * circumference;
});
</script>

<template>
    <div class="file-uploader-component">
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
                :displayFileUrl="uploader.displayImageUrl.value"
                :progress="uploadProgress"
                :errors="uploader.uploaderForm.errors"
                :isImage="isImage"
            >
                <button
                    type="button"
                    @click="uploader.triggerFileInput"
                    :disabled="uploader.uploaderForm.isSubmitting"
                    class="w-full h-full focus:outline-none"
                    :aria-label="ariaLabel"
                >
                    <!-- Image View -->
                    <template v-if="isImage">
                        <img
                            :src="uploader.displayImageUrl.value"
                            alt="Upload target"
                            class="w-full h-full object-cover transition-all duration-300"
                            :class="{ 'blur-sm': uploader.uploaderForm.isSubmitting }"
                        />
                        <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-300 ease-in-out" :class="{ '!bg-black/60': uploader.uploaderForm.isSubmitting }">
                            <CameraIcon class="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                        </div>
                    </template>
                    <!-- Generic File View -->
                    <template v-else>
                        <div class="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                            <FileIcon v-if="uploader.displayImageUrl.value" class="w-12 h-12 mb-2" />
                            <UploadCloudIcon v-else class="w-12 h-12 mb-2" />
                            <span class="text-sm text-center">{{ selectedFile?.name || 'Select a file' }}</span>
                        </div>
                    </template>
                </button>

                <!-- Uploading State -->
                <div v-if="uploader.uploaderForm.isSubmitting" class="absolute inset-0 flex items-center justify-center">
                    <svg class="absolute w-full h-full" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                        <circle class="text-slate-300/50 dark:text-slate-600/50" stroke="currentColor" stroke-width="5" fill="transparent" r="45" cx="50" cy="50" />
                        <circle class="text-indigo-500 transition-all duration-300 ease-linear" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="transparent" r="45" cx="50" cy="50" :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset" />
                    </svg>
                    <LoaderCircle class="w-10 h-10 text-white animate-spin" />
                </div>
            </slot>
        </div>
        <p v-if="uploader.uploaderForm.errors[props.fileFieldName]" class="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
            {{ uploader.uploaderForm.errors[props.fileFieldName] }}
        </p>
    </div>
</template>