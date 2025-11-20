import { ref, reactive, watch } from 'vue';
import type { ApiResponse } from '@/types/api';
import type { Product, Brand } from '@/types';
import { apiService } from '@/services/api.service';

// Define the shape of the filter options from the API
interface ProductFilters {
    types: string[];
    brands: Brand[];
    categories: string[];
}

export function useProductsAPI() {
    // State for the list of products
    const products = ref<Product[]>([]);
    const pagination = ref({});

    // State for a single product detail view
    const product = ref<Product | null>(null);
    const relatedProducts = ref<Product[]>([]);

    // State for available filter options
    const availableFilters = ref<ProductFilters>({ types: [], brands: [], categories: [] });

    // Reactive object for the user's current filter selections
    const activeFilters = reactive({
        type: '',
        brand_id: '',
        category: '',
        search: '',
        is_featured: false,
        page: 1,
    });

    const isLoading = ref(false);

    const fetchProducts = async () => {
        isLoading.value = true;
        try {
            // Filter out empty values from the filters object before sending
            const params = Object.fromEntries(
                Object.entries(activeFilters).filter(([, value]) => value)
            );

            const response = await apiService.get<ApiResponse>('/public/products', { params });
            products.value = response.data.paginatedData.data;
            pagination.value = response.data.paginatedData;
            if (response.data.filters) {
                availableFilters.value = response.data.filters;
            }
        } finally {
            isLoading.value = false;
        }
    };

    const fetchProductBySlug = async (slug: string) => {
        isLoading.value = true;
        product.value = null;
        relatedProducts.value = [];
        try {
            const response = await apiService.get<ApiResponse>(`/public/products/${slug}`);
            product.value = response.data.product;
            relatedProducts.value = response.data.relatedProducts;
            // console.log(response.data)
        } finally {
            isLoading.value = false;
        }
    };

    const resetFilters = () => {
        activeFilters.type = '';
        activeFilters.brand_id = '';
        activeFilters.category = '';
        activeFilters.search = '';
        activeFilters.is_featured = false;
        fetchProducts(); // Refetch after resetting
    };

    // Watch for changes in filters and automatically refetch data
    watch(activeFilters, () => {
        // Reset to page 1 whenever a filter changes, except for pagination itself
        if (activeFilters.page === 1) {
            fetchProducts();
        } else {
            activeFilters.page = 1;
        }
    }, { deep: true });

    return {
        products,
        product,
        relatedProducts,
        pagination,
        availableFilters,
        activeFilters,
        isLoading,
        fetchProducts,
        fetchProductBySlug,
        resetFilters,
    };
}