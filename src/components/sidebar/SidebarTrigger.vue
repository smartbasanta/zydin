<script setup lang="ts">
    import { PanelLeft, Menu } from 'lucide-vue-next';
    import { useSidebarStore } from '@/stores/sidebar.store';
    import { onMounted, onUnmounted, ref } from 'vue';

    const sidebar = useSidebarStore();
    const isMobile = ref(window.innerWidth < 1024);

    const handleResize = () => { isMobile.value = window.innerWidth < 1024; };
    onMounted(() => window.addEventListener('resize', handleResize));
    onUnmounted(() => window.removeEventListener('resize', handleResize));

    const toggle = () => {
        if (isMobile.value) {
            sidebar.toggleMobile();
        } else {
            sidebar.toggleDesktop();
        }
    }
</script>

<template>
    <!-- Reusing the header-menu-trigger for a consistent look and feel -->
    <button @click="toggle" class="header-menu-trigger">
        <Menu v-if="isMobile" class="w-5 h-5" />
        <PanelLeft v-else class="w-5 h-5" />
        <span class="sr-only">Toggle Sidebar</span>
    </button>
</template>

<style scoped>
/* No scoped styles needed as all styling comes from the global `header-menu-trigger` class */
@reference "@/assets/css/main.css";
</style>