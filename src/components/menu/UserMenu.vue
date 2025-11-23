<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { UserIcon, LogOutIcon, LayoutDashboardIcon, UserSquareIcon, LogInIcon, UserPlusIcon } from 'lucide-vue-next';
    import { useAuthStore } from '@/stores/auth.store';
    
    // Import the Unified Dropdown
    import Dropdown from '@/components/menu/Dropdown.vue';

    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.currentUser);
    const router = useRouter();

    // Actions now return a function so they can be executed inside the template
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const handleLogout = async () => {
        await authStore.logout();
    };

    const menuItems = computed(() => {
        if (isAuthenticated.value) {
            const items = [
                { label: 'Dashboard', icon: LayoutDashboardIcon, action: () => navigateTo('/dashboard') },
                { label: 'Profile', icon: UserSquareIcon, action: () => navigateTo('/me') },
            ];

            if (authStore.hasPermission('access_control.user_access.register')) {
                items.push({ 
                    label: 'Register New User', 
                    icon: UserPlusIcon,
                    action: () => navigateTo('/dashboard/register') 
                });
            }
            return items;
        } else {
            return [
                { label: 'Login', icon: LogInIcon, action: () => navigateTo('/login') },
            ];
        }
    });
</script>

<template>
    <!-- Use the Unified Dropdown -->
    <Dropdown placement="bottom-end" menuClass="menu-dropdown-panel w-64">
        
        <!-- Trigger Slot -->
        <template #trigger="{ toggle }">
            <button
                @click="toggle()"
                class="header-menu-trigger"
                aria-label="Toggle user menu"
            >
                <UserIcon class="w-5 h-5" />
            </button>
        </template>

        <!-- Menu Content Slot -->
        <template #menu="{ close }">
            
            <!-- User Info Header -->
            <div v-if="isAuthenticated && user" class="p-4 border-b border-muted">
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 grid place-content-center size-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                        <UserIcon class="w-5 h-5" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold section-title truncate" :title="user.username">
                            {{ user.username }}
                        </p>
                        <p class="text-xs text-muted truncate" :title="user.email">
                            {{ user.email }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Main Menu Items -->
            <div class="p-1.5 section-title">
                <button 
                    v-for="item in menuItems" 
                    :key="item.label" 
                    @click="item.action(); close(true)" 
                    class="menu-dropdown-item"
                >
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.label }}</span>
                </button>
            </div>

            <!-- Logout -->
            <div v-if="isAuthenticated" class="border-t border-muted p-1.5">
                <button 
                    @click="handleLogout(); close(true)" 
                    class="menu-dropdown-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOutIcon class="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>

        </template>
    </Dropdown>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* No extra CSS needed as we reuse global dropdown classes */
</style>