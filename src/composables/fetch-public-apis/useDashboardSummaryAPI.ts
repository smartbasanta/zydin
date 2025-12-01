import { ref } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { DashboardSummary } from '@/types/dashboard';
import { useNotifier } from '@/composables/useNotifier';

export function useDashboardSummaryAPI() {
    const { error: notifyError } = useNotifier();
    
    const stats = ref<DashboardSummary | null>(null);
    const isLoading = ref(false);

    const fetchSummary = async () => {
        isLoading.value = true;
        try {
            // Matches the controller route we created: /dashboard/summary
            const response = await apiService.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
            
            // Assuming your API wrapper returns the data directly in response.data
            // or response.data.data depending on your ApiResponse type definition.
            // Based on previous context, it seems to be response.data:
            stats.value = response.data as unknown as DashboardSummary; 
            console.log(response.data);
        } catch (err) {
            notifyError(err as any, 'Failed to load dashboard summary');
        } finally {
            isLoading.value = false;
        }
    };

    return {
        stats,
        isLoading,
        fetchSummary
    };
}