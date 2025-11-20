<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { ApiResponse } from '@/types/api';
import type { Leader } from '@/types';
import { useNotifier } from '@/composables/useNotifier';
import { PlusIcon, UserSquare, LinkedinIcon, TwitterIcon } from 'lucide-vue-next';
import EditButton from '@/components/button/EditButton.vue';
import DeleteModel from '@/components/button/DeleteModel.vue';
// --- (1) IMPORT THE NEW VIEW BUTTON ---
import ViewButton from '@/components/button/ViewButton.vue';

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
    <div class="p-4 sm:p-6 lg:p-8">
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leadership Team</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manage your organization's leaders.</p>
            </div>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.leaders.create' }" title="Add New Leader" class="btn btn-primary">
                <PlusIcon class="size-4" />
                Add Leader
            </RouterLink>
        </header>

        <div v-if="isLoading" class="text-center py-10">
            <p>Loading leaders...</p>
        </div>

        <div v-else-if="leaders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="leader in leaders" :key="leader.id" class="bg-white dark:bg-gray-1100 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                
                <RouterLink :to="{ name: 'dashboard.leaders.show', params: { id: leader.id } }" class="p-5 flex-grow block hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200">
                    <div class="flex items-start gap-4">
                        <img v-if="leader.image_thumbnail_url" :src="leader.image_thumbnail_url" :alt="leader.name" class="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600">
                        <div v-else class="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                            <UserSquare class="size-10" />
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ leader.name }}</h3>
                            <p class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{{ leader.position }}</p>
                            <p v-if="leader.title" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ leader.title }}</p>
                        </div>
                    </div>
                    <p v-if="leader.quote" class="mt-4 text-sm italic text-gray-600 dark:text-gray-300 border-l-4 border-gray-200 dark:border-gray-600 pl-4">
                        "{{ leader.quote }}"
                    </p>
                </RouterLink>

                <footer class="bg-gray-50 dark:bg-gray-1100/50 px-5 py-3 flex justify-end items-center border-t border-gray-200 dark:border-gray-700">
                    <!-- <div class="flex items-center gap-3">
                        <a v-if="leader.socials?.linkedin" :href="leader.socials.linkedin" target="_blank" class="text-gray-400 hover:text-blue-600">
                            <LinkedinIcon class="size-5" />
                        </a>
                        <a v-if="leader.socials?.twitter" :href="leader.socials.twitter" target="_blank" class="text-gray-400 hover:text-sky-500">
                            <TwitterIcon class="size-5" />
                        </a>
                    </div> -->
                    <div class="flex items-center justify-end gap-1">
                        <ViewButton v-if="leader.can?.view" :to="{ name: 'dashboard.leaders.show', params: { id: leader.id } }" size="sm" />
                        <EditButton v-if="leader.can?.update" :to="{ name: 'dashboard.leaders.edit', params: { id: leader.id } }" size="sm" />
                        <DeleteModel v-if="leader.can?.delete" :item-id="leader.id" :item-name="leader.name" delete-url="/dashboard/leaders/" size="sm" @deleted="fetchLeaders" />
                    </div>
                </footer>
            </div>
        </div>

        <div v-else class="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <UserSquare class="mx-auto size-16 text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200">No Leaders Found</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Get started by adding the first member of your leadership team.</p>
            <RouterLink v-if="can.create" :to="{ name: 'dashboard.leaders.create' }" title="Add New Leader" class="btn btn-primary mt-4">
                <PlusIcon class="size-4" />
                Add Leader
            </RouterLink>
        </div>
    </div>
</template>