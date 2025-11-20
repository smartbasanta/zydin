<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { Home, Gamepad2, Trophy, User, Bell, Wallet, TrendingUp, type LucideIcon } from 'lucide-vue-next'
    import { useTheme } from '@/composables/useTheme'
    import AppLogo from '@/components/logo/AppLogo.vue'
    import ThemeSwitcher from '@/components/appearance/ThemeSwitcher.vue'
import AppHeader from '@/components/navigation/header/AppHeader.vue'

    interface NavItem {
        name: string
        path: string
        icon: LucideIcon
    }

    const route = useRoute()

    

    const navItems: NavItem[] = [
        { name: 'Home', path: '/dashboard', icon: Home },
    ]

    const pageTitle = computed<string>(() => {
        const current = navItems.find(item => route.path.startsWith(item.path));
        return current ? current.name : 'Zydin Biotech';
    });
</script>

<template>
  <div class="min-h-screen">
    <!-- Top Navigation -->
    <!-- class="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-[#8e0413] to-[#bd0526] " -->
    <!-- class="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-[#2469b5] to-[#337ecf] " -->
    <AppHeader />
    

    <!-- Main Content -->
    <main class="flex-1 px-4 py-6 pb-20">
        <div class="max-w-2xl mx-auto">
            <RouterView />
        </div>
    </main>

    <!-- Bottom Navigation -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-1000/95 backdrop-blur-lg border-t border-green-200 dark:border-green-1100 z-50 shadow-md"
    >
      <div class="px-4 py-3">
        <div class="flex items-center justify-around max-w-2xl mx-auto">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 relative group"
            :class="
              $route.path === item.path
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400'
            "
          >
            <!-- Active Background -->
            <div
              v-if="$route.path === item.path"
              class="absolute inset-0 bg-green-500/10 dark:bg-green-900/20 rounded-xl"
            ></div>

            <!-- Active Indicator -->
            <div
              v-if="$route.path === item.path"
              class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"
            ></div>

            <component
              :is="item.icon"
              class="w-6 h-6 mb-1 transition-all duration-300 group-hover:scale-110 relative z-10"
            />
            <span class="text-xs font-medium relative z-10">{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>