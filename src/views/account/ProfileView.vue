<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// import { useAuthStore } from '@/stores/auth.store';
import { useRoute } from 'vue-router';
// import { storeToRefs } from 'pinia';
// import Profile from './partials/Profile.vue';
// import Addresses from './partials/Address.vue';
// import Settings from './partials/Settings.vue';
// import AvatarUploader from './partials/AvatarUploader.vue';
import type { User } from '@/types/auth';

// const activeTab = ref<Tab>('Profile');
const route = useRoute();
const tabs = [
  { name: 'Profile', routeName: 'me-profile' },
  { name: 'Addresses', routeName: 'me-address' },
  { name: 'Settings', routeName: 'me-settings' }
];

// const authStore = useAuthStore();
// const { currentUser } = storeToRefs(authStore);

const activeTab = computed(() => {
    // Find the tab that corresponds to the current route name
    const currentRouteName = route.name;
    const foundTab = tabs.find(tab => currentRouteName === tab.routeName);
    return foundTab ? foundTab.name : 'Profile';
});

// // Watch the store's currentUser to pre-fill if it loads after the component mounts
// watch(currentUser, (user) => {
//     if (user && !form.data.first_name) { // Only populate if form is empty
//         const profile = (user as any).profile;
//         if (profile) {
//             fetchProfileData(); // Re-fetch for consistency
//         }
//     }
// }, { immediate: true });
</script>

<template>
  <div class="container mx-auto p-4 space-y-8">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <RouterLink v-for="tab in tabs" :key="tab.name" :to="{ name: tab.routeName }"
          :class="[
            activeTab === tab.name
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]">
          {{ tab.name }}
        </RouterLink>
      </nav>
    </div>
    <!-- Profile Header with Avatar Uploader -->
    <!-- <div
    class="relative rounded-2xl p-6 mb-8 overflow-hidden backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-30"></div>
      <div class="flex flex-col sm:flex-row items-center gap-6 ">
        <AvatarUploader upload-url="/user/account/profile/avatar/update" />
        <div class="text-center sm:text-left">
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent capitalize">
            {{ currentUser?.username || 'User Profile' }}
          </h2>
          <p class="text-secondary text-slate-600 dark:text-slate-400">
            {{ currentUser?.email }}
          </p>
        </div>
      </div>
    </div> -->

    <div>
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>