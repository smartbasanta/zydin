import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Testimonial, TestimonialFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useTestimonialFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const testimonialId = route.params.id as string | undefined;

    const initialData = reactive<TestimonialFormData>({
        name: '',
        role: '',
        rating: 5,
        text: '',
        type: 'customer',
        is_featured: false,
        avatar_url: '',
        avatar: null,
    });

    const form = reactive<TestimonialFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof TestimonialFormData>).forEach((key) => {
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
            if (key === 'avatar' && value) {
                formData.append(key, value as File);
            } else if (key !== 'avatar' && key !== 'avatar_url' && value !== null) {
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (testimonialId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/testimonials/${testimonialId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/testimonials', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.testimonials.show', params: { id: response.data.testimonial.id } });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTestimonial = async () => {
        if (!testimonialId) return;

        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/testimonials/${testimonialId}`);
            const fetchedData = response.data.testimonial;
            
            const formattedData = {
                ...fetchedData,
                avatar: null, // Reset file input
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load testimonial details');
            router.push({ name: 'dashboard.testimonials.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (testimonialId) {
            fetchTestimonial();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}