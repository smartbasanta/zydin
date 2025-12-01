<script setup lang="ts">
import AdminSidebar from '@/components/sidebar/AdminSidebar.vue';
import SidebarTrigger from '@/components/sidebar/SidebarTrigger.vue';
import ThemeMenu from '@/components/menu/ThemeMenu.vue';
import UserMenu from '@/components/menu/UserMenu.vue';
import { useAuthStore } from '@/stores/auth.store';
import ErrorUnauthorized from '@/components/errors/ErrorUnauthorized.vue';
import { useGlobalStateStore } from '@/stores/global.state.store';
import LoadingState from '@/components/card/LoadingState.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import ThemeSwitcher from '@/components/appearance/ThemeSwitcher.vue';

const authStore = useAuthStore();
const globalStateStore = useGlobalStateStore();

const lastRetryTimes = ref<number[]>([]);

const handleUnauthorizedRetry = () => {
    const now = Date.now();
    // Filter out retry attempts older than 60 seconds
    lastRetryTimes.value = lastRetryTimes.value.filter((ts) => now - ts < 60000);

    if (lastRetryTimes.value.length >= 2) {
        alert('You can only try again 2 times per minute. Please wait.');
        return;
    }

    // Record current retry timestamp
    lastRetryTimes.value.push(now);

    // globalStateStore.setUnauthorized(false);
    globalStateStore.resetState();
    authStore.fetchUser();
    // router.replace({ name: 'dashboard' });

    // window.location.reload();
};

const canRetry = computed(() => {
    const now = Date.now();
    const recentRetries = lastRetryTimes.value.filter((ts) => now - ts < 60000);
    return recentRetries.length < 2;
});

// Only show global loading for initial app load, not for individual requests
const showGlobalLoading = computed(() => {
    return !authStore.isAuthenticated && authStore.status === 'loading';
});

onMounted(() => {
    if (!globalStateStore.isUnauthorized) {
        globalStateStore.setUnauthorized(false);
    }
});

const route = useRoute();
watch(() => route.fullPath, () => {
    if (globalStateStore.isUnauthorized) {
        // globalStateStore.setUnauthorized(false);

        globalStateStore.resetState();
        authStore.fetchUser();
    }
});
</script>

<template>
    <LoadingState v-if="showGlobalLoading" />
    <div v-else class="relative flex h-screen">
        <AdminSidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="header-shell flex-shrink-0 z-50">
                <!-- Aura: Contains decorative background elements like glows and grids -->
                <div class="header-shell__aura" aria-hidden="true">
                    <div class="header-shell__glow header-shell__glow--primary"></div>
                    <div class="header-shell__glow header-shell__glow--accent"></div>
                    <div class="header-shell__grid"></div>
                </div>

                <!-- Content: A clean flex layout for the header items -->
                <div class="header-shell__content flex items-center justify-between px-6 h-20">
                    <!-- Left Side: Navigation Controls -->
                    <div class="flex items-center gap-4">
                        <SidebarTrigger />
                        <Breadcrumb />
                    </div>

                    <!-- Right Side: User Information and Actions -->
                    <div class="flex items-center gap-4">
                        <!-- A slot for contextual page actions (e.g., "Add New Product" button) -->
                        <div class="hidden lg:flex" data-slot="actions"></div>

                        <!-- Welcome message now uses semantic theme text colors -->
                        <span class="hidden xl:inline text-sm">
                            <span class="text-muted">Welcome,</span>
                            <strong class="font-semibold section-title">{{ authStore.currentUser?.username }}</strong>
                        </span>

                        <!-- Interactive controls are now grouped in a styled "pill" for a cleaner look -->
                        <div class="header-quick-actions flex items-center gap-2">
                            <ThemeSwitcher variant="dropdown" />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto custom-scrollbar section-bg">
                <ErrorUnauthorized :can-retry="canRetry" v-if="globalStateStore.isUnauthorized"
                    @retry="handleUnauthorizedRetry" />
                <router-view v-else v-slot="{ Component }">
                    <Transition name="fade-transform" mode="out-in">
                        <component :is="Component" :key="$route.fullPath" />
                    </Transition>
                </router-view>
                <!-- <router-view v-slot="{ Component }" >
                    <Transition name="fade-transform" mode="out-in">
                        <component :is="Component" :key="$route.fullPath" />
                    </Transition>
                </router-view> -->
            </main>
        </div>
    </div>
</template>

<style scoped>
/* Transition styles */
.fade-transform-enter-active,
.fade-transform-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
/* Page transition styles */
.fade-transform-enter-active,
.fade-transform-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-transform-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.fade-transform-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Scoped adjustments for the admin header glows to match the Pharmaceutical theme */
.header-shell__glow--primary {
    background: color-mix(in srgb, var(--color-primary-500) 55%, transparent);
    top: -50%;
    left: -15%;
}
.header-shell__glow--accent {
    background: color-mix(in srgb, var(--color-secondary-500) 45%, transparent);
    top: -40%;
    right: -10%;
}
</style>