<script setup lang="ts">
    import { ref, onMounted, computed } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { apiService } from "@/services/api.service";
    import type { ApiResponse } from "@/types/api";
    import { useNotifier } from "@/composables/useNotifier";
    import type { Role, Permission } from "@/types/access-control";
    import {
        UsersIcon,
        ShieldCheckIcon,
        CheckCircleIcon,
        XCircleIcon,
    } from "lucide-vue-next";
        
    import { 
        BackButton, 
        EditButton, 
        DeleteButton, 
        CreateButton, 
        SaveButton 
    } from "@/components/button";

    const route = useRoute();
    const router = useRouter();
    const { error: notifyError } = useNotifier();

    const role = ref<Role | null>(null);
    const isLoading = ref(true);
    const roleId = route.params.id as string;

    const fetchRoleDetails = async () => {
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(
                `/access-control/roles/${roleId}`
            );
            role.value = response.data.role;
        } catch (err) {
            notifyError(err as any, "Failed to load role details");
            router.push({ name: "access-control.roles.index" });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(fetchRoleDetails);

    const groupedPermissions = computed(() => {
        if (!role.value?.permissions) return {};
        
        return role.value.permissions.reduce((acc, permission) => {
            const groupKey = permission.module || permission.group || "General";
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(permission);
            return acc;
        }, {} as Record<string, Permission[]>);
    });

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isDeleting = ref(false);

    const handleDelete = async () => {
        if (!role.value?.can?.delete) return;

        isDeleting.value = true;
        try {
            await apiService.delete(`/access-control/roles/${role.value.id}`);
            router.push({ name: 'access-control.roles.index' });
        } catch (err) {
            notifyError(err as any, `Failed to delete role ${role.value.name}`);
        } finally {
            isDeleting.value = false;
        }
    };

    const deleteRole = async () => {
        if (!role.value || !role.value.can?.delete) return;
        if (confirm(`Are you sure you want to delete role "${role.value.name}"?`)) {
            try {
                await apiService.delete(`/access-control/roles/${role.value.id}`);
                router.push({ name: "access-control.roles.index" });
            } catch (err) {
                notifyError(err as any, `Failed to delete role ${role.value.name}`);
            }
        }
    };
</script>

<template>
	<div
		class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins transition-colors duration-300"
	>
		<div
			v-if="isLoading"
			class="text-center py-12 text-gray-700 dark:text-gray-600 text-lg animate-pulse"
		>
			Loading role details...
		</div>
		<div
			v-else-if="!role"
			class="text-center py-12 text-gray-700 dark:text-gray-400 text-lg"
		>
			Role not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<!-- Role Header Card -->
			<div
				class="bg-white dark:bg-gray-1200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-150 dark:border-gray-1000"
			>
				<div
					class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
				>
					<div class="space-y-2">
						<h1
							class="text-3xl font-bold text-gray-900 dark:text-gray-50 font-grotesk leading-tight"
						>
							{{ role.name }}
						</h1>
						<p
							class="text-sm text-gray-600 dark:text-gray-400 font-grotesk"
						>
							{{ role.key }}
						</p>
						<span
							v-if="role.is_system_role"
							class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-150 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200"
						>
							System Role
						</span>
					</div>
					<div class="flex items-center gap-3">
                        <BackButton />
                        
                        <EditButton v-if="role.can?.update"
                            :to="{
								name: 'access-control.roles.edit',
								params: { id: role.id },
							}"
                        />
                        <DeleteButton
                            v-if="role.can?.delete"
                            :loading="isDeleting"
                            @confirm="handleDelete"
                        />
					</div>
				</div>
				<p
					v-if="role.description"
					class="mt-4 text-gray-600 dark:text-gray-300 text-base leading-relaxed"
				>
					{{ role.description }}
				</p>
			</div>

			<!-- Role Metadata Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
				>
					<h3
						class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-1 font-grotesk"
					>
						Level
					</h3>
					<p class="text-gray-900 dark:text-gray-100 font-medium">
						{{ role.level }}
					</p>
				</div>
				<div
					class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
				>
					<h3
						class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-1 font-grotesk"
					>
						Default Role
					</h3>
					<CheckCircleIcon
						v-if="role.is_default"
						class="w-5 h-5 text-green-500 dark:text-green-400"
					/>
					<XCircleIcon
						v-else
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
					/>
				</div>
				<div
					class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
				>
					<h3
						class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-1 font-grotesk"
					>
						Colors
					</h3>
					<div class="flex gap-4">
						<div>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								Light
							</p>
							<div class="flex items-center gap-2 mt-1">
								<span
									v-if="role.color_light"
									class="h-5 w-5 rounded border border-gray-300 dark:border-gray-800"
									:style="{
										backgroundColor: role.color_light,
									}"
								></span>
								<span
									class="text-gray-900 dark:text-gray-100 text-sm"
									>{{ role.color_light || "N/A" }}</span
								>
							</div>
						</div>
						<div>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								Dark
							</p>
							<div class="flex items-center gap-2 mt-1">
								<span
									v-if="role.color_dark"
									class="h-5 w-5 rounded border border-gray-300 dark:border-gray-800"
									:style="{
										backgroundColor: role.color_dark,
									}"
								></span>
								<span
									class="text-gray-900 dark:text-gray-100 text-sm"
									>{{ role.color_dark || "N/A" }}</span
								>
							</div>
						</div>
					</div>
				</div>
				<div
					class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
				>
					<h3
						class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-1 font-grotesk"
					>
						Created At
					</h3>
					<p
						class="text-gray-900 dark:text-gray-100 font-medium"
						:title="role.created_at"
					>
						{{ formatDate(role.created_at) }}
					</p>
				</div>
				<div
					class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
				>
					<h3
						class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-1 font-grotesk"
					>
						Last Updated
					</h3>
					<p
						class="text-gray-900 dark:text-gray-100 font-medium"
						:title="role.updated_at"
					>
						{{ formatDate(role.updated_at) }}
					</p>
				</div>
			</div>

			<!-- Permissions Section -->
			<div
				class="bg-white dark:bg-gray-1200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-150 dark:border-gray-1000"
			>
				<h2
					class="text-2xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-50 font-grotesk"
				>
					<ShieldCheckIcon
						class="w-6 h-6 mr-2 text-sky-500 dark:text-sky-400"
					/>
					Permissions ({{ role.permissions?.length || 0 }})
				</h2>
				<div
					v-if="role.permissions && role.permissions.length > 0"
					class="space-y-4"
				>
					<div
						v-for="(perms, groupName) in groupedPermissions"
						:key="groupName"
					>
						<h4
							class="text-md font-medium text-gray-600 dark:text-gray-300 mb-2 capitalize font-grotesk"
						>
							{{ groupName.toString().replace(/_/g, " ") }}
						</h4>
						<ul
							class="list-disc list-inside space-y-2 pl-4 text-sm"
						>
							<li
								v-for="permission in perms"
								:key="permission.id"
								class="text-gray-700 dark:text-gray-200"
							>
								{{ permission.name }}
								<span
									class="text-xs text-gray-500 dark:text-gray-400 font-grotesk"
									>({{ permission.key }})</span
								>
								<p
									v-if="permission.description"
									class="text-xs text-gray-600 dark:text-gray-400 pl-5 mt-1"
								>
									{{ permission.description }}
								</p>
							</li>
						</ul>
					</div>
				</div>
				<p
					v-else
					class="text-gray-600 dark:text-gray-400 italic text-base"
				>
					This role has no assigned permissions.
				</p>
			</div>

			<!-- Assigned Users Section -->
			<div
				class="bg-white dark:bg-gray-1200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-150 dark:border-gray-1000"
			>
				<h2
					class="text-2xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-50 font-grotesk"
				>
					<UsersIcon
						class="w-6 h-6 mr-2 text-green-500 dark:text-green-400"
					/>
					Assigned Users ({{ role.users?.length || 0 }})
				</h2>
				<div
					v-if="role.users && role.users.length > 0"
					class="overflow-x-auto"
				>
					<table
						class="min-w-full text-sm divide-y divide-gray-150 dark:divide-gray-1000"
					>
						<thead>
							<tr>
								<th
									class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 font-grotesk"
								>
									User
								</th>
								<th
									class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 font-grotesk"
								>
									Email
								</th>
								<th
									class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 font-grotesk"
								>
									Expires At
								</th>
							</tr>
						</thead>
						<tbody
							class="divide-y divide-gray-150 dark:divide-gray-1000"
						>
							<tr
								v-for="user in role.users"
								:key="user.id"
								class="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200"
							>
								<td class="px-4 py-3">{{ user.username }}</td>
								<td class="px-4 py-3">{{ user.email }}</td>
								<td class="px-4 py-3">
									{{
										user.pivot?.expires_at
											? formatDate(user.pivot.expires_at)
											: "Never"
									}}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p
					v-else
					class="text-gray-600 dark:text-gray-400 italic text-base"
				>
					No users are currently assigned this role.
				</p>
			</div>
		</div>
	</div>
</template>
