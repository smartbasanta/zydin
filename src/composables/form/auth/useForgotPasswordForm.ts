import { ref } from 'vue';
import { apiService } from '@/services/api.service';
import type { ForgotPasswordData } from '@/types/auth';
import type { ApiError } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import type { NotificationQType } from '@/types/notification';

export function useForgotPasswordForm() {
    const isLoading = ref(false);
    const error = ref<ApiError | null>(null);
    const statusMessage = ref<string | null>(null);

    const { notify, error: notifyError } = useNotifier('bottom-right');

    const sendResetLink = async (data: ForgotPasswordData) => {
        isLoading.value = true;
        error.value = null;
        statusMessage.value = null;
        
        try {
            const response = await apiService.post<{ 
                status: string;
                notification?: NotificationQType;
                message?: string;
            }>('/forgot-password', data);
            statusMessage.value = response.message ?? '';
            notify(response)
        } catch (err: any) {
            const apiError = err?.response?.data || err;
            error.value = apiError;

            notifyError(error.value);
            throw err;
            
        } finally {
            isLoading.value = false;
        }
    };
    
    const clearError = () => {
        error.value = null;
    };

    return {
        isLoading,
        error,
        statusMessage,
        sendResetLink,
        clearError,
    };
}