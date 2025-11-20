<script setup lang="ts">
    import { type PropType, ref, type Ref } from 'vue';
    import { LoaderCircle, UploadIcon } from 'lucide-vue-next';
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
        fileFieldName: { type: String, default: 'file' },
    });

    const emit = defineEmits<{
        (e: 'upload-success', payload: ComposableUploadSuccessPayload): void;
        (e: 'upload-error', payload: ComposableUploadErrorPayload): void;
        (e: 'upload-progress', payload: ComposableUploadProgressPayload): void;
        (e: 'file-selected', file: File | null): void;
    }>();

    const currentImageUrlRef: Ref<string | undefined | null> = ref(props.currentImageUrl);
    
    // CHANGE: Create a local ref for progress, just like in the previous example.
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

    const isDragging = ref(false);

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        isDragging.value = true;
    };

    const handleDragLeave = () => {
        isDragging.value = false;
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragging.value = false;
        if (event.dataTransfer?.files[0]) {
            const file = event.dataTransfer.files[0];
            const input = uploader.fileInputRef.value;
            if (input) {
                // This is a great technique to programmatically set the input's files
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;

                // Dispatch a real change event to trigger our existing handler
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    const handleFileChange = (event: Event) => {
        uploader.onFileInputChange(event);
        // CHANGE: Access the file through the `.data` property of the form state.
        const file = uploader.uploaderForm.data[props.fileFieldName] as File | null;
        emit('file-selected', file);
    };

    const submitUpload = () => {
        // CHANGE: Populate the local `uploadProgress` ref from the hooks.
        uploader.submitSelectedFile({
            onSuccess: (payload) => emit('upload-success', payload),
            onError: (payload) => {
                uploadProgress.value = null; // Clear progress on error
                emit('upload-error', payload);
            },
            onProgress: (payload) => {
                uploadProgress.value = payload; // Update progress
                emit('upload-progress', payload);
            },
            onFinish: () => {
                uploadProgress.value = null; // Clear progress when finished
            },
        });
    };

    const clearSelection = () => {
        uploader.clearSelection();
        emit('file-selected', null);
    };
</script>

<template>
    <div class="drag-drop-uploader">
        <div class="relative border-2 border-dashed rounded-lg p-6 text-center"
            :class="{
                'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20': isDragging,
                'border-slate-300 dark:border-slate-600': !isDragging,
            }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
        >
            <input
                type="file"
                :ref="uploader.fileInputRef"
                @change="handleFileChange"
                class="hidden"
                :accept="props.acceptedMimes"
                :disabled="uploader.uploaderForm.isSubmitting"
            />
            <div class="flex flex-col items-center justify-center" @click="uploader.triggerFileInput">
                <UploadIcon class="w-10 h-10 text-slate-500 dark:text-slate-400 mb-2" />
                <p class="text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop an image here, or click to select
                </p>
                <img
                    v-if="uploader.displayImageUrl.value"
                    :src="uploader.displayImageUrl.value"
                    alt="Preview"
                    class="mt-4 max-w-full h-48 object-contain rounded"
                />
                <LoaderCircle
                    v-if="uploader.uploaderForm.isSubmitting"
                    class="w-10 h-10 text-indigo-500 animate-spin mt-4"
                />
            </div>
            <div v-if="uploader.uploaderForm.data[props.fileFieldName]" class="mt-4 flex gap-2 justify-center">
                <button
                    @click="submitUpload"
                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
                    :disabled="uploader.uploaderForm.isSubmitting"
                >
                    Upload Image
                </button>
                <button
                    @click="clearSelection"
                    class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    :disabled="uploader.uploaderForm.isSubmitting"
                >
                    Clear
                </button>
            </div>
            <!-- Show progress bar -->
            <div v-if="uploadProgress" class="mt-4 w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                <div class="bg-indigo-600 h-2.5 rounded-full" :style="{ width: uploadProgress.percentage + '%' }"></div>
            </div>
            
            <!-- Show error message -->
            <p v-if="uploader.uploaderForm.errors[props.fileFieldName]" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ uploader.uploaderForm.errors[props.fileFieldName] }}
            </p>
        </div>
    </div>
</template>