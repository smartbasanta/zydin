<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { BellIcon, SparklesIcon, ArrowUpRightIcon } from 'lucide-vue-next';
    import { useSystemNotificationStore } from '@/stores/systemNotification.store';
    
    // Import the Unified Dropdown
    import Dropdown from '@/components/menu/Dropdown.vue';
    import ThemeSwitcher from '@/components/appearance/ThemeSwitcher.vue';

    const notificationStore = useSystemNotificationStore();
    const router = useRouter();

    // Actions now return a function so they can be executed inside the template
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const menuItems = computed(() => [
        { 
            label: 'Notifications', 
            icon: BellIcon, 
            action: () => notificationStore.togglePanel(),
            hasNotificationBadge: true
        },
        { label: 'Career', icon: ArrowUpRightIcon, action: () => navigateTo('/career') },
        { label: 'Contact', icon: ArrowUpRightIcon, action: () => navigateTo('/contact') },
    ]);
</script>

<template>
    <!-- Use the Unified Dropdown -->
    <Dropdown placement="bottom-end" menuClass="menu-dropdown-panel w-56">
        
        <!-- Trigger Slot -->
        <template #trigger="{ toggle }">
            <button
                @click="toggle()"
                class="header-menu-trigger header-pill-button"
                aria-label="Toggle utility menu"
            >
                <SparklesIcon class="w-5 h-5" />
            </button>
        </template>

        <!-- Menu Content Slot -->
        <template #menu="{ close }">
            
            <!-- Main Menu Items -->
            <div class="p-1.5 section-title">
                <button 
                    v-for="item in menuItems" 
                    :key="item.label" 
                    @click="item.action(); close(true)" 
                    class="menu-dropdown-item relative"
                >
                    <div class="flex items-center gap-3 w-full">
                        <component :is="item.icon" class="h-4 w-4" />
                        <span>{{ item.label }}</span>
                        
                        <!-- Notification badge -->
                        <span
                            v-if="item.hasNotificationBadge && notificationStore.unreadCount > 0"
                            class="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-red-500 text-white"
                        >
                            {{ notificationStore.unreadCount }}
                        </span>
                    </div>
                </button>
                
                <!-- Theme Switcher -->
                <div class="border-t border-muted pt-2 mt-2">
                    <div class="px-3 py-2 text-xs text-muted uppercase tracking-wider">Appearance</div>
                    <ThemeSwitcher variant="dropdown" />
                </div>
            </div>

        </template>
    </Dropdown>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* No extra CSS needed as we reuse global dropdown classes */
</style>
