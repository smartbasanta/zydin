<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { apiService } from '@/services/api.service';
import type { GroupedSystemPermissions } from '@/types/access-control';
import { useNotifier } from '@/composables/useNotifier';
import { 
    SearchIcon, 
    PuzzleIcon, 
    ChevronDownIcon, 
    ShieldIcon 
} from 'lucide-vue-next';
import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
import type { ApiResponse } from '@/types/api';
import LoadingState from '@/components/loading/LoadingState.vue';

// Use universal buttons
import ViewButton from '@/components/button/ViewButton.vue';
import EditButton from '@/components/button/EditButton.vue';

const router = useRouter();
const route = useRoute();
const { error: notifyError } = useNotifier();

const groupedPermissions = ref<GroupedSystemPermissions>({});
const totalPermissions = ref(0);
const searchTerm = ref(route.query.search?.toString() || '');

const fetchPermissions = async () => {
    try {
        const response = await apiService.get<ApiResponse>('/access-control/permissions', {
            params: { search: searchTerm.value || undefined }
        });
        
        groupedPermissions.value = response.data.groupedPermissions;
        totalPermissions.value = response.data.totalPermissions;
        
    } catch (err) {
        notifyError(err as any, 'Failed to load permissions');
    }
};

const { isLoading, retry } = useNamedComponentLoader('permission-list', fetchPermissions);

const handleSearch = () => {
    router.push({ query: { search: searchTerm.value || undefined } }).then(() => retry());
};
const clearSearch = () => {
    searchTerm.value = '';
    handleSearch();
};

const STORAGE_KEY = 'expanded_permission_groups';
const expandedGroups = ref<Record<string, boolean>>({});

onMounted(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        try {
            expandedGroups.value = JSON.parse(savedState);
        } catch (e) { /* ignore */ }
    }
});

watch(groupedPermissions, (newGroups) => {
    Object.keys(newGroups).forEach(groupName => {
        if (expandedGroups.value[groupName] === undefined) {
            expandedGroups.value[groupName] = true;
        }
    });
}, { deep: true });

watch(expandedGroups, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

const toggleGroup = (groupName: string) => {
    expandedGroups.value[groupName] = !expandedGroups.value[groupName];
};
const isGroupExpanded = (groupName: string) => expandedGroups.value[groupName] ?? true;
</script>

<template>
    <div class="p-6 md:p-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
                <h1 class="text-2xl font-bold section-title flex items-center gap-2">
                    Permissions
                    <span class="px-2.5 py-0.5 rounded-full text-primary-700 dark:text-primary-300 text-sm font-semibold border border-primary-200 dark:border-primary-800">
                        {{ totalPermissions }}
                    </span>
                </h1>
                <p class="text-muted mt-1">Manage system capabilities and access rights.</p>
            </div>

            <!-- Search -->
            <form @submit.prevent="handleSearch" class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-grow sm:w-64">
                    <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input 
                        type="text" 
                        v-model="searchTerm" 
                        placeholder="Search permissions..." 
                        class="input pl-9 w-full" 
                    />
                </div>
                <button type="submit" class="btn btn-primary">Search</button>
                <button v-if="searchTerm" @click="clearSearch" type="button" class="btn btn-secondary">Clear</button>
            </form>
        </div>

        <!-- Content -->
        <LoadingState v-if="isLoading" message="Loading permissions..." />
        
        <div v-else-if="totalPermissions === 0 && !searchTerm" class="text-center py-20 border-2 border-dashed border-muted rounded-xl">
            <ShieldIcon class="w-12 h-12 mx-auto text-muted mb-3 opacity-50" />
            <p class="text-muted font-medium">No permissions defined in the system.</p>
        </div>
        
        <div v-else-if="Object.keys(groupedPermissions).length === 0 && searchTerm" class="text-center py-20 border-2 border-dashed border-muted rounded-xl">
            <p class="text-muted">No permissions found matching "{{ searchTerm }}".</p>
            <button @click="clearSearch" class="text-primary-600 hover:underline font-medium mt-2">Clear Search</button>
        </div>

        <div v-else class="space-y-6">
            <div v-for="(modules, groupName) in groupedPermissions" :key="groupName.toString()" 
                class="rounded-2xl border border-muted shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                
                <!-- Group Header -->
                <button @click="toggleGroup(groupName.toString())" class="w-full flex items-center justify-between p-5 section-bg border-b border-muted hover:bg-primary-500/20 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="grid place-items-center size-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                            <PuzzleIcon class="size-5" />
                        </div>
                        <span class="text-lg font-bold section-title">{{ groupName }}</span>
                    </div>
                    <ChevronDownIcon class="size-5 text-muted transition-transform duration-300" :class="{'rotate-180': isGroupExpanded(groupName.toString())}" />
                </button>

                <!-- Modules and Permissions -->
                <div v-show="isGroupExpanded(groupName.toString())" class="p-6 space-y-8 header-bg">
                    <div v-for="(permissionsList, moduleName) in modules" :key="moduleName.toString()" class="relative pl-6 border-l-2 border-primary-200 dark:border-primary-800">
                        
                        <h4 class="font-semibold text-lg section-title mb-4 flex items-center gap-2 -ml-[33px]">
                            <div class="size-3.5 rounded-full border-[3px] border-white dark:border-gray-1000 bg-primary-500 ring-1 ring-primary-200 dark:ring-primary-800"></div>
                            {{ moduleName }}
                        </h4>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="permission in permissionsList" :key="permission.id" 
                                class="group flex flex-col h-full p-4 rounded-xl border border-muted section-bg hover:border-primary-300 dark:hover:border-primary-700 hover:scale-105 transition-all duration-200">
                                
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="font-bold text-sm section-title pr-2">{{ permission.name }}</h3>
                                    <span v-if="permission.is_system_permission" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                        System
                                    </span>
                                </div>
                                
                                <code class="text-xs text-muted bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded w-fit font-mono mb-3 break-all border border-gray-200 dark:border-gray-700">
                                    {{ permission.key }}
                                </code>
                                
                                <p class="text-xs text-muted flex-grow line-clamp-2 mb-4">
                                    {{ permission.description || 'No description provided.' }}
                                </p>

                                <div class="mt-auto pt-3 border-t border-dashed border-muted flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <ViewButton 
                                        v-if="permission.can?.view" 
                                        :to="{ name: 'access-control.permissions.show', params: { id: permission.id } }" 
                                        icon-only 
                                        size="xs" 
                                    />
                                    <EditButton 
                                        v-if="permission.can?.update" 
                                        :to="{ name: 'access-control.permissions.edit', params: { id: permission.id } }" 
                                        icon-only 
                                        size="xs" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
</style>