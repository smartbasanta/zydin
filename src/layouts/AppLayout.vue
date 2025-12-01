<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AppFooter from '@/components/navigation/footer/AppFooter.vue';
import AppHeader from '@/components/navigation/header/AppHeader.vue';
import AnimatedText from '@/components/logo/AnimatedText.vue';
</script>

<template>
  <!-- <AnimatedText
    text="Zydin Biotech"
    :repeat="true"
    animation-type="scatter"
    font-size="2.5rem"
    font-weight="bold"
    text-color="var(--color-gray-900)"
    dark-text-color="var(--color-gray-50)"
    :char-animation-delay="50"
    :word-animation-delay="300"
  /> -->
  <div class="min-h-screen">
      <AppHeader />

      <main class="flex-grow">
        <RouterView />
      </main>
      
      <AppFooter />
  </div>
</template>
