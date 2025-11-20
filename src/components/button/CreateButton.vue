<script setup lang="ts">
    import { PlusCircleIcon } from "lucide-vue-next";

    const props = defineProps({
    to: {
        type: [String, Object],
        required: true,
    },
    });
</script>

<template>
  <router-link
    :to="to"
    class="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-gray-800 dark:text-gray-200 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03]"
  >
    <span
      class="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-300/20 via-green-400/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"
    ></span>
    <span
      class="absolute inset-0 rounded-2xl border border-white/30 dark:border-white/10 group-hover:border-green-500/60 transition-colors duration-300 z-10"
    ></span>
    <PlusCircleIcon
      class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:rotate-[10deg] group-hover:scale-110 text-green-600 dark:text-green-400"
    />
    <span class="relative z-20">Create</span>
  </router-link>
</template>
