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
	CalendarIcon,
	PaletteIcon,
	CheckCircle2Icon,
	LayersIcon,
	ShieldIcon,
	ClockIcon,
} from "lucide-vue-next";

import {
	BackButton,
	EditButton,
	DeleteButton,
	CreateButton,
	SaveButton
} from "@/components/button";
import DeleteModel from "@/components/button/DeleteModel.vue";

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
	<div class="p-4 sm:p-6 lg:p-6 min-h-screen font-poppins transition-colors duration-300">
		<div v-if="isLoading" class="text-center py-12 text-gray-700 dark:text-gray-600 text-lg animate-pulse">
			Loading role details...
		</div>
		<div v-else-if="!role" class="text-center py-12 text-gray-700 dark:text-gray-400 text-lg">
			Role not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<!-- Role Header Card -->
			<div
				class="section-bg rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border section-description">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div class="space-y-2">
						<h1 class="text-3xl font-bold section-title  leading-tight">
							{{ role.name }}
						</h1>
						<p class="text-sm section-title ">
							{{ role.key }}
						</p>
						<span v-if="role.is_system_role"
							class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border section-title">
							System Role
						</span>
					</div>
					<div class="flex items-center gap-3">
						<BackButton />

						<EditButton v-if="role.can?.update" :to="{
							name: 'access-control.roles.edit',
							params: { id: role.id },
						}" />
						<DeleteModel v-if="role.can?.delete" :item-id="role.id" :item-name="role.name"
							delete-url="/access-control/roles/" />
						<!-- <DeleteButton
                            v-if="role.can?.delete"
                            :loading="isDeleting"
                            @confirm="handleDelete"
                        /> -->
					</div>
				</div>
				<p v-if="role.description" class="mt-4 section-title leading-relaxed">
					{{ role.description }}
				</p>
			</div>

			<!-- Role Metadata Grid -->
			<div class="overview-card">
				<!-- Card Header -->
				<div class="card-header">
					<h3 class="header-title">Role Overview</h3>
				</div>

				<div class="card-content">

					<!-- Section 1: Access & Status -->
					<div class="info-row">
						<!-- Access Level -->
						<div class="info-item">
							<span class="label">
								<LayersIcon class="icon" /> Access Level
							</span>
							<span class="value-badge">{{ role.level }}</span>
						</div>

						<!-- Default Status -->
						<div class="info-item">
							<span class="label">
								<ShieldIcon class="icon" /> Default Role
							</span>
							<div v-if="role.is_default" class="status-badge status-active">
								<CheckCircle2Icon class="size-3.5" />
								<span>Auto-Assigned</span>
							</div>
							<div v-else class="status-badge status-inactive">
								<XCircleIcon class="size-3.5" />
								<span>Manual</span>
							</div>
						</div>
					</div>

					<!-- Section 2: Theme Configuration -->
					<div class="divider"></div>
					<div class="py-4">
						<span class="label mb-3 block">
							<PaletteIcon class="icon" /> Interface Theme
						</span>
						<div class="grid grid-cols-2 gap-4">
							<!-- Light Theme -->
							<div class="color-box">
								<span class="color-swatch ring-1 ring-black/5"
									:style="{ backgroundColor: role.color_light || '#ffffff' }"></span>
								<div class="flex flex-col">
									<span class="color-label">Light Mode</span>
									<span class="color-value">{{ role.color_light || 'N/A' }}</span>
								</div>
							</div>
							<!-- Dark Theme -->
							<div class="color-box">
								<span class="color-swatch ring-1 ring-white/10"
									:style="{ backgroundColor: role.color_dark || '#1f2937' }"></span>
								<div class="flex flex-col">
									<span class="color-label">Dark Mode</span>
									<span class="color-value">{{ role.color_dark || 'N/A' }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Section 3: Audit Timestamps -->
					<div class="divider"></div>
					<div class="info-row pt-4">
						<div class="info-item">
							<span class="label">
								<CalendarIcon class="icon" /> Created
							</span>
							<span class="value-text">{{ formatDate(role.created_at) }}</span>
						</div>
						<div class="info-item">
							<span class="label">
								<ClockIcon class="icon" /> Updated
							</span>
							<span class="value-text">{{ formatDate(role.updated_at) }}</span>
						</div>
					</div>

				</div>
			</div>

			<!-- Permissions Section -->
			<div
				class="section-bg section-title rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border">
				<h2 class="text-2xl font-semibold mb-4 flex items-center">
					<ShieldCheckIcon class="w-6 h-6 mr-2 text-sky-500 dark:text-sky-400" />
					Permissions ({{ role.permissions?.length || 0 }})
				</h2>
				<div v-if="role.permissions && role.permissions.length > 0" class="space-y-4">
					<div v-for="(perms, groupName) in groupedPermissions" :key="groupName">
						<h4 class="text-md font-medium mb-2 capitalize ">
							{{ groupName.toString().replace(/_/g, " ") }}
						</h4>
						<ul class="list-disc list-inside space-y-2 pl-4 text-sm">
							<li v-for="permission in perms" :key="permission.id"
								class="font-bold">
								{{ permission.name }}
								<span class="text-xs font-normal">({{ permission.key
									}})</span>
								<p v-if="permission.description"
									class="text-xs pl-5 mt-1 font-normal">
									{{ permission.description }}
								</p>
							</li>
						</ul>
					</div>
				</div>
				<p v-else class="text-gray-600 dark:text-gray-400 italic text-base">
					This role has no assigned permissions.
				</p>
			</div>

			<!-- Assigned Users Section -->
			<div
				class="section-bg section-title rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border">
				<h2 class="text-2xl font-semibold mb-4 flex items-center">
					<UsersIcon class="w-6 h-6 mr-2 text-green-500 dark:text-green-400" />
					Assigned Users ({{ role.users?.length || 0 }})
				</h2>
				<div v-if="role.users && role.users.length > 0" class="overflow-x-auto">
					<table class="min-w-full text-sm divide-y">
						<thead>
							<tr>
								<th
									class="px-4 py-3 text-left font-medium">
									User
								</th>
								<th
									class="px-4 py-3 text-left font-medium">
									Email
								</th>
								<th
									class="px-4 py-3 text-left font-medium">
									Expires At
								</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							<tr v-for="user in role.users" :key="user.id"
								class="hover:bg-primary-500/20 transition-colors duration-200">
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
				<p v-else class="text-gray-600 dark:text-gray-400 italic text-base">
					No users are currently assigned this role.
				</p>
			</div>
		</div>
	</div>
</template>
<style scoped>
@reference "@/assets/css/main.css";

.overview-card {
    @apply rounded-2xl border overflow-hidden transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-lg);
}

.overview-card:hover {
    box-shadow: var(--shadow-2xl);
    border-color: var(--color-primary-100);
}
:global(.dark) .overview-card:hover {
    border-color: var(--color-primary-700);
}

.card-header {
    @apply px-6 py-4 border-b border-muted section-bg;
}

.header-title {
    @apply text-sm font-bold uppercase tracking-wider;
    color: var(--section-title-color);
}

.card-content {
    @apply section-bg;
    @apply p-6;
}

/* Layout Utilities */
.info-row {
    @apply flex flex-wrap gap-y-4 gap-x-12;
}

.info-item {
    @apply flex flex-col gap-1.5 min-w-[120px];
}

.divider {
    @apply h-px w-full border my-4;
}

/* Typography & Icons */
.label {
    @apply flex items-center gap-2 text-xs font-semibold uppercase tracking-wide section-title;
}

.icon {
    @apply size-4 opacity-70;
}

.value-badge {
    @apply w-fit px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono font-bold text-lg border border-muted text-primary-50;
}

.value-text {
    @apply font-medium text-sm section-title;
}

/* Status Badges */
.status-badge {
    @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border w-fit;
}
.status-active {
    @apply bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20;
}
.status-inactive {
    @apply bg-slate-50 text-slate-600 border-slate-200 dark:bg-transparent dark:text-slate-400 dark:border-slate-700;
}

/* Color Box Styles */
.color-box {
    @apply flex items-center gap-3 p-2.5 rounded-xl border border-muted;
}

.color-swatch {
    @apply size-8 rounded-lg border border-muted shadow-sm;
}

.color-label {
    @apply text-[10px] font-bold uppercase text-muted leading-tight;
}

.color-value {
    @apply text-xs font-mono font-medium section-title;
}
</style>