<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import AppLogo from '@/components/logo/AppLogo.vue';
import ThemeMenu from '@/components/menu/ThemeMenu.vue';
import UserMenu from '@/components/menu/UserMenu.vue';
import DropdownMenu from '@/components/menu/DropdownMenu.vue';
import { BellIcon, MenuIcon, XIcon, ChevronDownIcon, CheckIcon, LogInIcon, UserIcon as UserPlusIcon, LayoutDashboardIcon, UserSquareIcon, LogOutIcon } from 'lucide-vue-next';
import { useSystemNotificationStore } from '@/stores/systemNotification.store';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { DropdownParent } from '@/types/dropdownLinkRelated';
import { useDefaultImages } from '@/composables/useDefaultImages';
import AppLogoAnimation from '@/components/logo/AppLogoAnimation.vue';
import ThemeSwitcher from '@/components/appearance/ThemeSwitcher.vue';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
const notificationStore = useSystemNotificationStore();

const route = useRoute();
const router = useRouter(); // <-- Added


const isMobileMenuOpen = ref(false)
const openMobileSubmenu = ref<string | null>(null);

watch(() => route.path, () => {
    isMobileMenuOpen.value = false;
});

// Prevent background scroll when mobile menu is open
watch(isMobileMenuOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';

        const activeParent = navLinks.find(link =>
            link.children?.some(child => child.path === route.path)
        );

        // If a parent is found, open its submenu. Otherwise, ensure no submenu is open.
        if (activeParent) {
            openMobileSubmenu.value = activeParent.name;
        } else {
            openMobileSubmenu.value = null;
        }
    } else {
        document.body.style.overflow = '';
    }
});

const toggleMobileSubmenu = (name: string) => {
    if (openMobileSubmenu.value === name) {
        openMobileSubmenu.value = null;
    } else {
        openMobileSubmenu.value = name;
    }
};
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.currentUser);

const navigateTo = (path: string) => {
    router.push(path);
    isMobileMenuOpen.value = false; // Close mobile menu on navigation
};

const handleLogout = async () => {
    await authStore.logout();
    isMobileMenuOpen.value = false; // Close mobile menu on logout
};

const userMenuItems = computed(() => {
    if (isAuthenticated.value) {
        return [
            { label: 'Dashboard', icon: LayoutDashboardIcon, action: () => navigateTo('/dashboard') },
            { label: 'Profile', icon: UserSquareIcon, action: () => navigateTo('/me') },
        ];
    } else {
        return [
            { label: 'Login', icon: LogInIcon, action: () => navigateTo('/login') },
            { label: 'Register', icon: UserPlusIcon, action: () => navigateTo('/register') },
        ];
    }
});
const navLinks: DropdownParent[] = [
    { name: 'Home', path: '/' },
    {
        name: 'About Us',
        path: '/about',
        children: [
            { name: 'Company Overview', path: '/about' },
            { name: 'Leadership Team', path: '/about/leadership' },
            { name: 'Certifications', path: '/about/certifications' },
        ]
    },
    {
        name: 'Products',
        path: '/products',
        children: [
            { name: 'Product Overview', path: '/products' },
            { name: 'Product by Brands', path: '/products/brands', },
            { name: 'Product by Category', path: '/products/categories', }
        ]
    },
    {
        name: 'Media',
        path: '/media',
        children: [
            { name: 'Articles & Blogs', path: '/media/articles' },
            { name: 'News & Updates', path: '/media/news' },
        ]
    },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
]
</script>
<template>
    <header class="sticky top-0 z-50 w-full border-b header-bg">
        <div class="mx-auto px-8 min-h-20 flex items-center justify-around">
            <!-- Left Side: Logo -->
            <RouterLink to="/" class="flex items-center space-x-3 group">
                <!-- <AppLogo class="size-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]" /> -->
                <!-- Fallback for AppLogo if not created -->
                <!-- <div
                    class="size-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]">
                    Z
                </div> -->
                <!-- <div class="w-full max-w-lg mx-auto">
                    <div class="relative aspect-square">
                    </div>
                </div> -->
                <div class="w-18 max-w-lg mx-auto mr-2">
                    <div class="relative aspect-square">
                        <AppLogoAnimation :glow="false" :animation="true" />
                    </div>
                </div>
                <!-- <img :src="zydinLogoImage" class="w-18" /> -->
                <div class="hidden sm:block">
                    <div class="font-bold text-3xl header-logo-text">
                        Zydin Biotech
                    </div>
                    <div class="flex items-center justify-end gap-1.5">
                        <div class="h-px w-8 rounded-full bg-gradient-to-r from-primary-400 to-transparent">
                        </div>
                        <div class="text-xs font-bold tracking-wider header-tagline">From Farm to Formulation</div>
                    </div>
                </div>
            </RouterLink>

            <!-- Center: Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-6 text-[17px]">
                <DropdownMenu v-for="link in navLinks" :key="link.name" :item="link" />
            </nav>

            <!-- Right Side: Actions -->
            <div class="flex items-center gap-2 sm:gap-4">
                <!-- Notifications -->
                <!-- <button @click="notificationStore.togglePanel(route.name?.toString() ?? '')" class="header-menu-trigger relative">
                    <BellIcon class="w-5 h-5" />
                    <span v-if="notificationStore.unreadCount > 0" class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold border-2 border-white dark:border-gray-1100">
                        {{ notificationStore.unreadCount }}
                    </span>
                </button> -->
                <button @click="notificationStore.togglePanel()"
                    class="header-menu-trigger relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <BellIcon class="w-5 h-5 text-white" />
                    <span v-if="notificationStore.unreadCount > 0"
                        class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold border-2 border-white dark:border-gray-1100">
                        {{ notificationStore.unreadCount }}
                    </span>
                </button>

                <!-- Theme menu -->
                <ThemeSwitcher variant="dropdown" />

                <!-- User Menu -->
                <UserMenu />

                <!-- Mobile Menu Burger -->
                <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="lg:hidden p-2 rounded-md text-primary-1250 hover:bg-secondary-900 dark:hover:bg-gray-700 transition-colors">
                    <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
                    <XIcon v-else class="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>
    <!-- Mobile Menu Panel -->
    <div class="relative z-50 lg:hidden" :class="{ 'pointer-events-none': !isMobileMenuOpen }"
        aria-labelledby="mobile-menu-title" role="dialog" aria-modal="true">
        <!-- Panel -->
        <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
                <!-- Overlay -->
                <Transition enter-active-class="ease-in-out duration-500" enter-from-class="opacity-0"
                    enter-to-class="opacity-100" leave-active-class="ease-in-out duration-500"
                    leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-show="isMobileMenuOpen" @click="isMobileMenuOpen = false"
                        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"></div>
                </Transition>
                <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                        enter-from-class="translate-x-full" enter-to-class="translate-x-0"
                        leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                        leave-from-class="translate-x-0" leave-to-class="translate-x-full">
                        <div v-show="isMobileMenuOpen" class="pointer-events-auto w-screen max-w-sm">
                            <!-- <div class="flex h-full flex-col overflow-y-auto bg-gradient-to-br from-white/100 via-white/50 to-blue-500/50 dark:from-gray-1100/70 dark:via-blue-1100/100 dark:to-gray-1100/70 shadow-xl "> -->
                            <div class="flex h-full flex-col overflow-y-auto shadow-xl ">
                                <!-- Header -->
                                <div
                                    class="px-4 py-4 sm:px-6 border-b border-gray-400/70 bg-gradient-to-r from-white via-blue-100/70 to-white">
                                    <div class="flex items-center justify-between">
                                        <RouterLink to="/" class="flex items-center space-x-3 group">
                                            <!-- <AppLogo class="size-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]" /> -->
                                            <!-- Fallback for AppLogo if not created -->
                                            <!-- <div
                                                class="size-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]">
                                                Z
                                            </div> -->
                                            <img :src="zydinLogoImage" class="w-15" />
                                            <div>
                                                <div class="font-bold text-xl text-blue-600 dark:text-blue-500">
                                                    Zydin Biotech
                                                </div>
                                            </div>
                                        </RouterLink>
                                        <button @click="isMobileMenuOpen = false" type="button"
                                            class="header-menu-trigger">
                                            <XIcon class="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Navigation List -->
                                <div class="flex flex-col justify-between flex-1 bg-white dark:bg-gray-1100">
                                    <!-- <div class="flex flex-col justify-between flex-1  mobile-nav-panel"> -->
                                    <nav class="relative flex-1 p-4 sm:p-6 space-y-2">
                                        <div v-for="link in navLinks" :key="link.name">
                                            <button v-if="link.children" @click="toggleMobileSubmenu(link.name)"
                                                class="mobile-nav-link w-full flex justify-between items-center text-left"
                                                :class="{ 'mobile-nav-link-active': openMobileSubmenu === link.name }">
                                                <span>{{ link.name }}</span>
                                                <ChevronDownIcon class="w-5 h-5 transition-transform duration-300"
                                                    :class="{ 'rotate-180': openMobileSubmenu === link.name }" />
                                            </button>
                                            <RouterLink v-else :to="link.path"
                                                class="mobile-nav-link w-full flex justify-between items-center text-left"
                                                exact-active-class="mobile-nav-link-exact-active" custom
                                                v-slot="{ isActive, isExactActive, navigate }">
                                                <a @click="navigate();" class="menu-dropdown-item rounded-lg"
                                                    :class="{ 'mobile-nav-link-exact-active': isExactActive }"
                                                    role="menuitem" data-dropdown-item="true">
                                                    <span class="flex-1">{{ link.name }}</span>
                                                    <CheckIcon v-if="isExactActive" class="w-4 h-4" />
                                                </a>
                                            </RouterLink>

                                            <div v-if="link.children && openMobileSubmenu === link.name"
                                                class="mt-2 pl-4 flex flex-col space-y-1 border-l-2 border-blue-900/70 dark:border-blue-700">
                                                <RouterLink v-for="child in link.children" :key="child.name"
                                                    :to="child.path"
                                                    class="mobile-nav-sublink w-full flex justify-between items-center text-left"
                                                    exact-active-class="mobile-nav-link-exact-active" custom
                                                    v-slot="{ isActive, isExactActive, navigate }">
                                                    <a @click="navigate();" class="menu-dropdown-item rounded-lg"
                                                        :class="{ 'mobile-nav-link-exact-active': isExactActive }"
                                                        role="menuitem" data-dropdown-item="true">
                                                        <span class="flex-1">{{ child.name }}</span>
                                                        <CheckIcon v-if="isExactActive" class="w-4 h-4" />
                                                    </a>
                                                </RouterLink>
                                            </div>
                                        </div>
                                    </nav>
                                    <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800">
                                        <!-- User Info Header -->
                                        <div v-if="isAuthenticated && user" class="p-3 pb-2 flex gap-3 items-center"
                                            role="none">
                                            <div
                                                class="flex-shrink-0 grid place-content-center size-10 rounded-full bg-gray-200 dark:bg-gray-700">
                                                <UserSquareIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            </div>
                                            <div class="truncate">
                                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                                                    :title="user.username">{{ user.username }}</p>
                                                <p class="truncate text-xs font-medium text-gray-500 dark:text-gray-400"
                                                    :title="user.email">{{ user.email }}</p>
                                            </div>
                                        </div>

                                        <!-- Main Menu Items -->
                                        <div class="space-y-1" role="none">
                                        <button v-for="item in userMenuItems" :key="item.label"
                                            @click="item.action()"
                                            class="mobile-nav-link w-full flex items-center gap-3 text-left hover:scale-105 active:scale-95"
                                            role="menuitem">
                                            <component :is="item.icon" class="h-5 w-5" />
                                            <span>{{ item.label }}</span>
                                        </button>
                                        </div>

                                        <!-- Logout -->
                                        <div v-if="isAuthenticated" class="mt-2">
                                            <button @click="handleLogout"
                                                class="mobile-nav-link !text-red-600 dark:!text-red-400 hover:!bg-red-500/10 w-full flex items-center gap-3 text-left hover:scale-105 active:scale-95"
                                                role="menuitem">
                                                <LogOutIcon class="h-5 w-5" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@reference "@/assets/main.css";

.mobile-nav-link {
    @apply text-lg font-semibold text-gray-700 dark:text-gray-200 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95;
}

.mobile-nav-sublink {
    @apply text-base font-medium text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95;
}

.mobile-nav-link-active {
    @apply text-blue-800 dark:text-blue-500;
}

.mobile-nav-link-exact-active {
    @apply bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-500;
}
</style>