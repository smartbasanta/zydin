import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Article, ArticleFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

const toYYYYMMDD = (dateStr: string | undefined | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
};

export function useArticleFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const articleId = route.params.id as string | undefined;

    const initialData = reactive<ArticleFormData>({
        title: '',
        slug: '',
        author: '',
        author_title: '',
        publish_date: toYYYYMMDD(new Date().toISOString()),
        category: 'Industry Insights',
        image_url: '',
        image: null,
        excerpt: '',
        content: '',
        is_featured: false,
    });

    const form = reactive<ArticleFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof ArticleFormData>).forEach((key) => {
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
        // TypeScript can be tricky with FormData, so we build it carefully
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formData.append(key, value as File);
            } else if (key !== 'image' && key !== 'image_url' && value !== null) {
                // Convert boolean to 1 or 0 for backend
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (articleId) {
                // Use POST with _method spoofing for multipart/form-data updates
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/articles/${articleId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/articles', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.articles.show', params: { id: response.data.article.id } });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchArticle = async () => {
        if (!articleId) return;

        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/articles/${articleId}`);
            const fetchedData = response.data.article;
            
            const formattedData = {
                ...fetchedData,
                publish_date: toYYYYMMDD(fetchedData.publish_date),
                image: null, // Reset file input
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load article details');
            router.push({ name: 'dashboard.articles.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (articleId) {
            fetchArticle();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}