import { ref, reactive } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { NewsUpdate } from '@/types'; // Assuming you have this type
import { apiService } from '@/services/api.service';

export function useNewsAPI() {
    const newsUpdates = ref<NewsUpdate[]>([]);
    const newsUpdate = ref<NewsUpdate | null>(null);
    const pagination = ref({});
    const filters = reactive({ page: 1 });
    const isLoading = ref(false);

    const fetchNewsUpdates = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>('/public/news-updates', { params: filters });
            newsUpdates.value = response.data.paginatedData.data;
            pagination.value = response.data.paginatedData;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNewsUpdateBySlug = async (slug: string) => {
        isLoading.value = true;
        newsUpdate.value = null;
        try {
            const response = await apiService.get<ApiResponse>(`/public/news-updates/${slug}`);
            newsUpdate.value = response.data.news_update;
        } finally {
            isLoading.value = false;
        }
    };

    return { newsUpdates, newsUpdate, pagination, filters, isLoading, fetchNewsUpdates, fetchNewsUpdateBySlug };
}