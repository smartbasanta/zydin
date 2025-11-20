import { reactive, ref } from 'vue';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '../useNotifier';
import { apiService } from '@/services/api.service';

export function useContactAPI() {
    const form = reactive({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const isSubmitting = ref(false);
    const { notify, error: notifyError } = useNotifier();

    const submitContactForm = async () => {
        isSubmitting.value = true;
        try {
            const response = await apiService.post<ApiResponse>('/public/contact-query/submit', form);
            notify(response.notification);
            // Reset form on success
            Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' });
            return true;
        } catch (err: any) {
            notifyError(err, 'Submission Failed');
            return err.errors || {};
        } finally {
            isSubmitting.value = false;
        }
    };

    return { form, isSubmitting, submitContactForm };
}