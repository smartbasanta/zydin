import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { GalleryImage, GalleryImageFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useGalleryImageFormAPI() {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const galleryImageId = route.params.id as string | undefined;

    const initialData = reactive<GalleryImageFormData>({
        caption: '',
        alt_text: '',
        gallery_group: 'company_culture',
        order_column: 0,
        image_url: '',
        image: null,
        is_featured:false,
    });

    const form = reactive<GalleryImageFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof GalleryImageFormData>).forEach((key) => {
            if (initialData[key] !== newForm[key]) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });
    
    // REFACTORED: To match the robust pattern from useArticleFormAPI
    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formData.append(key, value as File);
            } else if (key !== 'image' && key !== 'image_url' && value !== null) {
                // CORRECTED: Added boolean conversion for consistency, even if not used here currently.
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append(key, String(val));
            }
        });

        try {
            let response: ApiResponse;
            
            if (galleryImageId) {
                formData.append('_method', 'PUT');
                response = await apiService.post<ApiResponse>(`/dashboard/gallery/${galleryImageId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await apiService.post<ApiResponse>('/dashboard/gallery', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            
            notify(response);
            router.push({ name: 'dashboard.gallery.show', params: { id: response.data.galleryImage.id } });

        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchGalleryImage = async () => {
        if (!galleryImageId) return;

        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/gallery/${galleryImageId}`);
            const fetchedData = response.data.galleryImage;
            
            const formattedData = {
                ...fetchedData,
                image: null, 
            };
            Object.assign(initialData, formattedData);
            Object.assign(form, formattedData);
            dirtyFields.value = {};
            
        } catch (err) {
            notifyError(err as any, 'Failed to load image details');
            router.push({ name: 'dashboard.gallery.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (galleryImageId) {
            fetchGalleryImage();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}