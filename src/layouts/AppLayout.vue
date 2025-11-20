<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AppFooter from '@/components/navigation/footer/AppFooter.vue';
import AppHeader from '@/components/navigation/header/AppHeader.vue';
import { Home, Search, Heart, User, Settings } from 'lucide-vue-next'

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Favorites', path: '/favorites', icon: Heart },
  { name: 'Profile', path: '/me', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings }
]
</script>

<template>    
  <div class="min-h-screen">
    <div class="fixed inset-0 z-100 pointer-events-none">
      <!-- <div class="blob-1 absolute top-[5%] left-[10%] w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div class="blob-2 absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div> -->
    </div>

      <AppHeader />

      <main class="flex-grow">
        <RouterView />
      </main>
      
      <AppFooter />
  </div>
  <!-- <div class="min-h-screen">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div :style="blob1Style" class="absolute -top-4 -left-4 w-32 h-32 bg-cyan-700/70 dark:bg-cyan-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div :style="blob2Style" class="absolute top-1/4 right-8 w-40 h-40 bg-purple-600/60 dark:bg-purple-500/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    <AppHeader />

    <main class="">
      <RouterView />
    </main>
    
    <AppFooter />
  </div> -->
</template>


<style scoped>
/*
  We define a multi-step animation for each blob.
  Using `transform: translate()` is highly performant.
  The different paths and scales give a more organic, random feel.
*/
@keyframes moveBlob1 {
  0%   { transform: scale(1)   translate(0, 0); }
  20%  { transform: scale(1.1) translate(10vw, -20vh); }
  40%  { transform: scale(0.9) translate(30vw, 15vh); }
  60%  { transform: scale(1.2) translate(-20vw, -10vh); }
  80%  { transform: scale(1)   translate(-10vw, 30vh); }
  100% { transform: scale(1)   translate(0, 0); }
}

@keyframes moveBlob2 {
  0%   { transform: scale(1)   translate(0, 0); }
  25%  { transform: scale(0.8) translate(-25vw, 10vh); }
  50%  { transform: scale(1.1) translate(15vw, 20vh); }
  75%  { transform: scale(0.9) translate(5vw, -30vh); }
  100% { transform: scale(1)   translate(0, 0); }
}

/*
  Apply the animations to our blob classes.
  - `40s` and `35s`: Different long durations make the movements feel natural and desynchronized.
  - `infinite`: The animation loops forever.
  - `alternate`: The animation plays forwards, then backwards, creating a seamless loop.
*/
.blob-1 {
  animation: moveBlob1 40s infinite alternate;
}

.blob-2 {
  animation: moveBlob2 35s infinite alternate;
}
</style>
