<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useRoute } from 'vue-router';
import SidebarButton from './SidebarButton.vue';

import { PERMISSIONS } from '@/constants/permission/permissions';

import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
import {
    LayoutGrid, TrendingUp, Users, ShieldAlert, DollarSign, Settings, FolderKey, HelpCircle, X, Gamepad2,
    Home,
    ShoppingBag,
    Newspaper,
    Handshake,
    File,
    User,
    FileCheck,
    PartyPopper,
    Paperclip,
    Building,
    PillBottle,
    Star,
    Pen,
    ScreenShareIcon
} from 'lucide-vue-next';
import AppLogo from '../logo/AppLogo.vue';

const sidebar = useSidebarStore();
const route = useRoute();

const mainNav = computed(() => [
    {
        title: 'Dashboard',
        to: { name: 'dashboard.index' },
        icon: LayoutGrid,
        activeGroup: 'dashboard.index',
        permission: PERMISSIONS.DASHBOARD
    },
    // { 
    //     title: 'Analytics', 
    //     to: { name: 'analytics' }, 
    //     icon: TrendingUp, 
    //     activeGroup: 'analytics' 
    // },

    // { title: 'Users', to: { name: 'admin-users' }, icon: Users, active: route.name?.toString().startsWith('admin-users') },
    // { title: 'Events', to: { name: 'admin-events' }, icon: Gamepad2, active: route.name?.toString().startsWith('admin-events') },
    // { title: 'Transactions', to: { name: 'admin-transactions' }, icon: DollarSign, active: route.name?.toString().startsWith('admin-transactions') },
    // { title: 'Moderation', to: { name: 'admin-moderation' }, icon: ShieldAlert, active: route.name?.toString().startsWith('admin-moderation') },
]);

const pageNav = computed(() => [
    {
        title: 'Page Sections',
        to: { name: 'dashboard.content.index' },
        // to: { name: 'dashboard.manage-page.index' }, 
        icon: ScreenShareIcon,
        activeGroup: ['dashboard.manage-page', 'dashboard.hero', 'dashboard.about-us', "dashboard.gallery", "dashboard.content"],
        permission: PERMISSIONS.CONTENT.PAGE_CONTENT
    },
    // { 
    //     title: 'About', 
    //     to: { name: 'dashboard.index' }, 
    //     icon: LayoutGrid, 
    //     activeGroup: 'about' 
    // },
    {
        title: 'Leader',
        to: { name: 'dashboard.leaders.index' },
        icon: User,
        activeGroup: 'dashboard.leader',
        permission: PERMISSIONS.CMS.LEADERS
    },
    {
        title: 'Certification',
        to: { name: 'dashboard.certifications.index' },
        icon: FileCheck,
        activeGroup: 'dashboard.certification',
        permission: PERMISSIONS.CMS.CERTIFICATIONS
    },
    {
        title: 'Products',
        to: { name: 'dashboard.products.index' },
        icon: ShoppingBag,
        activeGroup: 'dashboard.product',
        permission: PERMISSIONS.PRODUCTS.PRODUCTS
    },
    {
        title: 'Brands',
        to: { name: 'dashboard.brands.index' },
        icon: PillBottle,
        activeGroup: 'dashboard.brand',
        permission: PERMISSIONS.PRODUCTS.BRANDS
    },
    {
        title: 'Articles',
        to: { name: 'dashboard.articles.index' },
        icon: Paperclip,
        activeGroup: 'dashboard.article',
        permission: PERMISSIONS.CONTENT.ARTICLES
    },
    {
        title: 'News',
        to: { name: 'dashboard.news.index' },
        icon: Newspaper,
        activeGroup: 'dashboard.news',
        permission: PERMISSIONS.CONTENT.NEWS_UPDATES
    },
    {
        title: 'Vacancy Announcements',
        to: { name: 'dashboard.jobs.index' },
        icon: TrendingUp,
        activeGroup: 'dashboard.jobs',
        permission: PERMISSIONS.CAREERS.JOB_OPENINGS
    },
    {
        title: 'Testimonials',
        to: { name: 'dashboard.testimonials.index' },
        icon: Star,
        activeGroup: 'dashboard.testimonial',
        permission: PERMISSIONS.CMS.TESTIMONIALS
    },
    {
        title: 'Applications',
        to: { name: 'dashboard.job-applications.index' },
        icon: Pen,
        activeGroup: 'dashboard.job-application',
        permission: PERMISSIONS.CAREERS.JOB_APPLICATIONS
    },
    {
        title: 'Contact Queries',
        to: { name: 'dashboard.contact-submissions.index' },
        icon: Handshake,
        activeGroup: 'dashboard.contact',
        permission: PERMISSIONS.CMS.CONTACT_SUBMISSIONS
    },
]);

const systemNav = computed(() => [
    // { title: 'Settings', to: { name: 'admin-settings' }, icon: Settings, active: route.name?.toString().startsWith('admin-settings') },
    {
        title: 'Access Control',
        to: { name: 'access-control.dashboard' },
        icon: FolderKey,
        activeGroup: 'access-control',
        permission: PERMISSIONS.ACCESS_CONTROL.DASHBOARD
    },
    {
        title: 'Settings',
        to: { name: 'settings.dashboard' },
        icon: Settings,
        activeGroup: 'settings',
        permission: PERMISSIONS.SETTINGS.DASHBOARD
    },
    // { title: 'Help & Docs', to: { name: 'admin-docs' }, icon: HelpCircle, active: route.name?.toString().startsWith('admin-docs') },
]);

const isCollapsed = computed(() => !sidebar.isDesktopOpen);
</script>

<template>
    <!-- Desktop Sidebar -->
    <aside
        class="hidden lg:flex flex-col bg-white dark:bg-gray-1150/95 backdrop-blur-lg border-r border-gray-100 dark:border-gray-800/50 transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-20' : 'w-64'">
        <!-- Logo -->
        <RouterLink to="/"
            class="flex group items-center flex-shrink-0 h-20 px-6 transition-transform duration-300 group-hover:scale-105 hover:rotate-[-5deg]">
            <!-- <AppLogo class="w-9 h-9 flex-shrink-0 transition-transform duration-300 ease-in-out" :class="{ 'rotate-[360deg]': !isCollapsed }" /> -->
            <!-- <div class="size-12 bg-secondary-1000 rounded-full flex items-center justify-center text-primary-1000 font-bold text-3xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]">
                Z
            </div> -->
            <img :src="zydinLogoImage"
                class="w-15 flex items-center justify-center text-primary-1000 font-bold text-3xl" />
            <div class="ml-3 font-bold text-lg whitespace-nowrap transition-all duration-200 delay-100"
                :class="{ 'opacity-0 -ml-8': isCollapsed }">
                <div class="font-bold text-xl text-primary-1200 dark:text-secondary-700">
                    Zydin
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="text-xs font-bold tracking-wider text-primary-1200 dark:text-secondary-1250/80">Biotech
                    </div>
                    <div class="h-px w-8 rounded-full bg-gradient-to-r from-secondary-500 to-transparent"></div>
                </div>
            </div>
        </RouterLink>

        <!-- Navigation -->
        <nav class="flex-1 flex flex-col p-3 space-y-6 overflow-y-auto custom-scrollbar">
            <div class="space-y-1">
                <div>
                    <p v-if="!isCollapsed"
                        class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">Menu</p>
                    <SidebarButton v-for="item in mainNav" :key="item.title" v-bind="item" />
                </div>
                <div>
                    <p v-if="!isCollapsed"
                        class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">Pages</p>
                    <SidebarButton v-for="item in pageNav" :key="item.title" v-bind="item" />
                </div>
            </div>
            <div class="mt-auto space-y-1">
                <p v-if="!isCollapsed"
                    class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">System</p>
                <SidebarButton v-for="item in systemNav" :key="item.title" v-bind="item" />
            </div>
        </nav>
    </aside>

    <!-- Mobile Sidebar (Overlay) -->
    <div class="lg:hidden">
        <!-- Backdrop -->
        <Transition enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity ease-in-out duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="sidebar.isMobileOpen" @click="sidebar.closeMobile()" class="fixed inset-0 bg-black/60 z-40">
            </div>
        </Transition>

        <!-- Panel -->
        <Transition enter-active-class="transition ease-in-out duration-300 transform"
            enter-from-class="-translate-x-full" enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out duration-300 transform" leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full">
            <aside v-if="sidebar.isMobileOpen"
                class="fixed top-0 left-0 w-64 h-full flex flex-col bg-white dark:bg-gray-1100 z-50 border-r border-gray-800/50">
                <div class="flex items-center justify-between h-20 px-4 flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <AppLogo class="w-9 h-9" />
                        <div>
                            <div class="font-bold text-xl text-blue-600 dark:text-blue-500">
                                Zydin
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="text-xs font-bold tracking-wider text-blue-500 dark:text-blue-400/80">
                                    Biotech</div>
                                <div class="h-px w-8 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                    <button @click="sidebar.closeMobile()"
                        class="p-2 -mr-2 text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <nav class="flex-1 flex flex-col justify-between p-4 pt-0 space-y-4 overflow-y-auto">
                    <div class="space-y-1">
                        <div>
                            <p class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">Menu
                            </p>
                            <SidebarButton v-for="item in mainNav" :key="item.title" v-bind="item" />
                        </div>
                        <div>
                            <p class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">Pages
                            </p>
                            <SidebarButton v-for="item in pageNav" :key="item.title" v-bind="item" />
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="px-4 py-2 text-xs font-semibold uppercase text-secondary-900 tracking-wider">System
                        </p>
                        <SidebarButton v-for="item in systemNav" :key="item.title" v-bind="item" />
                    </div>
                </nav>
            </aside>
        </Transition>
    </div>
</template>