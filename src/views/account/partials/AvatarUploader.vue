<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import {
    type ComposableUploadSuccessPayload,
    type ComposableUploadErrorPayload,
    type ComposableUploadProgressPayload,
} from '@/types/media';
import ImageUploader from '@/components/media/ImageUploader.vue';

const props = defineProps<{
    uploadUrl: string;
}>();

const emit = defineEmits<{
    (e: 'upload-success', payload: ComposableUploadSuccessPayload): void;
    (e: 'upload-error', payload: ComposableUploadErrorPayload): void;
    (e: 'upload-progress', payload: ComposableUploadProgressPayload): void;
    (e: 'file-selected', file: File | null): void;
}>();

// 1. Get the auth store and reactive user state
const authStore = useAuthStore();
const { currentUser: authUser } = storeToRefs(authStore);

// 2. Helper to generate a default avatar URL from user's name
function getDefaultAvatar() {
    const name = authUser.value?.username || authUser.value?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=7F9CF5&background=EBF4FF&bold=true&size=128`;
}

// 3. Initialize the local avatar URL from the store or generate a default
const currentAvatarUrl = ref(authUser.value?.avatar_url || getDefaultAvatar());

// 4. Watch for changes in the user's avatar URL from the store
watch(
    () => authUser.value?.avatar_url,
    (newUrl) => {
        currentAvatarUrl.value = newUrl || getDefaultAvatar();
        console.log('Avatar URL updated:', currentAvatarUrl.value);
    },
);

// 5. Watch for changes to the user's name to update the default avatar
watch(
    () => authUser.value?.username,
    () => {
        // Only update if they are still using the default avatar
        if (!authUser.value?.avatar_url) {
            currentAvatarUrl.value = getDefaultAvatar();
        }
    }
);
// Handle successful avatar upload
const handleAvatarUploadSuccess = (payload: ComposableUploadSuccessPayload) => {
    // We expect the API to return the updated user object
    const updatedUser = payload.responseData.data.user;

    if (updatedUser) {
        // --- THIS IS THE FIX ---
        // Call the new action to update the user in the store.
        // We pass a partial object with only the fields that changed.
        authStore.updateUser({ avatar_url: updatedUser.avatar_url });
        // --- END FIX ---
    }
    emit('upload-success', payload);
};
// Handle successful avatar upload
// const handleAvatarUploadSuccess = (payload: ComposableUploadSuccessPayload) => {
//     const newImageUrl = (payload.responseData as any)?.data.user?.avatar_url;
//     if (newImageUrl && authUser.value) {
//         // Update the central Pinia store, which will reactively update the UI
//         authStore.user!.avatar_url = newImageUrl;
//     }
//     emit('upload-success', payload);
// };
</script>

<template>
    <!-- The component now focuses solely on providing the ImageUploader with the correct props and handling events -->
    <ImageUploader
        :upload-url="props.uploadUrl"
        :current-image-url="currentAvatarUrl"
        :default-image-url="getDefaultAvatar()"
        file-field-name="file"
        aria-label="Upload new profile picture"
        wrapper-class="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md focus-within:ring-4 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300"
        @upload-success="handleAvatarUploadSuccess"
        @upload-error="emit('upload-error', $event)"
        @upload-progress="emit('upload-progress', $event)"
        @file-selected="emit('file-selected', $event)"
    />
</template>