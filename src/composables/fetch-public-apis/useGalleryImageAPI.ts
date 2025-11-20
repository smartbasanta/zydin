import { ref, reactive, watch } from 'vue';
import type { ApiResponse } from '@/types/api'; // Assuming a generic ApiResponse type exists
import type { GalleryImage } from '@/types'; // Using the GalleryImage type you provided
import { apiService } from '@/services/api.service'; // Assuming a central apiService

/**
 * Interface for the active filters that can be applied when fetching gallery images.
 */
interface GalleryFilters {
    group: 'company_culture' | 'employee_life' | 'corporate_social_responsibility' | '';
    featured: boolean | null;
    limit: number | null;
}

/**
 * The expected structure of the API response for gallery images.
 */
interface GalleryImageResponse {
    images: GalleryImage[];
}

/**
 * Composable function to interact with the public gallery images API.
 *
 * @returns An object with reactive state and methods for fetching gallery images.
 */
export function useGalleryImageAPI() {
    // Reactive state to hold the fetched gallery images
    const images = ref<GalleryImage[]>([]);

    // Reactive state to track the loading status of the API call
    const isLoading = ref(false);

    // Reactive object to hold the filters for the API request
    const activeFilters = reactive<GalleryFilters>({
        group: '',
        featured: null,
        limit: null,
    });

    /**
     * Fetches gallery images from the API based on the current activeFilters.
     */
    const fetchImages = async () => {
        isLoading.value = true;
        try {
            // Construct query parameters from activeFilters, excluding null or empty values.
            const params = Object.fromEntries(
                Object.entries(activeFilters).filter(([, value]) => value !== '' && value !== null)
            );

            // Make the API call to the endpoint defined in your Laravel routes.
            const response = await apiService.get<ApiResponse<GalleryImageResponse>>('/public/companyimages', { params });

            // Update the images ref with the data from the response.
            if (response.data && response.data.images) {
                images.value = response.data.images;
            }

        } catch (error) {
            console.error("Failed to fetch gallery images:", error);
            // Optionally reset images or handle the error in the UI
            images.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // Watch for changes in the activeFilters object and re-fetch the images automatically.
    // The { deep: true } option is important for watching changes inside the reactive object.
    watch(activeFilters, () => {
        fetchImages();
    }, { deep: true });

    // Expose the reactive state and the fetch method to the component using this composable.
    return {
        images,
        isLoading,
        activeFilters,
        fetchImages,
    };
}