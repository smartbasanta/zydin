import { ref } from 'vue';
import { apiService } from '@/services/api.service';
import type { ResetPasswordData } from '@/types/auth';
import type { ApiError } from '@/types/api';
import { useRouter } from 'vue-router';

export function usePasswordResetForm() {
    const router = useRouter();

    const isLoading = ref(false);
    const error = ref<ApiError | null>(null);
    const statusMessage = ref<string | null>(null);

    const resetPassword = async (data: ResetPasswordData) => {
        isLoading.value = true;
        error.value = null;
        statusMessage.value = null;
        try {
            const response = await apiService.post<{ status: string }>('/reset-password', data);
            statusMessage.value = response.status;

            // On success, redirect to login after a delay
            setTimeout(() => router.push({ name: 'login' }), 3000);

        } catch (err) {
            error.value = err as ApiError;
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
        resetPassword,
        clearError,
    };
}