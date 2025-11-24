<script setup lang="ts">
    import { ref } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { apiService } from '@/services/api.service';
    import type { Permission } from '@/types/access-control';
    import { useNotifier } from '@/composables/useNotifier';
    import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
    import { 
        ArrowLeftIcon, 
        ShieldCheckIcon, 
        UserCheckIcon, 
        UserXIcon, 
        KeyRoundIcon,
        LayoutGridIcon,
        PuzzleIcon,
        ClockIcon
    } from 'lucide-vue-next';
    import type { ApiResponse } from '@/types/api';
    import LoadingState from '@/components/loading/LoadingState.vue';
    
    // Use universal button
    import { EditButton } from '@/components/button';

    const route = useRoute();
    const router = useRouter();
    const { error: notifyError } = useNotifier();
    const permissionId = route.params.id as string;

    const permission = ref<Permission | null>(null);

    const fetchPermission = async () => {
        try {
            const response = await apiService.get<ApiResponse<{ permission: Permission }>>(`/access-control/permissions/${permissionId}`);
            permission.value = response.data.permission;
        } catch (err) {
            notifyError(err as any, "Failed to load permission details");
            router.push({ name: 'access-control.permissions.index' });
        }
    };

    const { isLoading, retry } = useNamedComponentLoader('permission-show', fetchPermission);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };
</script>

<template>
    <div class="p-6 md:p-8 font-sans">
        <LoadingState v-if="isLoading" message="Loading permission details..." />
        
        <div v-else-if="!permission" class="flex flex-col items-center justify-center h-64 text-center">
            <KeyRoundIcon class="size-16 text-muted mb-4" />
            <h3 class="text-xl font-bold section-title">Permission Not Found</h3>
            <p class="text-muted mt-2">The permission you requested does not exist.</p>
            <RouterLink :to="{ name: 'access-control.permissions.index' }" class="btn btn-secondary mt-6">
                Back to List
            </RouterLink>
        </div>

        <div v-else class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <!-- Decorative Background -->
                <div class="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-inner">
                            <KeyRoundIcon class="size-8 section-title" />
                        </div>
                        <div>
                            <div class="flex items-center gap-3 mb-1">
                                <h1 class="text-2xl md:text-3xl font-bold section-title">{{ permission.name }}</h1>
                                <span v-if="permission.is_system_permission" class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                                    System
                                </span>
                            </div>
                            <code class="text-sm section-title font-mono px-2 py-1 rounded">
                                {{ permission.key }}
                            </code>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <RouterLink :to="{ name: 'access-control.permissions.index' }" class="btn btn-primary">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink>
                        <EditButton 
                            v-if="permission.can_edit" 
                            :to="{ name: 'access-control.permissions.edit', params: { id: permission.id } }" 
                            label="Edit Permission"
                        />
                    </div>
                </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Description -->
                <div class="md:col-span-3 lg:col-span-1 p-6 rounded-2xl section-bg border-1 shadow-sm">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                        Description
                    </h3>
                    <p class="section-title leading-relaxed">
                        {{ permission.description || 'No description provided for this permission.' }}
                    </p>
                </div>

                <!-- Group -->
                <div class="p-6 rounded-2xl border-1 shadow-sm">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-2">
                        <LayoutGridIcon class="size-4" /> Group
                    </h3>
                    <p class="text-lg font-semibold section-title">{{ permission.group || 'General' }}</p>
                </div>

                <!-- Module -->
                <div class="p-6 rounded-2xl border shadow-sm">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-2">
                        <PuzzleIcon class="size-4" /> Module
                    </h3>
                    <p class="text-lg font-semibold section-title">{{ permission.module || 'System' }}</p>
                </div>
            </div>

            <!-- Associations -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Roles Card -->
                <div class="association-card">
                    <header class="p-5 border-b border-muted flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
                        <h2 class="font-bold section-title flex items-center gap-2">
                            <ShieldCheckIcon class="size-5 text-primary-500" />
                            Roles
                        </h2>
                        <span class="badge-count">{{ permission.roles?.length || 0 }}</span>
                    </header>
                    <div class="association-list">
                        <div v-if="permission.roles?.length" class="divide-y divide-muted">
                            <RouterLink 
                                v-for="role in permission.roles" 
                                :key="role.id" 
                                :to="{ name: 'access-control.roles.show', params: { id: role.id } }"
                                class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <div class="font-medium section-title group-hover:text-primary-600 transition-colors">{{ role.name }}</div>
                                <div class="text-xs text-muted mt-0.5">Level: {{ role.level }}</div>
                            </RouterLink>
                        </div>
                        <p v-else class="p-6 text-sm text-muted text-center italic">Not assigned to any roles.</p>
                    </div>
                </div>

                <!-- Direct Users Card -->
                <div class="association-card">
                    <header class="p-5 border-b border-muted flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
                        <h2 class="font-bold section-title flex items-center gap-2">
                            <UserCheckIcon class="size-5 text-emerald-500" />
                            Direct Users
                        </h2>
                        <span class="badge-count">{{ permission.users?.length || 0 }}</span>
                    </header>
                    <div class="association-list">
                        <div v-if="permission.users?.length" class="divide-y divide-muted">
                            <div v-for="user in permission.users" :key="user.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <RouterLink 
                                    :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }" 
                                    class="font-medium section-title hover:text-emerald-600 hover:underline block"
                                >
                                    {{ user.username }}
                                </RouterLink>
                                <div class="text-xs text-muted">{{ user.email }}</div>
                                <div v-if="user.pivot?.expires_at" class="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                                    <ClockIcon class="size-3" /> Expires: {{ formatDate(user.pivot.expires_at) }}
                                </div>
                            </div>
                        </div>
                        <p v-else class="p-6 text-sm text-muted text-center italic">No direct user assignments.</p>
                    </div>
                </div>

                <!-- Revoked Users Card -->
                <div class="association-card">
                    <header class="p-5 border-b border-muted flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
                        <h2 class="font-bold section-title flex items-center gap-2">
                            <UserXIcon class="size-5 text-red-500" />
                            Explicitly Revoked
                        </h2>
                        <span class="badge-count">{{ permission.revokedUsers?.length || 0 }}</span>
                    </header>
                    <div class="association-list">
                        <div v-if="permission.revokedUsers?.length" class="divide-y divide-muted">
                            <div v-for="user in permission.revokedUsers" :key="user.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <RouterLink 
                                    :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }" 
                                    class="font-medium section-title hover:text-red-600 hover:underline block"
                                >
                                    {{ user.username }}
                                </RouterLink>
                                <div class="text-xs text-muted">{{ user.email }}</div>
                            </div>
                        </div>
                        <p v-else class="p-6 text-sm text-muted text-center italic">No explicit revocations.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.association-card {
    @apply rounded-2xl section-bg border border-muted shadow-sm overflow-hidden flex flex-col h-full;
}

.association-list {
    @apply overflow-y-auto max-h-[350px];
    scrollbar-width: thin;
}

.badge-count {
    @apply px-2 py-0.5 rounded-md text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
}
</style>