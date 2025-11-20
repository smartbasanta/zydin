<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { apiService } from '@/services/api.service';
    import type { Permission } from '@/types/access-control';
    import { useNotifier } from '@/composables/useNotifier';
    import { useNamedComponentLoader } from '@/composables/useNamedComponentLoader';
    import { EditIcon, ArrowLeftIcon, ShieldCheckIcon, UserCheckIcon, UserXIcon, KeyRoundIcon } from 'lucide-vue-next';
    import type { ApiResponse } from '@/types/api';
    import LoadingState from '@/components/card/LoadingState.vue';

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
        try {
            return new Date(dateString).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return dateString; }
    };
</script>

<template>
    <div class="p-4 sm:p-6 lg:p-8 font-poppins">
        <LoadingState v-if="isLoading" text="Loading permission details..." />
        <div v-else-if="!permission" class="text-center py-20 text-muted">Permission not found.</div>
        <div v-else class="container mx-auto max-w-5xl space-y-8">

            <!-- Header Card -->
            <div class="relative rounded-2xl p-6 bg-white/60 dark:bg-gray-1150/60 border border-gray-200 dark:border-gray-900 backdrop-blur-md shadow-xl dark:shadow-black/25">
                 <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 via-transparent to-transparent opacity-50 dark:opacity-30 blur-2xl -z-10"></div>
                <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div class="flex items-center gap-5">
                        <div class="grid place-items-center size-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40">
                            <KeyRoundIcon class="size-8" />
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-50">{{ permission.name }}</h1>
                            <p class="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">{{ permission.key }}</p>
                        </div>
                    </div>
                     <div class="flex items-center gap-2 flex-shrink-0">
                        <RouterLink :to="{ name: 'access-control.permissions.index' }" class="btn ghost border border-muted !rounded-lg">
                            <ArrowLeftIcon class="size-4 mr-1.5" /> List
                        </RouterLink>
                        <RouterLink v-if="permission.can_edit" :to="{ name: 'access-control.permissions.edit', params: { id: permission.id } }" class="btn btn-primary !rounded-lg">
                            <EditIcon class="size-4 mr-1.5" /> Edit
                        </RouterLink>
                    </div>
                </div>
                 <span v-if="permission.is_system_permission" class="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300">System Permission</span>
            </div>
            
            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-500 mb-1">Description</h3>
                    <p class="text-gray-700 dark:text-gray-300 text-balance">{{ permission.description || 'No description provided.' }}</p>
                </div>
                <div class="grid grid-cols-2 gap-6">
                     <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                        <h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-500 mb-1">Group</h3>
                        <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ permission.group || '-' }}</p>
                    </div>
                     <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                        <h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-500 mb-1">Module</h3>
                        <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ permission.module || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Associations Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Granted Via Roles -->
                <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h2 class="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-gray-100">
                        <ShieldCheckIcon class="size-5 mr-2 text-orange-500" /> Granted Via Roles ({{ permission.roles?.length || 0 }})
                    </h2>
                    <div v-if="permission.roles?.length" class="space-y-1 max-h-80 overflow-y-auto pr-1 text-sm custom-scrollbar">
                        <RouterLink v-for="role in permission.roles" :key="role.id" :to="{ name: 'access-control.roles.show', params: { id: role.id } }"
                                class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-1000 transition-colors">
                            <div class="font-medium text-gray-800 dark:text-gray-200">{{ role.name }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Level: {{ role.level }}</div>
                        </RouterLink>
                    </div>
                    <p v-else class="text-gray-500 dark:text-gray-400 text-sm italic mt-4">Not assigned to any roles.</p>
                </div>

                <!-- Directly Granted Users -->
                 <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h2 class="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-gray-100">
                        <UserCheckIcon class="size-5 mr-2 text-green-850 dark:text-green-700" /> Directly Granted ({{ permission.users?.length || 0 }})
                    </h2>
                    <div v-if="permission.users?.length" class="space-y-2 max-h-80 overflow-y-auto pr-1 text-sm custom-scrollbar">
                        <div v-for="user in permission.users" :key="user.id" class="p-3 border-b border-gray-200 dark:border-gray-900 last:border-b-0">
                            <RouterLink :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }" class="font-medium text-gray-800 dark:text-gray-200 hover:underline">
                                {{ user.username }}
                            </RouterLink>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                            <div v-if="user.pivot?.expires_at" class="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                                Expires: {{ formatDate(user.pivot.expires_at) }}
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 dark:text-gray-400 text-sm italic mt-4">Not directly granted to any users.</p>
                </div>

                <!-- Explicitly Revoked Users -->
                <div class="p-5 rounded-xl bg-white dark:bg-gray-1100 border border-gray-200 dark:border-gray-900 shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h2 class="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-gray-100">
                        <UserXIcon class="size-5 mr-2 text-red-500" /> Explicitly Revoked ({{ permission.revokedUsers?.length || 0 }})
                    </h2>
                    <div v-if="permission.revokedUsers?.length" class="space-y-2 max-h-80 overflow-y-auto pr-1 text-sm custom-scrollbar">
                         <div v-for="user in permission.revokedUsers" :key="user.id" class="p-3 border-b border-gray-200 dark:border-gray-900 last:border-b-0">
                            <RouterLink :to="{ name: 'access-control.user-access.edit', params: { id: user.id } }" class="font-medium text-gray-800 dark:text-gray-200 hover:underline">
                                {{ user.username }}
                            </RouterLink>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 dark:text-gray-400 text-sm italic mt-4">Not explicitly revoked for any users.</p>
                </div>
            </div>
        </div>
    </div>
</template>