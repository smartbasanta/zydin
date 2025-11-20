<script setup lang="ts">
    import { CopyIcon } from 'lucide-vue-next';
    import { apiService } from '@/services/api.service';
    import { useNotifier } from '@/composables/useNotifier';
    import { inject } from 'vue';

    interface Props {
        itemId: number | string;
        duplicateUrl: string; // e.g., /api/resource/duplicate/
        itemName?: string;
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{ (e: 'duplicated'): void }>();
    const { notify, error: notifyError } = useNotifier();
    const refreshData = inject<() => void>('refreshData');

    const duplicateItem = async () => {
        try {
            await apiService.post(`${props.duplicateUrl}${props.itemId}`);
            // notify({ type: 'success', title: 'Duplicated', message: `${props.itemName || 'Item'} duplicated successfully.` });
            emit('duplicated');
            if (refreshData) refreshData();
        } catch (err: any) {
            console.error("Duplicate error:", err);
            notifyError(err, `Failed to duplicate ${props.itemName || 'item'}`);
        }
    };
</script>

<template>
    <button
        @click="duplicateItem"
        class="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-105"
        title="Duplicate"
    >
        <span class="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-200/20 via-yellow-300/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        <span class="absolute inset-0 rounded-lg border border-white/30 dark:border-white/10 group-hover:border-yellow-400/40 transition-colors duration-300 z-10"></span>
        <CopyIcon class="w-4 h-4 relative z-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]" />
        <span class="sr-only">Duplicate</span>
    </button>
</template>