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
            <header class="flex-shrink-0 h-20 bg-white/80 dark:bg-gray-1150/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between px-6 z-50">
                <div class="flex items-center gap-4">
                    <SidebarTrigger />
                    <Breadcrumb />
                </div>
                <div class="flex items-center gap-4">
                    <div class="hidden lg:flex">
                        <div data-slot="actions"></div>
                    </div>
                    <span class="hidden sm:inline text-sm text-secondary">Welcome, <strong class="font-semibold">{{ authStore.currentUser?.username }}</strong></span>
                    <ThemeMenu />
                    <UserMenu />
                </div>
            </header>

            <main class="flex-1 overflow-y-auto custom-scrollbar">
                <ErrorUnauthorized :can-retry="canRetry"
                    v-if="globalStateStore.isUnauthorized" 
                    @retry="handleUnauthorizedRetry" 
                />
                <router-view v-else v-slot="{ Component }" >
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
</style>