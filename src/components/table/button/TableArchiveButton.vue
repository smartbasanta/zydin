<script setup lang="ts">
import { ref, inject } from 'vue';
import { ArchiveIcon, Loader2Icon } from 'lucide-vue-next';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

interface Props {
    itemId: number | string;
    archiveUrl: string;
    itemName?: string;
    // Visual props
    iconOnly?: boolean;
    label?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    iconOnly: false,
    label: 'Archive',
    disabled: false,
});

const emit = defineEmits<{ (e: 'archived'): void }>();
const { notify, error: notifyError } = useNotifier();
const refreshData = inject<() => void>('refreshData');

const isLoading = ref(false);

const archiveItem = async () => {
    if (isLoading.value || props.disabled) return;

    isLoading.value = true;
    try {
        // Ensure URL format is correct (handling trailing slashes)
        const finalUrl = props.archiveUrl.endsWith('/') 
            ? `${props.archiveUrl}${props.itemId}`
            : `${props.archiveUrl}/${props.itemId}`;

        const response:ApiResponse = await apiService.post(finalUrl);
        notify(response); // Use response message from API
        
        emit('archived');
        if (refreshData) refreshData();
    } catch (err: any) {
        notifyError(err, `Failed to archive ${props.itemName || 'item'}`);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <button
        @click="archiveItem"
        type="button"
        class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :class="[
            iconOnly ? 'p-2.5' : 'px-4 py-2 gap-2',
            // Default State
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm',
            // Hover/Active State
            !disabled && !isLoading ? 'hover:border-purple-500/50 dark:hover:border-purple-400/50 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md hover:-translate-y-0.5' : 'opacity-70 cursor-not-allowed'
        ]"
        :disabled="disabled || isLoading"
        :title="iconOnly ? label : undefined"
    >
        <!-- Hover Background Fill Effect -->
        <span 
            v-if="!disabled && !isLoading" 
            class="absolute inset-0 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></span>

        <!-- Loading Icon -->
        <Loader2Icon 
            v-if="isLoading" 
            class="relative z-10 animate-spin"
            :class="iconOnly ? 'w-5 h-5' : 'w-4 h-4'"
        />

        <!-- Archive Icon -->
        <ArchiveIcon 
            v-else
            class="relative z-10 transition-transform duration-300 group-hover:scale-110" 
            :class="iconOnly ? 'w-5 h-5' : 'w-4 h-4'"
        />
        
        <!-- Text Label -->
        <span v-if="!iconOnly" class="relative z-10 text-sm font-medium tracking-wide">
            {{ isLoading ? 'Archiving...' : label }}
        </span>
    </button>
</template>