import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '@/services/api.service';
import type { RegisterCredentials, AuthResponse } from '@/types/auth';
import type { ApiError } from '@/types/api';
import { useAuthStore } from '@/stores/auth.store';
import { useNotifyQStore } from '@/stores/notify.q.store'
import type { NotificationQType } from '@/types/notification';
import { useNotifier } from '@/composables/useNotifier';

export function useRegisterForm() {
    const authStore = useAuthStore();
    const router = useRouter();

    const { notify, error: notifyError } = useNotifier('bottom-right');
    
    const isLoading = ref(false);
    const error = ref<ApiError | null>(null);

    const notifyQStore = useNotifyQStore();

    const register = async (credentials: RegisterCredentials): Promise<boolean> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await apiService.post<AuthResponse & { notification: NotificationQType }>('/dashboard/register-user', credentials);
            // console.log(response);
            // authStore._handleAuthSuccess(response);
            // await router.push({ path: '/dashboard/register' });

            notify(response)
            return true;
        } catch (err) {
            error.value = err as ApiError;

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
        register,
        clearError,
    };
}