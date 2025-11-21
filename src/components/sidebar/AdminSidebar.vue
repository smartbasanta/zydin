<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar.store';
import SidebarButton from './SidebarButton.vue';
import { PERMISSIONS } from '@/constants/permission/permissions';
import { useDefaultImages } from '@/composables/useDefaultImages';
import {
    LayoutGrid, TrendingUp, Users, ShieldAlert, DollarSign, Settings, FolderKey, X,
    ShoppingBag, Newspaper, Handshake, User, FileCheck, Paperclip, Building, PillBottle, Star, Pen, ScreenShareIcon
} from 'lucide-vue-next';
import AppLogoAnimation from '../logo/AppLogoAnimation.vue';

const { zydinLogoImage } = useDefaultImages();
const sidebar = useSidebarStore();

// --- No changes to nav item definitions ---
const mainNav = computed(() => [
    { title: 'Dashboard', to: { name: 'dashboard.index' }, icon: LayoutGrid, activeGroup: 'dashboard.index', permission: PERMISSIONS.DASHBOARD },
]);
const pageNav = computed(() => [
    { title: 'Page Sections', to: { name: 'dashboard.content.index' }, icon: ScreenShareIcon, activeGroup: ['dashboard.manage-page', 'dashboard.hero', 'dashboard.about-us', "dashboard.gallery", "dashboard.content"], permission: PERMISSIONS.CONTENT.PAGE_CONTENT },
    { title: 'Leaders', to: { name: 'dashboard.leaders.index' }, icon: User, activeGroup: 'dashboard.leader', permission: PERMISSIONS.CMS.LEADERS },
    { title: 'Certifications', to: { name: 'dashboard.certifications.index' }, icon: FileCheck, activeGroup: 'dashboard.certification', permission: PERMISSIONS.CMS.CERTIFICATIONS },
    { title: 'Products', to: { name: 'dashboard.products.index' }, icon: ShoppingBag, activeGroup: 'dashboard.product', permission: PERMISSIONS.PRODUCTS.PRODUCTS },
    { title: 'Brands', to: { name: 'dashboard.brands.index' }, icon: PillBottle, activeGroup: 'dashboard.brand', permission: PERMISSIONS.PRODUCTS.BRANDS },
    { title: 'Articles', to: { name: 'dashboard.articles.index' }, icon: Paperclip, activeGroup: 'dashboard.article', permission: PERMISSIONS.CONTENT.ARTICLES },
    { title: 'News', to: { name: 'dashboard.news.index' }, icon: Newspaper, activeGroup: 'dashboard.news', permission: PERMISSIONS.CONTENT.NEWS_UPDATES },
    { title: 'Vacancies', to: { name: 'dashboard.jobs.index' }, icon: TrendingUp, activeGroup: 'dashboard.jobs', permission: PERMISSIONS.CAREERS.JOB_OPENINGS },
    { title: 'Testimonials', to: { name: 'dashboard.testimonials.index' }, icon: Star, activeGroup: 'dashboard.testimonial', permission: PERMISSIONS.CMS.TESTIMONIALS },
    { title: 'Applications', to: { name: 'dashboard.job-applications.index' }, icon: Pen, activeGroup: 'dashboard.job-application', permission: PERMISSIONS.CAREERS.JOB_APPLICATIONS },
    { title: 'Contact Queries', to: { name: 'dashboard.contact-submissions.index' }, icon: Handshake, activeGroup: 'dashboard.contact', permission: PERMISSIONS.CMS.CONTACT_SUBMISSIONS },
]);
const systemNav = computed(() => [
    { title: 'Access Control', to: { name: 'access-control.dashboard' }, icon: FolderKey, activeGroup: 'access-control', permission: PERMISSIONS.ACCESS_CONTROL.DASHBOARD },
    { title: 'Settings', to: { name: 'settings.dashboard' }, icon: Settings, activeGroup: 'settings', permission: PERMISSIONS.SETTINGS.DASHBOARD },
]);

const isCollapsed = computed(() => !sidebar.isDesktopOpen);
</script>

<template>
    <!-- Desktop Sidebar -->
    <aside
        class="sidebar-shell"
        :class="isCollapsed ? 'w-20' : 'w-64'">
        <!-- Redesigned Logo Area for smooth animation -->
        <RouterLink to="/" class="sidebar-logo group">
             <!-- <div class="header-logo-shell"> -->
                <div class="relative aspect-square w-10 h-10">
                    <AppLogoAnimation :glow="false" :animation="!isCollapsed" />
                </div>
            <!-- </div> -->
            <div 
                class="overflow-hidden transition-all duration-300 ease-in-out"
                :class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-2'">
                <span class="text-xl font-bold header-logo-text whitespace-nowrap">Zydin Biotech</span>
            </div>
        </RouterLink>

        <!-- Navigation -->
        <nav class="flex-1 flex flex-col p-3 space-y-4 overflow-y-auto no-scrollbar">
            <div>
                <p v-if="!isCollapsed" class="nav-heading">Menu</p>
                <SidebarButton v-for="item in mainNav" :key="item.title" v-bind="item" />
            </div>
            <div>
                <p v-if="!isCollapsed" class="nav-heading">Content Management</p>
                <SidebarButton v-for="item in pageNav" :key="item.title" v-bind="item" />
            </div>
            <div class="mt-auto">
                <p v-if="!isCollapsed" class="nav-heading">System</p>
                <SidebarButton v-for="item in systemNav" :key="item.title" v-bind="item" />
            </div>
        </nav>
    </aside>

    <!-- Mobile Sidebar (Overlay) - uses a cleaner design -->
    <div class="lg:hidden">
        <Transition enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity ease-in-out duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="sidebar.isMobileOpen" @click="sidebar.closeMobile()" class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"></div>
        </Transition>

        <Transition enter-active-class="transition ease-in-out duration-300 transform"
            enter-from-class="-translate-x-full" enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out duration-300 transform" leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full">
            <aside v-if="sidebar.isMobileOpen" class="mobile-sidebar-shell">
                <div class="flex items-center justify-between h-20 px-4 flex-shrink-0 border-b border-muted">
                    <div class="flex items-center gap-2">
                        <div class="header-logo-shell w-12 h-12">
                           <AppLogoAnimation :glow="false" :animation="true" />
                        </div>
                        <span class="text-xl font-bold header-logo-text">Zydin</span>
                    </div>
                    <button @click="sidebar.closeMobile()" class="btn btn-ghost btn-icon">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <nav class="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
                     <SidebarButton v-for="item in mainNav" :key="item.title" v-bind="item" />
                     <SidebarButton v-for="item in pageNav" :key="item.title" v-bind="item" />
                     <SidebarButton v-for="item in systemNav" :key="item.title" v-bind="item" />
                </nav>
            </aside>
        </Transition>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.sidebar-shell {
    @apply hidden lg:flex flex-col transition-all duration-300 ease-in-out;
    /* Use a solid, theme-aware background for better contrast */
    background-color: var(--section-bg);
    border-right: 1px solid var(--card-border);
    /* Add a subtle inner shadow for depth */
    box-shadow: inset -5px 0 15px -5px rgba(0,0,0,0.05);
}
:global(.dark) .sidebar-shell {
    box-shadow: inset -5px 0 15px -5px rgba(0,0,0,0.2);
}

.mobile-sidebar-shell {
    @apply fixed top-0 left-0 w-64 h-full flex flex-col z-50;
    background-color: var(--section-bg);
    border-right: 1px solid var(--card-border);
}

.sidebar-logo {
    @apply flex items-center flex-shrink-0 h-20 px-6 overflow-hidden;
}
/* When collapsed, the logo area centers the single icon */
.sidebar-shell.w-20 .sidebar-logo {
    @apply px-0 justify-center;
}

.nav-heading {
    @apply px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300;
    color: var(--section-description-color);
}
</style>