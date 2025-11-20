<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import type { LucideIcon } from 'lucide-vue-next';
    import { UserIcon, LogOutIcon, LayoutDashboardIcon, UserSquareIcon, LogInIcon, UserPlusIcon } from 'lucide-vue-next';
    import { useDropdown } from '@/composables/useDropdown';
    import { useAuthStore } from '@/stores/auth.store';

    const { isOpen, toggle, close, dropdownRef, triggerRef, onKeyDown } = useDropdown();
    
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.currentUser);

    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
        close(true);
    };

    const handleLogout = async () => {
        await authStore.logout();
        close(true);
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
                    icon: UserPlusIcon, // A more appropriate icon
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
    <div class="relative" @keydown="onKeyDown">
        <!-- Trigger Button -->
        <button
            ref="triggerRef"
            @click="toggle()"
            class="header-menu-trigger"
            :class="{ 'active': isOpen }"
            aria-label="Toggle user menu"
            aria-haspopup="true"
            :aria-expanded="isOpen"
        >
            <!-- CORRECTED: Removed hardcoded text-white. It will inherit from .header-menu-trigger -->
            <UserIcon class="w-5 h-5" />
        </button>

        <!-- Dropdown Panel -->
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
           <div
                v-if="isOpen"
                ref="dropdownRef"
                class="menu-dropdown-panel"
                role="menu"
                tabindex="-1"
            >
                <!-- User Info Header -->
                <!-- CORRECTED: Replaced hardcoded border-gray with our theme-aware 'border-muted' class -->
                <div v-if="isAuthenticated && user" class="p-3 pb-2 flex gap-3 items-center border-b border-muted" role="none">
                    <!-- CORRECTED: Replaced hardcoded bg-gray and text color -->
                    <div class="flex-shrink-0 grid place-content-center size-10 rounded-full bg-[var(--btn-secondary-bg)]">
                        <UserIcon class="w-5 h-5 text-muted" />
                    </div>
                    <div class="truncate">
                        <!-- CORRECTED: Replaced hardcoded text colors with theme-aware variables -->
                        <p class="text-sm font-semibold truncate text-[var(--input-text)]" :title="user.username">{{ user.username }}</p>
                        <p class="truncate text-xs font-medium text-muted" :title="user.email">{{ user.email }}</p>
                    </div>
                </div>

                <!-- Main Menu Items -->
                <div class="p-1" role="none">
                    <button v-for="item in menuItems" :key="item.label" @click="item.action()" class="menu-dropdown-item rounded-lg" role="menuitem" data-dropdown-item="true">
                        <component :is="item.icon" class="h-5 w-5" />
                        <span>{{ item.label }}</span>
                    </button>
                </div>

                <!-- Logout -->
                <!-- CORRECTED: Replaced hardcoded border with 'border-muted' -->
                <div v-if="isAuthenticated" class="border-t p-1 border-muted">
                    <!-- CORRECTED: Replaced broken styles with our new 'menu-dropdown-item--danger' class -->
                    <button @click="handleLogout" class="menu-dropdown-item menu-dropdown-item--danger rounded-lg" role="menuitem" data-dropdown-item="true">
                        <LogOutIcon class="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>