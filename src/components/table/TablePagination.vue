<script setup lang="ts">
    import { inject, computed, type Ref, ref } from 'vue';
    import { ArrowLeftIcon, ArrowRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-vue-next';
    import type { PaginatedResponse, PaginationLink } from '@/types/paginated-response';

    const paginatedModel = inject<Ref<PaginatedResponse<any> | null>>('paginatedModel', ref(null));
    const isSimplePagination = inject<Ref<boolean>>('isSimplePagination', ref(false));
    const goToPageByUrl = inject<(url: string | null) => void>('goToPageByUrl');

    // --- Computed properties with null checks ---
    const currentPage = computed(() => paginatedModel.value?.current_page);
    const totalPages = computed(() => paginatedModel.value?.last_page);

    const prevPageUrl = computed(() => paginatedModel.value?.prev_page_url ?? null); 
    const nextPageUrl = computed(() => paginatedModel.value?.next_page_url ?? null);

    const firstPageUrl = computed(() => {
        if (paginatedModel.value && currentPage.value && currentPage.value > 1) {
            return createLinkObject(1, '1', false, paginatedModel.value.path).url;
        }
        return null;
    });

    const lastPageUrl = computed(() => {
        if (paginatedModel.value && currentPage.value && totalPages.value && currentPage.value < totalPages.value) {
            return createLinkObject(totalPages.value, String(totalPages.value), false, paginatedModel.value.path).url;
        }
        return null;
    });

    function createLinkObject(page: number, label: string, active: boolean, path: string | undefined): PaginationLink {
        if (!path) { 
            return { url: null, label, active };
        }
        let baseUrlString = window.location.origin;
        if (!baseUrlString || baseUrlString === "null") { // Handle cases like file:// protocol or tests
            baseUrlString = "http://localhost"; // Fallback base
        }

        try {
            const url = new URL(path, baseUrlString);
            url.searchParams.set('page', String(page));
            return {
                url: url.toString(),
                label: label,
                active: active,
            };
        } catch (e) {
            console.error("Error creating pagination link URL:", e, "Path:", path, "Base:", baseUrlString);
            return { url: null, label, active }; // Fallback if URL construction fails
        }
    }


    const pageLinks = computed(() => {
        if (!paginatedModel.value || !totalPages.value || totalPages.value <= 1 || !currentPage.value) {
            return [];
        }

        if (paginatedModel.value.links && paginatedModel.value.links.length > 0 && !isSimplePagination.value) {
            return paginatedModel.value.links.filter(link => {
                const labelLower = link.label.toLowerCase();
                return !labelLower.includes('previous') && !labelLower.includes('next');
            });
        }

        const current = currentPage.value;
        const last = totalPages.value;
        const delta = 2;
        const left = current - delta;
        const right = current + delta + 1;
        const range: number[] = [];
        const rangeWithDots: (PaginationLink | { type: 'dots' })[] = [];
        let l: number | undefined;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right)) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l !== undefined) {
                if (i - l === 2) {
                    if (paginatedModel.value?.path) {
                        rangeWithDots.push(createLinkObject(l + 1, String(l + 1), false, paginatedModel.value.path));
                    }
                } else if (i - l !== 1) {
                    rangeWithDots.push({ type: 'dots' });
                }
            }
            if (paginatedModel.value?.path) {
                rangeWithDots.push(createLinkObject(i, String(i), i === current, paginatedModel.value.path));
            }
            l = i;
        }
        return rangeWithDots;
    });

    const cleanLabel = (label: string): string => {
        if (typeof DOMParser !== 'undefined') {
            try {
                const doc = new DOMParser().parseFromString(label, "text/html");
                return doc.documentElement.textContent || label;
            } catch (e) {
                return label;
            }
        }
        return label;
    };

    const handlePageClick = (url: string | null) => {
        if (url && goToPageByUrl) {
            goToPageByUrl(url);
        }
    }
</script>

<template>
  <nav v-if="totalPages && totalPages > 1" class="flex items-center justify-center gap-1.5 text-sm" aria-label="Pagination">
    <!-- First Page Button -->
    <button 
      v-if="!isSimplePagination"
      @click="handlePageClick(firstPageUrl)"
      :disabled="!firstPageUrl || currentPage === 1"
      class="pagination-button"
      :class="{'cursor-not-allowed opacity-50': !firstPageUrl || currentPage === 1}"
      aria-label="First Page"
    >
      <ChevronsLeftIcon class="size-4" />
    </button>

    <!-- Previous Page Button -->
    <button 
      @click="handlePageClick(prevPageUrl)"
      :disabled="!prevPageUrl"
      class="pagination-button"
      :class="{'cursor-not-allowed opacity-50': !prevPageUrl}"
      aria-label="Previous Page"
    >
      <ArrowLeftIcon class="size-4" />
    </button>

    <!-- Page Numbers -->
    <template v-if="!isSimplePagination">
      <template v-for="(linkItem, index) in pageLinks" :key="`page-link-${index}`">
        <span 
          v-if="'type' in linkItem && linkItem.type === 'dots'"
          class="flex h-8 w-8 items-center justify-center text-muted-foreground"
        >
          ...
        </span>
        <button
          v-else
          @click="handlePageClick((linkItem as PaginationLink).url)"
          :disabled="!(linkItem as PaginationLink).url || (linkItem as PaginationLink).active"
          class="pagination-button"
          :class="{
            'bg-primary text-primary-foreground': (linkItem as PaginationLink).active,
            'cursor-not-allowed opacity-50': !(linkItem as PaginationLink).url
          }"
          :aria-current="(linkItem as PaginationLink).active ? 'page' : undefined"
          :aria-label="`Page ${cleanLabel((linkItem as PaginationLink).label)}`"
        >
          {{ cleanLabel((linkItem as PaginationLink).label) }}
        </button>
      </template>
    </template>

    <!-- Current Page Info (Mobile) -->
    <div v-if="isSimplePagination" class="px-3 py-1.5 text-sm text-muted-foreground">
      {{ currentPage }} / {{ totalPages }}
    </div>

    <!-- Next Page Button -->
    <button 
      @click="handlePageClick(nextPageUrl)"
      :disabled="!nextPageUrl"
      class="pagination-button"
      :class="{'cursor-not-allowed opacity-50': !nextPageUrl}"
      aria-label="Next Page"
    >
      <ArrowRightIcon class="size-4" />
    </button>

    <!-- Last Page Button -->
    <button 
      v-if="!isSimplePagination"
      @click="handlePageClick(lastPageUrl)"
      :disabled="!lastPageUrl || currentPage === totalPages"
      class="pagination-button"
      :class="{'cursor-not-allowed opacity-50': !lastPageUrl || currentPage === totalPages}"
      aria-label="Last Page"
    >
      <ChevronsRightIcon class="size-4" />
    </button>
  </nav>
</template>

<style scoped>


</style>