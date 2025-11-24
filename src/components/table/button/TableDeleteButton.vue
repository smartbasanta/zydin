<script setup lang="ts">
    import { Trash2Icon } from 'lucide-vue-next';
    import { useConfirmModal } from '@/composables/useConfirmModal';
    import { inject } from 'vue';

    interface Props {
        itemId: number | string;
        deleteUrl: string;
        itemName?: string;
        confirmMessage?: string;
    }
    const props = withDefaults(defineProps<Props>(), {
        confirmMessage: 'Are you sure you want to delete this item?',
    });

    const emit = defineEmits<{ (e: 'deleted'): void }>();
    const { show } = useConfirmModal();
    const refreshData = inject<() => void>('refreshData');

    const triggerDelete = () => {
        // console.log('Delete button clicked', { itemId: props.itemId, deleteUrl: props.deleteUrl, itemName: props.itemName });
        show({
            itemId: props.itemId,
            deleteUrl: props.deleteUrl,
            itemName: props.itemName,
            confirmMessage: props.confirmMessage,
            onDeleted: () => {
                // console.log('Emitting deleted event');
                emit('deleted');
            },
        });
    };
</script>

<template>
    <button
        @click="triggerDelete"
        class="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-105 cursor-pointer"
        title="Delete"
    >
        <span class="absolute inset-0 rounded-lg bg-gradient-to-br from-red-200/20 via-red-300/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        <span class="absolute inset-0 rounded-lg border border-white/30 dark:border-white/10 group-hover:border-red-400/40 transition-colors duration-300 z-10"></span>
        <Trash2Icon class="w-4 h-4 relative z-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]" />
        <span class="sr-only">Delete</span>
    </button>
</template>