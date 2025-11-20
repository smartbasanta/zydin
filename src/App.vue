<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import NotificationPanel from '@/components/notifications/NotificationPanel.vue';
import NotificationQContainer from '@/components/notifications/NotificationQContainer.vue';
import { useSystemNotificationStore } from '@/stores/systemNotification.store';
import { useAuthStore } from './stores/auth.store';
import { storeToRefs } from 'pinia';
import AppLogo from '@/components/logo/AppLogo.vue';
import AnimatedText from './components/logo/AnimatedText.vue';
import AppLogoAnimation from './components/logo/AppLogoAnimation.vue';
import AppLogoInteraction from './components/logo/AppLogoInteraction.vue';

const authStore = useAuthStore();
const route = useRoute();
const notificationStore = useSystemNotificationStore();
const cleanupTheme = inject<() => void>('cleanupTheme');

const { isAuthReady } = storeToRefs(authStore);

// 2. Watch for route name changes to fetch only route-specific notifications
watch(
    () => route.name,
    (newRouteName) => {
        if (newRouteName) {
            notificationStore.fetchRouteNotifications(newRouteName.toString());
        } else {
            // Optional: Clear route-specific notifications if we go to a route without a name
            notificationStore.routeNotifications = [];
        }
    },
    { immediate: true } // This will still trigger for the initial route
);
watch(
    () => isAuthReady,
    (isReady) => {
        // As soon as isAuthReady becomes true, fetch the notifications.
        if (isReady) {
            notificationStore.fetchGlobalNotifications();
        }
    },
    { immediate: true } // 'immediate' checks the value as soon as the watcher is created.
);
onUnmounted(() => {
    if (cleanupTheme) {
        cleanupTheme();
    }
});
</script>

<template>
<AnimatedText
    text="Zydin Biotech"
    :repeat="true"
    animation-type="scatter"
    font-size="2.5rem"
    font-weight="bold"
    text-color="#333"
    dark-text-color="#f0f0f0"
    :char-animation-delay="50"
    :word-animation-delay="300"
  />    
  <div class="fixed w-full h-full opacity-20" >

    <AppLogoInteraction 
        :glow="true" 
      interaction-type="repel"
      :friction="0.82"
      :ambient-speed="0.005"
      :mouse-interaction-radius="320"
      :mouse-repel-strength="10" 
    />
  </div>    
    <RouterView />
    <Teleport to="body">
        <NotificationPanel />
        <NotificationQContainer />
    </Teleport>
</template>