import { ref } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { Leader } from '@/types'; // Assuming you have this type
import { apiService } from '@/services/api.service';

export function useLeadersAPI() {
    const leaders = ref<Leader[]>([]);
    const leader = ref<Leader | null>(null);
    const isLoading = ref(false);

    const fetchLeaders = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>('/public/leaders');
            leaders.value = response.data.leaders;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchLeaderById = async (id: number | string) => {
        isLoading.value = true;
        leader.value = null;
        try {
            const response = await apiService.get<ApiResponse>(`/public/leaders/${id}`);
            leader.value = response.data.leader;
        } finally {
            isLoading.value = false;
        }
    };

    return { leaders, leader, isLoading, fetchLeaders, fetchLeaderById };
}