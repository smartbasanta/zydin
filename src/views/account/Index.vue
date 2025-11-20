<script setup lang="ts">
import {
  GiftIcon, InfoIcon, LifeBuoyIcon, MapPinIcon, ScrollIcon, ShieldCheckIcon, StarIcon, UserPenIcon,
} from 'lucide-vue-next';

import ProfileCard from './partials/ProfileCard.vue';

const userAccountPages = [
  {
    id: 'profile',
    icon: UserPenIcon,
    title: 'Profile',
    route: '/me',
    description: 'Manage your personal details and preferences'
  },
  {
    id: 'addressBook',
    icon: MapPinIcon,
    title: 'Address Book',
    route: '/user/addresses',
    description: 'Manage your shipping and billing addresses'
  },
  {
    id: 'security',
    icon: ShieldCheckIcon,
    title: 'Security',
    route: '/user/account-security',
    description: 'Update your password and enable 2FA'
  },

  // --- User Activity & Engagement ---
  // Pages related to the user's interaction and content on the platform.
  {
    id: 'reviews',
    icon: StarIcon,
    title: 'My Reviews',
    route: '/user/reviews',
    description: 'View and manage your product reviews'
  },
  {
    id: 'referrals',
    icon: GiftIcon, // A better icon for rewards
    title: 'Referrals',
    route: '/user/referrals',
    description: 'Invite friends and earn rewards'
  },

  // --- Platform Information & Support ---
  // General platform links and help resources.
  {
    id: 'helpSupport',
    icon: LifeBuoyIcon,
    title: 'Help & Support',
    route: '/help',
    description: 'Find answers or contact customer service'
  },
  {
    id: 'terms',
    icon: ScrollIcon,
    title: 'Terms & Policies',
    route: '/terms',
    description: 'Review our platform policies and rules'
  },
  {
    id: 'about',
    icon: InfoIcon,
    title: 'About Us',
    route: '/about',
    description: 'Learn more about our platform'
  }
];
</script>

<template>
  <ProfileCard />
  <div class="grid md:grid-cols-2 gap-3 min-w-max lg:min-w-0">
    <RouterLink v-for="accountPage in userAccountPages" :key="accountPage.id" :to="accountPage.route"
      class="group relative p-4 rounded-2xl backdrop-blur-lg bg-black/5 hover:bg-black/10 border-black/10 dark:bg-white/5 dark:hover:bg-white/10 border dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div class="flex items-center space-x-3">
        <span
          class="text-2xl transition group-hover:scale-125 group-hover:text-indigo-400 bg-gray-0 dark:bg-gray-1150 rounded-full p-2">
          <component :is="accountPage.icon" />
        </span>
        <div class="text-left">
          <div class="font-medium text-black/80 group-hover:text-black dark:text-white/90 dark:group-hover:text-white">
            {{ accountPage.title }}</div>
          <div
            class="text-xs text-black/50 group-hover:text-black/70 dark:text-white/50 dark:group-hover:text-white/70">{{
              accountPage.description }}</div>
        </div>
      </div>
      <div
        class="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
      </div>
    </RouterLink>
  </div>
</template>
