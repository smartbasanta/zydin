import { ref } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { NotificationQType } from '@/types/notification';

interface ConfirmModalState {
    isVisible: boolean;
    itemId: number | string | null;
    deleteUrl: string;
    itemName?: string;
    confirmMessage?: string;
    onDeleted?: () => void;
}

// Create a single instance of the state
const state = ref<ConfirmModalState>({
    isVisible: false,
    itemId: null,
    deleteUrl: '',
    itemName: '',
    confirmMessage: 'Are you sure you want to delete this item?',
});

const { notify, error: notifyError } = useNotifier();

export const useConfirmModal = () => {
    const show = (props: {
        itemId: number | string;
        deleteUrl: string;
        itemName?: string;
        confirmMessage?: string;
        onDeleted?: () => void;
    }) => {
        // console.log('Showing modal with props:', props); // Debug log
        state.value = {
            ...state.value,
            ...props,
            isVisible: true,
        };
    };

    const confirm = async (refreshData?: () => void) => {
        if (!state.value.itemId || !state.value.deleteUrl) {
            console.warn('Missing itemId or deleteUrl'); // Debug log
            return;
        }

        try {
            // console.log('Deleting item:', `${state.value.deleteUrl}${state.value.itemId}`); // Debug log
            await apiService.delete(`${state.value.deleteUrl}${state.value.itemId}`);
            notify({
                notification: {
                    type: 'success',
                    message: `${state.value.itemName || 'Item'} deleted successfully.`,
                },
            });
            if (refreshData) {
                // console.log('Calling refreshData'); // Debug log
                refreshData();
            }
            if (state.value.onDeleted) {
                // console.log('Calling onDeleted'); // Debug log
                state.value.onDeleted();
            }
        } catch (err: any) {
            console.error('Delete error:', err); // Debug log
            notifyError(err, `Failed to delete ${state.value.itemName || 'item'}`);
        } finally {
            // console.log('Closing modal'); // Debug log
            state.value.isVisible = false;
        }
    };

    const cancel = () => {
        // console.log('Canceling modal'); // Debug log
        state.value.isVisible = false;
    };

    return {
        state,
        show,
        confirm,
        cancel,
    };
};