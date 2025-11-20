import { ref, reactive, watch } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { Article } from '@/types';
import { apiService } from '@/services/api.service';

interface PaginatedResponse {
    data: Article[];
    // Add other pagination links/meta if needed
}

export function useArticlesAPI() {
    const articles = ref<Article[]>([]);
    const article = ref<Article | null>(null);
    const availableCategories = ref<string[]>([]);
    const pagination = ref({});
    const activeFilters = reactive({
        category: '',
        page: 1,
    });
    const isLoading = ref(false);

    const fetchArticles = async () => {
        isLoading.value = true;
        try {
            const params = Object.fromEntries(
                Object.entries(activeFilters).filter(([, value]) => value !== '' && value !== null)
            );
            const response = await apiService.get<ApiResponse>('/public/articles', { params });
            articles.value = response.data.paginatedData.data;
            pagination.value = response.data.paginatedData;
            if (response.data.filters && response.data.filters.category) {
                availableCategories.value = response.data.filters.category;
            }
        } finally {
            isLoading.value = false;
        }
    };

    const fetchArticleBySlug = async (slug: string) => {
        isLoading.value = true;
        article.value = null;
        try {
            const response = await apiService.get<ApiResponse>(`/public/articles/${slug}`);
            article.value = response.data.article;
        } finally {
            isLoading.value = false;
        }
    };
    watch(() => activeFilters.category, () => {
        activeFilters.page = 1; // Reset to page 1 when category changes
        fetchArticles();
    });

    return { articles, article, pagination, activeFilters, availableCategories, isLoading, fetchArticles, fetchArticleBySlug };
}