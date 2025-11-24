<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { Leader } from '@/types';
import { useNotifier } from '@/composables/useNotifier';
import { PlusIcon, UserIcon } from 'lucide-vue-next';
import EditButton from '@/components/button/EditButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';
import ViewButton from '@/components/button/ViewButton.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages();
const leaders = ref<Leader[]>([]);
const can = ref({ create: false });
const isLoading = ref(true);
const { error: notifyError } = useNotifier();

const fetchLeaders = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>('/dashboard/leaders');
        leaders.value = response.data.leaders;
        can.value = response.data.can;
    } catch (err) {
        notifyError(err as any, 'Failed to fetch leaders');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchLeaders);
</script>

<template>
    <div class="p-6 md:p-8 space-y-8">
        <!-- Page Header -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold section-title">Leadership Team</h1>
                <p class="text-muted mt-1">Manage the profiles of your organization's executive members.</p>
            </div>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.leaders.create' }" class="btn btn-primary">
                <PlusIcon class="w-4 h-4 mr-2" />
                Add New Leader
            </RouterLink>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
            <LoadingState message="Loading Team..." />
        </div>

        <!-- Leaders Grid -->
        <div v-else-if="leaders.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
                v-for="leader in leaders" 
                :key="leader.id" 
                class="leader-card group"
            >
                <!-- Card Body (Clickable to View) -->
                <RouterLink 
                    :to="{ name: 'dashboard.leaders.show', params: { id: leader.id } }" 
                    class="block p-6 flex-grow"
                >
                    <div class="flex items-start gap-5">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-muted bg-gray-100 dark:bg-gray-800">
                                <img 
                                    :src="leader.image_thumbnail_url ?? leader.image_url ?? defaultProfileImage" 
                                    :alt="leader.name" 
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                >
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0 pt-1">
                            <h3 class="text-lg font-bold section-title truncate group-hover:text-primary-600 transition-colors">
                                {{ leader.name }}
                            </h3>
                            <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-0.5 truncate">
                                {{ leader.position }}
                            </p>
                            <p v-if="leader.title" class="text-xs text-muted truncate">
                                {{ leader.title }}
                            </p>
                        </div>
                    </div>

                    <!-- Quote Preview -->
                    <div v-if="leader.quote" class="mt-5 pt-4 border-t border-dashed border-muted">
                        <p class="text-sm italic section-title line-clamp-2 relative pl-3">
                            <span class="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-300 dark:bg-primary-700 rounded-full"></span>
                            "{{ leader.quote }}"
                        </p>
                    </div>
                </RouterLink>

                <!-- Card Footer (Actions) -->
                <footer class="px-6 py-3 border-t border-muted flex justify-between items-center">
                    <div class="text-xs section-title font-medium">
                        <!-- Optional: Status or Last Updated could go here -->
                        ID: #{{ leader.id }}
                    </div>
                    <div class="flex items-center gap-2">
                        <ViewButton :icon-only="true" v-if="leader.can?.view" :to="{ name: 'dashboard.leaders.show', params: { id: leader.id } }" size="sm" />
                        <EditButton :icon-only="true" v-if="leader.can?.update" :to="{ name: 'dashboard.leaders.edit', params: { id: leader.id } }" size="sm" />
                        <DeleteModel :icon-only="true" v-if="leader.can?.delete" :item-id="leader.id" :item-name="leader.name" delete-url="/dashboard/leaders/" size="sm" @deleted="fetchLeaders" />
                    </div>
                </footer>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-gray-50/50 dark:bg-gray-900/20">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
                <UserIcon class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold section-title">No Leaders Found</h3>
            <p class="text-muted max-w-sm mt-1 mb-6">Your leadership roster is currently empty. Add your first executive member to get started.</p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.leaders.create' }" class="btn btn-primary">
                <PlusIcon class="w-4 h-4 mr-2" />
                Add First Leader
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.leader-card {
    @apply flex flex-col rounded-xl border overflow-hidden transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-sm);
}

.leader-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-300);
}
:global(.dark) .leader-card:hover {
    border-color: var(--color-primary-600);
}
</style>