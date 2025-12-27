<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import AppLogo from '@/components/logo/AppLogo.vue';
import ThemeMenu from '@/components/menu/ThemeMenu.vue';
import UserMenu from '@/components/menu/UserMenu.vue';
import DropdownMenu from '@/components/menu/DropdownMenu.vue';
import UtilityMenu from '@/components/menu/UtilityMenu.vue';
import { BellIcon, MenuIcon, XIcon, ChevronDownIcon, CheckIcon, LogInIcon, UserIcon as UserPlusIcon, LayoutDashboardIcon, UserSquareIcon, LogOutIcon, SparklesIcon, ArrowUpRightIcon } from 'lucide-vue-next';
import { useSystemNotificationStore } from '@/stores/systemNotification.store';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { DropdownParent } from '@/types/dropdownLinkRelated';

interface SecondaryNavLink {
  name: string;
  path: string;
}

interface UtilityItem {
  label: string;
  icon: any;
  action: () => void;
  showBadge?: any;
  badge?: any;
  component?: any;
}
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

        const activeParent = mainNavLinks.find(link =>
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
const headerStatusMessage = computed(() =>
    isAuthenticated.value ? 'Secure portal active' : 'Guest preview mode'
);

const navigateTo = (path: string) => {
    router.push(path);
    isMobileMenuOpen.value = false; // Close mobile menu on navigation
};

const handleLogout = async () => {
    await authStore.logout();
    isMobileMenuOpen.value = false; // Close mobile menu on logout
};

// Consolidated main navigation - streamlined structure
const mainNavLinks: DropdownParent[] = [
    {
        name: 'Company',
        path: '/',
        children: [
            { name: 'Home', path: '/' },
            { name: 'Overview', path: '/about' },
            { name: 'Leadership Team', path: '/about/leadership' },
            { name: 'Certifications', path: '/about/certifications' },
        ]
    },
    {
        name: 'Programs & Media',
        path: '/programs',
        children: [
            { name: 'Programs', path: '/programs' },
            { name: 'Articles & Blogs', path: '/media/articles' },
            { name: 'News & Updates', path: '/media/news' },
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
        name: 'Investor Relations',
        path: '/investor-relations',
        children: [
            { name: 'Overview', path: '/investor-relations' },
            { name: 'Corporate Governance', path: '/investor-relations/corporate-governance' },
        ]
    }
]


</script>
<template>
    <header class="header-shell sticky top-0 z-50 w-full">
        <!-- <header class="header-shell sticky top-0 z-50 w-full"> -->
        <div class="header-shell__aura" aria-hidden="true">
            <span class="header-shell__glow header-shell__glow--primary"></span>
            <span class="header-shell__glow header-shell__glow--accent"></span>
            <span class="header-shell__grid"></span>
        </div>
        <div class="header-shell__content mx-auto px-6 md:px-8 min-h-20 flex items-center justify-between gap-6">
            <div class="header-brand flex items-center gap-4 flex-shrink-0">
                <RouterLink to="/" class="flex items-center gap-3 group">
                    <div class="header-logo-shell">
                        <div class="relative aspect-square">
                            <AppLogoAnimation :glow="false" :animation="true" />
                        </div>
                    </div>
                    <div class="header-brand__text block lg:hidden xl:block">
                        <div class="header-brand__title">
                            <div class="font-bold text-3xl header-logo-text inline-flex items-center gap-2">
                                Zydin Biotech
                                <SparklesIcon class="w-4 h-4 header-logo-text drop-shadow" />
                            </div>
                        </div>
                        <div class="header-brand__meta">
                            <span class="header-meta-chip">Hope for Life</span>
                            <span class="header-meta-separator" aria-hidden="true"></span>
                            <!-- <span class="header-meta-chip header-meta-chip--accent">Life Sciences AI</span> -->
                        </div>
                    </div>
                </RouterLink>
            </div>

            <nav class="header-nav hidden lg:flex items-center justify-center flex-1 px-4 bg-transparent">
                <div class="flex items-center gap-6 bg-transparent">
                    <DropdownMenu v-for="link in mainNavLinks" :key="link.name" :item="link" />
                </div>
            </nav>

            <div class="flex items-center gap-2 sm:gap-4 header-actions flex-shrink-0">
                <!-- Utility Menu -->
                <UtilityMenu />
                <!-- User Menu -->
                <UserMenu />
                <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="header-menu-trigger mobile-toggle-button">
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
                        class="fixed inset-0 backdrop-blur-sm transition-opacity"
                        :style="{ backgroundColor: 'color-mix(in srgb, var(--color-gray-900) 70%, transparent)' }"></div>
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
                                    class="px-4 py-4 sm:px-6 border-b"
                                    :style="{
                                        borderColor: 'color-mix(in srgb, var(--header-link-hover) 20%, transparent)',
                                        background: 'linear-gradient(120deg, color-mix(in srgb, var(--header-link-hover) 10%, transparent), rgba(255,255,255,0.85))'
                                    }">
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
                                <div class="flex flex-col justify-between flex-1"
                                    :style="{
                                        background: 'color-mix(in srgb, var(--color-gray-0) 92%, transparent)'
                                    }">
                                    <!-- <div class="flex flex-col justify-between flex-1  mobile-nav-panel"> -->
                                    <nav class="relative flex-1 p-4 sm:p-6 space-y-2">
                                        <!-- Main Navigation -->
                                        <div v-for="link in mainNavLinks" :key="link.name">
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
                                                class="mt-2 pl-4 flex flex-col space-y-1 border-l-2"
                                                :style="{ borderColor: 'color-mix(in srgb, var(--header-link-hover) 35%, transparent)' }">
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

                                        <!-- Divider -->
                                        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                                        <!-- Additional Utility Items (now in User Menu) -->
                                        <RouterLink to="/career"
                                            class="mobile-nav-link w-full flex justify-between items-center text-left"
                                            exact-active-class="mobile-nav-link-exact-active" custom
                                            v-slot="{ isActive, isExactActive, navigate }">
                                            <a @click="navigate();" class="menu-dropdown-item rounded-lg"
                                                :class="{ 'mobile-nav-link-exact-active': isExactActive }"
                                                role="menuitem" data-dropdown-item="true">
                                                <span class="flex-1">Career</span>
                                                <CheckIcon v-if="isExactActive" class="w-4 h-4" />
                                            </a>
                                        </RouterLink>
                                        <RouterLink to="/contact"
                                            class="mobile-nav-link w-full flex justify-between items-center text-left"
                                            exact-active-class="mobile-nav-link-exact-active" custom
                                            v-slot="{ isActive, isExactActive, navigate }">
                                            <a @click="navigate();" class="menu-dropdown-item rounded-lg"
                                                :class="{ 'mobile-nav-link-exact-active': isExactActive }"
                                                role="menuitem" data-dropdown-item="true">
                                                <span class="flex-1">Contact</span>
                                                <CheckIcon v-if="isExactActive" class="w-4 h-4" />
                                            </a>
                                        </RouterLink>
                                    </nav>
                                    <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800">
                                        <!-- User Info Header -->
                                        <div v-if="isAuthenticated && user" class="p-3 pb-2 flex gap-3 items-center"
                                            role="none">
                                            <div
                                                class="flex-shrink-0 grid place-content-center size-10 rounded-full"
                                                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-gray-300) 80%, transparent)' }">
                                                <UserSquareIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            </div>
                                            <div class="truncate">
                                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                                                    :title="user.username">{{ user.username }}</p>
                                                <p class="truncate text-xs font-medium text-gray-500 dark:text-gray-400"
                                                    :title="user.email">{{ user.email }}</p>
                                            </div>
                                        </div>

                                        <!-- Note: User menu items are now handled by the UserMenu component -->
                                        <!-- User actions are consolidated in the UserMenu dropdown above -->
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