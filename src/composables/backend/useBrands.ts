import { ref, onMounted } from 'vue';
import type { Brand } from '@/types';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';

export function useBrands() {
    // Use ref to make the brands list reactive
    const brands = ref<Brand[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const fetchBrands = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            // The API response is directly assigned to brands.value
            const response = await apiService.get<ApiResponse>('dashboard/brands-for-select');
            // console.log(response.data);
            brands.value = response.data;
        } catch (e) {
            console.error('Failed to fetch brands:', e);
            error.value = 'Failed to load brands. Please try again.';
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch the brands as soon as the composable is used
    onMounted(fetchBrands);

    // Expose the reactive state to the component
    return {
        brands,
        isLoading,
        error
    };
}