<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from "vue-router";
    import { 
        PuzzleIcon, 
        ShieldCheckIcon, 
        KeyIcon, 
        GitForkIcon, 
        UserLockIcon, 
        ChevronsRightIcon 
    } from "lucide-vue-next";

    const router = useRouter();

    const props = defineProps<{
        can: {
            viewAnyRole?: boolean;
            viewAnyPermission?: boolean;
            viewRolePermissions?: boolean;
            viewAnyAccess?: boolean
        } | undefined;
    }>();

    const navigateTo = (routeName: string) => {
        router.push({ name: routeName });
    };

    // Define menu items with semantic theme mapping
    const menuItems = computed(() => [
        {
            label: 'Manage Roles',
            route: 'access-control.roles.index',
            icon: ShieldCheckIcon,
            permission: props.can?.viewAnyRole,
            theme: 'primary' // Uses primary color variables
        },
        {
            label: 'View Permissions',
            route: 'access-control.permissions.index',
            icon: KeyIcon,
            permission: props.can?.viewAnyPermission,
            theme: 'success' // Uses success/accent color variables
        },
        {
            label: 'Role & Permissions',
            route: 'access-control.role-permission.index',
            icon: GitForkIcon,
            permission: props.can?.viewRolePermissions,
            theme: 'secondary' // Uses secondary color variables
        },
        {
            label: 'Manage User Access',
            route: 'access-control.user-access.index',
            icon: UserLockIcon,
            permission: props.can?.viewAnyAccess,
            theme: 'info' // Uses info color variables
        }
    ]);
</script>

<template>
    <div v-if="can" class="core-card">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-muted">
            <div class="p-2 rounded-lg text-primary-600 dark:text-primary-400">
                <PuzzleIcon class="size-6" />
            </div>
            <div>
                <h3 class="text-lg font-bold section-title">Core Management</h3>
                <p class="text-xs text-muted">System access and security controls</p>
            </div>
        </div>

        <!-- Navigation List -->
        <nav class="space-y-2">
            <template v-for="item in menuItems" :key="item.route">
                <button 
                    v-if="item.permission" 
                    @click="navigateTo(item.route)" 
                    class="nav-item group"
                    :class="`nav-item--${item.theme}`"
                >
                    <div class="flex items-center gap-4">
                        <!-- Icon Container -->
                        <div class="nav-item-icon">
                            <component :is="item.icon" class="size-5" />
                        </div>
                        <span class="font-medium text-lg transition-colors group-hover:translate-x-1 duration-200">
                            {{ item.label }}
                        </span>
                    </div>
                    
                    <ChevronsRightIcon class="size-4 text-muted opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </button>
            </template>
        </nav>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.core-card {
    @apply p-6 rounded-2xl border transition-all duration-300;
    background-color: var(--section-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-md);
}

/* Base Nav Item Style */
.nav-item {
    @apply w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent;
    @apply font-extrabold;
    color: var(--section-title-color);
}

.nav-item:hover {
    background-color: var(--section-bg);
    border-color: var(--border-muted);
}

/* Icon Container Style */
.nav-item-icon {
    @apply flex items-center justify-center p-2 rounded-lg transition-colors duration-200;
}

/* --- Semantic Theme Variations --- */

/* Primary Theme */
.nav-item--primary .nav-item-icon {
    @apply bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400;
}
.nav-item--primary:hover .nav-item-icon {
    @apply bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300;
}

/* Success Theme */
.nav-item--success .nav-item-icon {
    @apply bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400;
}
.nav-item--success:hover .nav-item-icon {
    @apply bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300;
}

/* Secondary Theme */
.nav-item--secondary .nav-item-icon {
    @apply bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400;
}
.nav-item--secondary:hover .nav-item-icon {
    @apply bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300;
}

/* Info Theme */
.nav-item--info .nav-item-icon {
    @apply bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400;
}
.nav-item--info:hover .nav-item-icon {
    @apply bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300;
}
</style>