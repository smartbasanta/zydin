<script setup lang="ts">
    import { ref, computed, watch } from "vue";
    import { apiService } from "@/services/api.service";
    import type {
        AccessControlDashboardData,
        DashboardRecentActivityItem,
        DashboardExpiringItem,
        Role,
        Permission,
        UserAccess,
    } from "@/types/access-control";
    import { useNotifier } from "@/composables/useNotifier";
    import { useNamedComponentLoader } from "@/composables/useNamedComponentLoader";
    import { useGlobalStateStore } from "@/stores/global.state.store";

    // Layout & Child Components
    import Header from "./partials/Header.vue";
    import StatsNodes from "./partials/StatsNodes.vue";
    import CoreManagement from "./partials/CoreManagement.vue";
    import QuickActions from "./partials/QuickActions.vue";
    import LoadingState from "@/components/card/LoadingState.vue";

    // Tab Content Components
    import ExpiringAssignments from "./partials/ExpiringAssignments.vue";
    import UnusedPermissions from "./partials/UnusedPermissions.vue";
    import UsersWithoutRoles from "./partials/UsersWithoutRoles.vue";
    import SuperUsers from "./partials/SuperUsers.vue";
    import RecentActivity from "./partials/RecentActivity.vue";
    import TopAssignedRoles from "./partials/TopAssignedRoles.vue";
    import RoleLevelDistribution from "./partials/RoleLevelDistribution.vue";
    import { ShieldAlertIcon, ActivityIcon, BarChart3Icon } from "lucide-vue-next";
    import type { User } from "@/types/auth";

    const { error: notifyError } = useNotifier();
    const globalStateStore = useGlobalStateStore();

    const dashboardData = ref<AccessControlDashboardData | null>(null);
    const hasError = ref(false);
    const activeTab = ref<"alerts" | "security" | "insights">("alerts");

    const fetchDashboardData = async () => {
        hasError.value = false;
        dashboardData.value = null;
        try {
            const response = await apiService.get<{
                data: AccessControlDashboardData;
            }>("/access-control/dashboard");
            dashboardData.value = response.data;
            // globalStateStore.setUnauthorized(false);
        } catch (err: any) {
            hasError.value = true;
            if (err?.status !== 403) {
                notifyError(err, "Failed to load dashboard data");
            }
        }
    };

    const { isLoading } = useNamedComponentLoader(
        "access-control-dashboard",
        fetchDashboardData
    );

    const handleRetry = () => {
        globalStateStore.setUnauthorized(false);
        fetchDashboardData();
    };

    // Computed properties for cleaner template
    const stats = computed(() => dashboardData.value?.stats);
    const can = computed(() => dashboardData.value?.can);
    const expiringThresholdDays = computed(
        () => dashboardData.value?.expiring_threshold_days || 7
    );

    // Data for child components, with fallbacks
    const expiringItems = computed<DashboardExpiringItem[]>(
        () => dashboardData.value?.expiring_items || []
    );
    
    const usersWithoutRoles = computed<UserAccess[]>(
        () => dashboardData.value?.users_without_roles || []
    );
    
    const unusedPermissions = computed<Permission[]>(
        () => dashboardData.value?.unused_permissions || []
    );
    const superUsers = computed<User[]>(
        () => dashboardData.value?.super_users || []
    );
    const recentActivity = computed<DashboardRecentActivityItem[]>(
        () => dashboardData.value?.recent_activity || []
    );
    const topRoles = computed<Role[]>(() => dashboardData.value?.top_roles || []);
    const roleLevelDistribution = computed<Record<number, number>>(
        () => dashboardData.value?.role_level_distribution || {}
    );
    const defaultRoles = computed<Role[]>(
        () => dashboardData.value?.default_roles || []
    );

    const TABS = computed(() => ({
        alerts: {
            id: "alerts" as const,
            label: "Actionable Alerts",
            icon: ShieldAlertIcon,
            permission:
                can.value?.viewExpiringAssignments ||
                can.value?.viewAnyAccess ||
                can.value?.viewAnyPermission,
        },
        security: {
            id: "security" as const,
            label: "Security Posture",
            icon: ActivityIcon,
            permission: can.value?.viewSuperUsers || can.value?.viewRecentActivity,
        },
        insights: {
            id: "insights" as const,
            label: "Analytics & Insights",
            icon: BarChart3Icon,
            permission: can.value?.viewAnyRole,
        },
    
    }));

    const availableTabs = computed(() =>
        Object.values(TABS.value).filter((tab) => tab.permission)
    );

    // If the default 'alerts' tab isn't available, switch to the first available one
    watch(availableTabs, (newTabs) => {
        if (newTabs.length > 0) {
            // Check if the currently selected tab is still in the available list.
            const activeTabExists = newTabs.some(tab => tab.id === activeTab.value);
            // If not, switch to the first available tab.
            if (!activeTabExists) {
                activeTab.value = newTabs[0].id;
            }
        }
    }, {
        // Run the watcher as soon as the component is mounted.
        immediate: true
    });
</script>

<template>
	<LoadingState v-if="isLoading" />
	<div
		v-else-if="dashboardData && can?.viewAccessControlDashboard"
		class="bg-gray-50 dark:bg-gray-1200 text-gray-700 dark:text-gray-300 min-h-screen p-4 sm:p-6 lg:p-8 font-grotesk selection:bg-blue-500/30"
	>
		<Header />

		<StatsNodes
			:stats="stats"
			:expiringThresholdDays="expiringThresholdDays"
		/>

		<main class="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
			<!-- Left Sidebar: Core Actions -->
			<aside class="xl:col-span-4 space-y-8">
				<CoreManagement :can="can" />
				<QuickActions :can="can" :defaultRoles="defaultRoles" />
			</aside>

			<!-- Main Content: Tabbed View -->
			<div class="xl:col-span-8">
				<!-- Tab Navigation -->
				<div
					v-if="availableTabs.length > 1"
					class="border-b border-gray-200 dark:border-gray-900 mb-6"
				>
					<nav class="-mb-px flex space-x-6" aria-label="Tabs">
                        
						<button
							v-for="tab in availableTabs"
							:key="tab.id"
							@click="activeTab = tab.id as 'alerts' | 'security' | 'insights'"
							:class="[
								activeTab === tab.id
									? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700',
								'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
							]"
						>
							<component
								:is="tab.icon"
								:class="[
									activeTab === tab.id
										? 'text-blue-500 dark:text-blue-400'
										: 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
									'-ml-0.5 mr-2 h-5 w-5',
								]"
							/>
							<span>{{ tab.label }}</span>
						</button>
					</nav>
				</div>

				<!-- Tab Panels -->
				<div class="space-y-8">
					<div v-show="activeTab === 'alerts'" class="space-y-8">
						<ExpiringAssignments :can="can" :expiringItems="expiringItems" />
						<!-- This prop binding now works correctly because of Fix 1 -->
						<UsersWithoutRoles :can="can" :usersWithoutRoles="usersWithoutRoles" />
						<UnusedPermissions :can="can" :unusedPermissions="unusedPermissions" />
					</div>

					<div v-show="activeTab === 'security'" class="space-y-8">
						<SuperUsers :can="can" :superUsers="superUsers" />
						<RecentActivity
							:can="can"
							:recentActivity="recentActivity"
						/>
					</div>

					<div v-show="activeTab === 'insights'" class="space-y-8">
						<TopAssignedRoles :can="can" :topRoles="topRoles" />
						<RoleLevelDistribution :can="can" :roleLevelDistribution="roleLevelDistribution" />
					</div>
				</div>
			</div>
		</main>
	</div>

	<!-- Fallback/Error State -->
	<div v-else class="flex items-center justify-center h-screen">
		<div
			class="text-center p-6 bg-white dark:bg-gray-1100 rounded-lg shadow-xl"
		>
			<h2
				class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2"
			>
				{{
					can?.viewAccessControlDashboard
						? "Something Went Wrong"
						: "Access Denied"
				}}
			</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				{{
					can?.viewAccessControlDashboard
						? "We couldn’t load the dashboard data."
						: "You do not have permission to view this page."
				}}
			</p>
			<button
				v-if="can?.viewAccessControlDashboard"
				@click="handleRetry"
				class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
			>
				Try Again
			</button>
		</div>
	</div>
</template>