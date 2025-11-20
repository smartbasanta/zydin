import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { PageContentBlock } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';

interface PageDetails {
    title: string;
    description: string;
}

export function usePageContentFormAPI(pageSlug: string) {
    const { notify, error: notifyError } = useNotifier();

    const form = reactive<{ content_blocks: PageContentBlock[] }>({ content_blocks: [] });
    const pageDetails = reactive<PageDetails>({ title: '', description: '' });
    const initialData = ref<string>('');
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);

    watch(form, (newForm) => {
        isDirty.value = JSON.stringify(newForm.content_blocks) !== initialData.value;
    }, { deep: true });
    
    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        // ----> THE CRITICAL CHANGE IS HERE <----
        // We will transform the data to send ONLY what the backend needs.
        const payload = {
            content_blocks: form.content_blocks.map(block => {
                // Create a new object with just the key and value.
                return {
                    key: block.key,
                    value: block.value
                };
            })
        };
        // ----------------------------------------

        try {
            // Now, send the clean 'payload' instead of the entire 'form' object.
            const response = await apiService.put<ApiResponse>(`/dashboard/page-content/${pageSlug}`, payload);
            
            notify(response);
            // After success, we still reset the dirty state using the original form data
            initialData.value = JSON.stringify(form.content_blocks);
            isDirty.value = false;
        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchPageContent = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/page-content/${pageSlug}`);
            form.content_blocks = response.data.pageContent;
            
            pageDetails.title = response.data.title;
            pageDetails.description = response.data.description;

            initialData.value = JSON.stringify(response.data.pageContent);
            isDirty.value = false;
        } catch (err) {
            notifyError(err as any, 'Failed to load page content');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(fetchPageContent);

    return { form, errors, isLoading, isDirty, submit, pageDetails };
}