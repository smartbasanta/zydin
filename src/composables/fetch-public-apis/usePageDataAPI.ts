import { ref } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { AboutPageData } from '@/types';
export function usePageDataAPI() {
    const homepageData = ref(null);
    const aboutPageData = ref<AboutPageData>();
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchHomepageData = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiService.get<ApiResponse>('/public/homepage');
            // console.log(response);
            homepageData.value = response.data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchAboutPageData = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response: ApiResponse = await apiService.get<ApiResponse>('/public/about-us');
            // console.log(response.data);
            aboutPageData.value = response.data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        homepageData,
        aboutPageData,
        isLoading,
        error,
        fetchHomepageData,
        fetchAboutPageData,
    };
}