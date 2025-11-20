import { ref } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { Certification } from '@/types'; // Assuming you have this type
import { apiService } from '@/services/api.service';

export function useCertificationsAPI() {
    const certifications = ref<Certification[]>([]);
    const isLoading = ref(false);

    const fetchCertifications = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>('/public/certifications');
            certifications.value = response.data.certifications;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchCertificationByTitle = async (title: string | string) => {
        isLoading.value = true;
        certifications.value = [];
        try {
            const response = await apiService.get<ApiResponse>(`/public/certifications/${title}`);
            certifications.value = response.data.certifications;
        } finally {
            isLoading.value = false;
        }
    };

    return { certifications, isLoading, fetchCertifications, fetchCertificationByTitle };
}