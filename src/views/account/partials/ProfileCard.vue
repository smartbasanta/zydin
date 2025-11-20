// ProfileCard.vue

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

// Get the auth store and reactive refs for its state/getters
const authStore = useAuthStore();
const { isAuthenticated: showProfileCard, currentUser: authUser } = storeToRefs(authStore);

// This is placeholder data. You should replace it with real stats
// if they exist on your User model.
const userStats = computed(() => ({
  Posts: 0,
  Followers: 0,
  Following: 0,
}));
</script>

<template>
  <!-- The card will only render if the user is authenticated -->
  <div v-if="showProfileCard" class="relative rounded-2xl p-6 mb-6 overflow-hidden backdrop-blur-lg bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-30"></div>

    <div class="relative flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
      <div class="flex items-center space-x-4">
        <div class="relative size-16 md:size-20 shrink-0">
          <!-- The image source is now reactively bound to the store's user object -->
          <img :src="authUser?.avatar_url" alt="User Avatar" class="w-full h-full object-cover rounded-full border-2 border-black/50 dark:border-white/90">
        </div>
        <div>
          <h2 class="text-xl font-bold bg-gradient-to-r from-purple-750 to-blue-750 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent capitalize">
            {{ authUser?.username }}
          </h2>
          <p class="text-secondary">
            {{ authUser?.email }}
          </p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="(value, key) in userStats" :key="key" class="p-3 rounded-xl backdrop-blur-sm bg-black/2 hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10">
          <div class="text-2xl font-bold bg-gradient-to-r from-purple-750 to-blue-750 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
            {{ value }}
          </div>
          <div class="text-xs text-purple-800/80 dark:text-purple-200/80 capitalize">
            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <slot />
</template>