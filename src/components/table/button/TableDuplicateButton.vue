<script setup lang="ts">
import { ref, inject } from 'vue';
import { CopyIcon, Loader2Icon } from 'lucide-vue-next';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from '@/types/api';

interface Props {
    itemId: number | string;
    duplicateUrl: string;
    itemName?: string;
    iconOnly?: boolean;
    label?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    iconOnly: false,
    label: 'Duplicate',
    disabled: false,
});

const emit = defineEmits<{ (e: 'duplicated'): void }>();
const { notify, error: notifyError } = useNotifier();
const refreshData = inject<() => void>('refreshData');

const isLoading = ref(false);

const duplicateItem = async () => {
    if (isLoading.value || props.disabled) return;

    isLoading.value = true;
    try {
        const finalUrl = props.duplicateUrl.endsWith('/') 
            ? `${props.duplicateUrl}${props.itemId}`
            : `${props.duplicateUrl}/${props.itemId}`;

        const response:ApiResponse = await apiService.post(finalUrl);
        notify(response);
        emit('duplicated');
        if (refreshData) refreshData();
    } catch (err: any) {
        notifyError(err, `Failed to duplicate ${props.itemName || 'item'}`);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <button
        @click="duplicateItem"
        type="button"
        class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :class="[
            iconOnly ? 'p-2.5' : 'px-4 py-2 gap-2',
            // Default
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm',
            // Hover
            !disabled && !isLoading ? 'hover:border-amber-500/50 dark:hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-md hover:-translate-y-0.5' : 'opacity-70 cursor-not-allowed'
        ]"
        :disabled="disabled || isLoading"
        :title="iconOnly ? label : undefined"
    >
        <!-- Hover Fill -->
        <span 
            v-if="!disabled && !isLoading" 
            class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></span>

        <component
            :is="isLoading ? Loader2Icon : CopyIcon"
            class="relative z-10 transition-transform duration-300 group-hover:scale-110" 
            :class="[
                iconOnly ? 'w-5 h-5' : 'w-4 h-4',
                { 'animate-spin': isLoading }
            ]"
        />
        
        <span v-if="!iconOnly" class="relative z-10 text-sm font-medium tracking-wide">
            {{ isLoading ? 'Copying...' : label }}
        </span>
    </button>
</template>