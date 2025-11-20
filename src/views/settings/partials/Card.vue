<script setup lang="ts">
interface cardProps {
  type?:string,
  title:string,
  description:string
}
const props = defineProps<cardProps>();
// const props = defineProps<cardProps>();
</script>

<template>
  <div class="group block cursor-pointer rounded-xl bg-white p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-sky-500/70 dark:hover:border-sky-600/70 dark:bg-gray-1050 border-2 border-gray-200 dark:border-gray-900">
    <div class="flex items-center gap-4">
      <slot />
      <div class="block text-start">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        <!-- Maintain Database and cache -->
         {{ props.title }}
      </h3>
      <!-- <div class="mt-4 flex rounded-full bg-sky-100 p-4 transition-colors group-hover:bg-sky-200 dark:bg-sky-900/40 dark:group-hover:bg-sky-900/60"> -->
      <!-- </div> -->
      <p class="mt-1 text-md text-gray-500 dark:text-gray-400">
        <!-- Create, View, Download or Delete Database backups / cache. -->
        {{ props.description }}
      </p>
      </div>
    </div>
  </div>
</template>