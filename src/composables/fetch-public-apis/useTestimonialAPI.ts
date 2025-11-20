import { ref, reactive } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { Testimonial } from '@/types'; // Assuming you have this type
import { apiService } from '@/services/api.service';

export function useTestimonialsAPI() {
    const testimonials = ref<Testimonial[]>([]);
    const filters = reactive({
        type: '', // 'customer' or 'employee'
    });
    const isLoading = ref(false);

    const fetchTestimonials = async () => {
        isLoading.value = true;
        try {
            const response: ApiResponse = await apiService.get<ApiResponse>('/public/testimonials', { params: filters });
            // console.log(response);
            testimonials.value = response.data.paginatedData.data;
        } finally {
            isLoading.value = false;
        }
    };

    return { testimonials, filters, isLoading, fetchTestimonials };
}