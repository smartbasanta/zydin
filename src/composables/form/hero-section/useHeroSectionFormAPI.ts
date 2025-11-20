import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { HeroSlide, HeroSlideFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useHeroSlideFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const heroSlideId = route.params.id as string | undefined;

    // Correctly define initialData as a standalone reactive object
    const initialData = reactive<HeroSlideFormData>({
        title: '',
        description: '',
        link_text: '',
        link_url: '',
        order_column: 0,
        is_active: true,
        image_url: '',
        image: null,
    });

    const form = reactive<HeroSlideFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof HeroSlideFormData>).forEach((key) => {
            if (initialData[key] !== newForm[key]) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });
    
    // Correctly implemented submit logic, mirroring useArticleFormAPI
    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formData.append(key, value as File);
            } else if (key !== 'image' && key !== 'image_url' && value !== null) {
                // Convert boolean to 1 or 0 for the backend
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (heroSlideId) {
                // Use POST with _method spoofing for multipart/form-data updates
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/hero-slides/${heroSlideId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // Standard POST for creation
                response = await apiService.post<ApiResponse>('/dashboard/hero-slides', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            // Redirect to the index page after submission
            router.push({ name: 'dashboard.hero-slides.index' });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    // Correctly implemented fetch logic
    const fetchHeroSlide = async () => {
        if (!heroSlideId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/hero-slides/${heroSlideId}`);
            const fetchedData = response.data.heroSlide;
            
            const formattedData = {
                ...fetchedData,
                image: null, // Always reset the file input
            };
            // Correctly update both initialData and form to reset dirty state
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            isDirty.value = false;
            
        } catch (err) {
            notifyError(err as any, 'Failed to load slide details');
            router.push({ name: 'dashboard.hero-slides.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (heroSlideId) {
            fetchHeroSlide();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}