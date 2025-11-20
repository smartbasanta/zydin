<script setup lang="ts">
    import { ref, onMounted, watch, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { apiService } from '@/services/api.service';
    import type { GroupedSystemPermissions } from '@/types/access-control';
    import { useNotifier } from '@/composables/useNotifier';
    import { SearchIcon, EyeIcon, EditIcon, PuzzleIcon, ChevronDownIcon } from 'lucide-vue-next';
    import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
    import type { ApiResponse } from '@/types/api';
    import LoadingState from '@/components/card/LoadingState.vue';

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
    <div class="p-4 sm:p-6 lg:p-8 font-poppins">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
                Permissions ({{ totalPermissions }})
            </h1>
            <form @submit.prevent="handleSearch" class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-grow">
                    <SearchIcon class="absolute z-10 inset-y-0 left-0 flex items-center pl-3.5 pt-3 size-9 text-muted" />
                    <input type="text" v-model="searchTerm" placeholder="Search permissions..." class="input !pl-10 w-full !py-2.5 !rounded-lg" />
                </div>
                <button type="submit" class="btn btn-primary !rounded-lg !py-2.5">Search</button>
                <button v-if="searchTerm" @click="clearSearch" type="button" class="btn btn-ghost !rounded-lg !py-2.5 !border-secondary">Clear</button>
            </form>
        </div>

        <LoadingState v-if="isLoading" text="Loading permissions..." />
        <div v-else-if="totalPermissions === 0 && !searchTerm" class="text-center text-muted py-16 card-auth rounded-lg shadow">No permissions defined in the system.</div>
        <div v-else-if="Object.keys(groupedPermissions).length === 0 && searchTerm" class="text-center text-muted py-16 card-auth rounded-lg shadow">
            No permissions found matching: "{{ searchTerm }}".
            <button @click="clearSearch" class="link primary ml-2">Clear Search</button>
        </div>

        <div v-else class="space-y-8">
            <div v-for="(modules, groupName) in groupedPermissions" :key="groupName.toString()" 
                class="relative border border-gray-200 dark:border-gray-900 rounded-2xl bg-white dark:bg-gray-1150/80 shadow-lg dark:shadow-black/25 overflow-hidden transition-all duration-300">
                
                <!-- Group Header -->
                <button @click="toggleGroup(groupName.toString())" class="flex items-center justify-between p-5 w-full text-left bg-gray-50 dark:bg-gray-1100/70 border-b border-gray-200 dark:border-gray-900 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-1000">
                    <div class="flex items-center gap-4">
                        <div class="grid place-items-center size-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-600 dark:text-gray-400">
                            <PuzzleIcon class="size-6" />
                        </div>
                        <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ groupName }}</span>
                    </div>
                    <ChevronDownIcon class="size-6 text-gray-500 dark:text-gray-400 transition-transform duration-300" :class="{'rotate-180': isGroupExpanded(groupName.toString())}" />
                </button>

                <!-- Modules and Permissions -->
                <transition
                    enter-active-class="transition-[height] duration-300 ease-in-out"
                    leave-active-class="transition-[height] duration-300 ease-in-out"
                    @enter="(el, done) => { (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'; el.addEventListener('transitionend', done, { once: true }); }"
                    @before-leave="(el) => { (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'; }"
                    @leave="(el, done) => { (el as HTMLElement).style.height = '0'; el.addEventListener('transitionend', done, { once: true }); }"
                >
                    <div v-if="isGroupExpanded(groupName.toString())" class="overflow-hidden">
                        <div class="p-5 space-y-6">
                            <div v-for="(permissionsList, moduleName) in modules" :key="moduleName.toString()" class="relative pl-6">
                                <div class="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-blue-500/50 via-amber-500/50 to-transparent"></div>
                                
                                <h4 class="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-4 ml-4 relative">
                                    <div class="absolute -left-7 top-1/2 -translate-y-1/2 size-3 rounded-full bg-blue-500/80 ring-4 ring-blue-500/20"></div>
                                    {{ moduleName }}
                                </h4>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    <div v-for="permission in permissionsList" :key="permission.id" 
                                        class="group relative border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 flex flex-col h-full bg-white dark:bg-gray-1100 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-blue-900/40 transition-all duration-200 hover:-translate-y-1">
                                        <div class="flex-grow">
                                            <div class="flex justify-between items-start mb-1">
                                                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 pr-4">{{ permission.name }}</h3>
                                                <span v-if="permission.is_system_permission" class="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-400 text-xs rounded-full whitespace-nowrap">System</span>
                                            </div>
                                            <p class="font-mono text-xs text-muted/80 break-all mb-3">{{ permission.key }}</p>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 flex-grow text-balance line-clamp-2 min-h-[40px]">{{ permission.description || 'No description provided.' }}</p>
                                        </div>
                                        <div class="mt-auto pt-3 border-t border-muted flex items-center justify-end gap-2">
                                            <RouterLink v-if="permission.can?.view" :to="{ name: 'access-control.permissions.show', params: { id: permission.id } }" class="btn btn-soft-info !p-2 !text-xs !rounded-md">
                                                <EyeIcon class="size-3.5 mr-1" /> View
                                            </RouterLink>
                                            <RouterLink v-if="permission.can?.update" :to="{ name: 'access-control.permissions.edit', params: { id: permission.id } }" class="btn btn-soft !p-2 !text-xs !rounded-md">
                                                <EditIcon class="size-3.5 mr-1" /> Edit
                                            </RouterLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>