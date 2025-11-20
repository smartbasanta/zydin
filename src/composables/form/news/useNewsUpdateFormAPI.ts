import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { NewsUpdate, NewsUpdateFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

const toYYYYMMDD = (dateStr: string | undefined | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
};

export function useNewsUpdateFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const newsUpdateId = route.params.id as string | undefined;

    const initialData = reactive<NewsUpdateFormData>({
        title: '',
        slug: '',
        publish_date: toYYYYMMDD(new Date().toISOString()),
        source: '',
        excerpt: '',
        full_content: '',
        link: '',
        is_featured: false,
        image_url: '',
        image: null,
    });

    const form = reactive<NewsUpdateFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof NewsUpdateFormData>).forEach((key) => {
            if (initialData[key] !== newForm[key]) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });
    
    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formData.append(key, value as File);
            } else if (key !== 'image' && key !== 'image_url' && value !== null) {
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (newsUpdateId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/news/${newsUpdateId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/news', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.news.show', params: { id: response.data.newsUpdate.id } });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNewsUpdate = async () => {
        if (!newsUpdateId) return;

        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/news/${newsUpdateId}`);
            const fetchedData = response.data.newsUpdate;
            
            const formattedData = {
                ...fetchedData,
                publish_date: toYYYYMMDD(fetchedData.publish_date),
                image: null,
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load news/update details');
            router.push({ name: 'dashboard.news.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (newsUpdateId) {
            fetchNewsUpdate();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}