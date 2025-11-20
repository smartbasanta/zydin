import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
// Make sure to create these types based on your backend models
import type { SystemNotification, SystemNotificationFormData } from '@/types/notification'; 
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useSystemNotificationFormAPI(notification?: SystemNotification | null) {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const notificationId = route.params.id as string;

    const notificationData = ref<SystemNotification | null>(notification || null);

    // Define the initial structure and default values for the form
    const initialData: SystemNotificationFormData = {
        text: notificationData.value?.text || '',
        route: notificationData.value?.route || null,
        link: notificationData.value?.link || null,
        type: notificationData.value?.type || 'info', // Default to 'info'
        expires_at: notificationData.value?.expires_at || null,
        is_visible: notificationData.value?.is_visible ?? true, // Default to true for new notifications
    };

    const form = reactive<SystemNotificationFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    // Watch for changes to mark the form and individual fields as dirty
    watch(
        form,
        (newForm) => {
            isDirty.value = false;
            dirtyFields.value = {};

            // Compare each field in the new form state to its initial state
            (Object.keys(initialData) as Array<keyof SystemNotificationFormData>).forEach((key) => {
                const initialValue = initialData[key];
                const currentValue = newForm[key];

                if (initialValue !== currentValue) {
                    dirtyFields.value[key] = true;
                    isDirty.value = true;
                } else {
                    dirtyFields.value[key] = false;
                }
            });
        },
        { deep: true }
    );

    const resetForm = () => {
        Object.assign(form, initialData);
        errors.value = {};
        isLoading.value = false;
        isDirty.value = false;
        dirtyFields.value = {};
    };

    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        try {
            let response: ApiResponse;
            const payload = { ...form };

            // Handle create vs. update
            if (notificationData.value?.id) {
                // Update existing notification
                response = await apiService.put<ApiResponse>(`/settings/system-notifications/${notificationData.value.id}`, payload);
                notify(response);
                router.push({ name: 'settings.system-notifications.show', params: { id: response.data.notification.id } });
            } else {
                // Create new notification
                response = await apiService.post<ApiResponse>('/settings/system-notifications', payload);
                notify(response);
                router.push({ name: 'settings.system-notifications.show', params: { id: response.data.notification.id } });
            }
            // After successful submission, update initialData to reset the dirty state
            Object.assign(initialData, response.data.notification);
            Object.assign(form, response.data.notification);
            isDirty.value = false;
            dirtyFields.value = {};

        } catch (error: any) {
            if (error.errors) {
                errors.value = error.errors;
            }
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNotification = async () => {
        if (!notificationId) {
            // This is a 'create' page, no data to fetch
            notificationData.value = null;
            Object.assign(form, initialData);
            return;
        }

        isLoading.value = true;
        try {
            // The edit method in your controller returns the notification data
            const response = await apiService.get<ApiResponse>(`/settings/system-notifications/${notificationId}`);
            notificationData.value = response.data.notification;
            
            // Update both initialData and the form with fetched values
            Object.assign(initialData, notificationData.value);
            Object.assign(form, notificationData.value);
            dirtyFields.value = {}; // Reset dirty fields after fetch
            
            return notificationData;
        } catch (err) {
            notifyError(err as any, 'Failed to load notification details');
            router.push({ name: 'settings.system-notifications.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (notificationId && !notificationData.value) {
            fetchNotification();
        }
    });

    return {
        form,
        errors,
        isLoading,
        isDirty,
        dirtyFields,
        submit,
        resetForm,
    };
}