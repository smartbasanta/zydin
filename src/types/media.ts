// src/types/media.ts

import { ref, reactive, computed, watch, type Ref } from 'vue';
// We only need specific types from Axios, not the whole library
import { type AxiosProgressEvent } from 'axios';
// Import your application's centralized API service
import { apiService } from '@/services/api.service';
// Import your custom API error type for proper error handling
import type { ApiError } from '@/types/api';
// Import your User type to provide better type hints for the response
import type { User } from '@/types/auth';

/**
 * Defines the shape of the successful upload payload, generic over the response data type.
 */
export type ComposableUploadSuccessPayload<T = Record<string, any>> = {
    responseData: T;
    fileName?: string;
};

/**
 * Defines the shape of the upload error payload.
 */
export type ComposableUploadErrorPayload = {
    errors: Record<string, string>;
    message?: string;
    fileName?: string;
};

/**
 * Defines the shape of the upload progress payload.
 */
export type ComposableUploadProgressPayload = {
    percentage: number;
};

/**
 * A utility type for values that can be part of FormData.
 */
export type FormDataConvertible = Array<FormDataConvertible> | {
    [key: string]: FormDataConvertible;
} | Blob | FormDataEntryValue | Date | boolean | number | null | undefined;

/**
* Defines the options for the useFileUploader composable.
*/
export interface FileUploaderOptions {
    uploadUrl: string;
    currentImageUrl: Ref<string | undefined | null>;
    defaultImageUrl?: string;
    initialFormData?: Record<string, FormDataConvertible>;
    maxFileSizeMb?: number;
    acceptedMimes?: string;
    fileFieldName?: string;
}

type UploaderInternalFormData = Record<string, File | FormDataConvertible | null>;

/**
* A reactive state object to manage form data, errors, and submission state.
*/
export interface UploaderFormState<T extends object> {
    data: T;
    errors: Record<keyof T | string, string>;
    isSubmitting: boolean;
    clearErrors: (name?: keyof T | string) => void;
    setError: (name: keyof T | string, message: string) => void;
    reset: (...fields: (keyof T | string)[]) => void;
}

/**
 * Defines the return type of the useFileUploader composable.
 */
export interface FileUploaderResult {
    uploaderForm: UploaderFormState<UploaderInternalFormData>;
    fileInputRef: Ref<HTMLInputElement | null>;
    localPreviewUrl: Ref<string | null>;
    displayImageUrl: Ref<string>;
    triggerFileInput: () => void;
    onFileInputChange: (event: Event) => void;
    submitSelectedFile: (hooks?: {
        onSuccess?: (payload: ComposableUploadSuccessPayload) => void;
        onError?: (payload: ComposableUploadErrorPayload) => void;
        onProgress?: (payload: ComposableUploadProgressPayload) => void;
        onFinish?: () => void;
    }) => void;
    clearSelection: () => void;
}

/**
 * A Vue composable for handling file selection, validation, preview, and uploads.
 * @param options - Configuration for the file uploader.
 */
export function useFileUploader(options: FileUploaderOptions): FileUploaderResult {
    const {
        uploadUrl,
        currentImageUrl,
        defaultImageUrl = 'https://ui-avatars.com/api/?name=U&size=128',
        initialFormData = {},
        maxFileSizeMb = 5,
        acceptedMimes = 'image/jpeg,image/png,image/gif,image/webp',
        fileFieldName = 'file',
    } = options;

    const formSetupData: UploaderInternalFormData = {
        ...initialFormData,
        [fileFieldName]: null
    };

    const uploaderForm = reactive<UploaderFormState<UploaderInternalFormData>>({
        data: { ...formSetupData },
        errors: {},
        isSubmitting: false,
        clearErrors(name) {
            if (name) { delete this.errors[name]; }
            else { this.errors = {}; }
        },
        setError(name, message) { this.errors[name] = message; },
        reset(...fields) {
            if (fields.length === 0) { this.data = { ...formSetupData }; return; }
            fields.forEach((field) => { this.data[field] = formSetupData[field]; });
        }
    });

    const fileInputRef = ref<HTMLInputElement | null>(null);
    const localPreviewUrl = ref<string | null>(null);
    const displayImageUrl = computed(() => localPreviewUrl.value || currentImageUrl.value || defaultImageUrl);

    watch(currentImageUrl, (newUrlFromServer) => {
        if (newUrlFromServer && localPreviewUrl.value) { localPreviewUrl.value = null; }
    });
    watch(() => initialFormData, (newFormData) => {
        if (newFormData) {
            Object.entries(newFormData).forEach(([key, value]) => {
                if (key !== fileFieldName) { uploaderForm.data[key] = value; }
            });
        }
    }, { deep: true });

    const triggerFileInput = () => {
        uploaderForm.clearErrors(fileFieldName);
        fileInputRef.value?.click();
    };

    const onFileInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        uploaderForm.clearErrors(fileFieldName);
        localPreviewUrl.value = null;
        uploaderForm.data[fileFieldName] = null;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            if (file.size > maxFileSizeMb * 1024 * 1024) {
                uploaderForm.setError(fileFieldName, `File must be smaller than ${maxFileSizeMb}MB.`);
                target.value = ''; return;
            }
            const acceptedTypes = acceptedMimes.split(',').map((m) => m.trim().toLowerCase());
            if (!acceptedTypes.includes(file.type.toLowerCase()) && acceptedMimes !== '*/*') {
                uploaderForm.setError(fileFieldName, 'Invalid file type.');
                target.value = ''; return;
            }
            uploaderForm.data[fileFieldName] = file;
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => { localPreviewUrl.value = e.target?.result as string; };
                reader.readAsDataURL(file);
            }
        }
    };

    const submitSelectedFile = async (hooks?: {
        onSuccess?: (payload: ComposableUploadSuccessPayload<{ user: User }>) => void; // Defined response type
        onError?: (payload: ComposableUploadErrorPayload) => void;
        onProgress?: (payload: ComposableUploadProgressPayload) => void;
        onFinish?: () => void;
    }) => {
        const fileToUpload = uploaderForm.data[fileFieldName] as File | null;
        if (!fileToUpload) {
            uploaderForm.setError(fileFieldName, 'No file selected to upload.');
            hooks?.onError?.({ errors: { [fileFieldName]: 'No file selected.' } });
            return;
        }

        uploaderForm.isSubmitting = true;
        uploaderForm.clearErrors();

        const formData = new FormData();
        Object.entries(uploaderForm.data).forEach(([key, value]) => {
             if (value !== null && value !== undefined) {
                formData.append(key, value as Blob | string);
            }
        });

        try {
            // Use your centralized apiService for the request
            const response = await apiService.post<{ user: User }>(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event: AxiosProgressEvent) => {
                    if (event.total) {
                        const percentage = Math.round((event.loaded * 100) / event.total);
                        hooks?.onProgress?.({ percentage });
                    }
                }
            });
            
            // Your apiService returns the data directly, so we pass it on.
            hooks?.onSuccess?.({
                responseData: response,
                fileName: fileToUpload.name,
            });

        } catch (error) {
            // Your apiService interceptor provides a structured error object.
            const apiError = error as ApiError;

            const flattenedErrors: Record<string, string> = {};
            if (apiError.errors) {
                Object.entries(apiError.errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        flattenedErrors[field] = messages[0]; // Take the first message
                    }
                });
            }

            const errorPayload: ComposableUploadErrorPayload = {
                errors: Object.keys(flattenedErrors).length > 0 ? flattenedErrors : { server: 'Request failed.' },
                message: apiError.message || 'An unknown error occurred.',
                fileName: fileToUpload.name,
            };

            // Populate the local form errors from the structured error object
            Object.entries(errorPayload.errors).forEach(([key, value]) => {
                uploaderForm.setError(key, value);
            });
            
            hooks?.onError?.(errorPayload);

        } finally {
            uploaderForm.isSubmitting = false;
            uploaderForm.reset(fileFieldName);
            if (fileInputRef.value) {
                fileInputRef.value.value = '';
            }
            localPreviewUrl.value = null;
            hooks?.onFinish?.();
        }
    };

    const clearSelection = () => {
        uploaderForm.data[fileFieldName] = null;
        uploaderForm.clearErrors(fileFieldName);
        localPreviewUrl.value = null;
        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    };

    return {
        uploaderForm,
        fileInputRef,
        localPreviewUrl,
        displayImageUrl,
        triggerFileInput,
        onFileInputChange,
        submitSelectedFile,
        clearSelection,
    };
}