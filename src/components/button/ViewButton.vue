<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { EyeIcon } from 'lucide-vue-next';

    const props = defineProps({
        to: {
            type: [String, Object],
            required: true,
        },
        // Toggle to show icon only
        iconOnly: {
            type: Boolean,
            default: false,
        },
        // Custom label text
        label: {
            type: String,
            default: "View",
        }
    });
</script>

<template>
    <RouterLink
        :to="to"
        class="group relative inline-flex items-center justify-center rounded-2xl bg-white/60 dark:bg-white/5 border border-blue-200/60 dark:border-blue-900/60 backdrop-blur-md shadow-xl text-blue-600 dark:text-blue-400 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03]"
        :class="[ 
            iconOnly ? 'p-3' : 'px-5 py-3 gap-2' 
        ]"
        :title="iconOnly ? label : undefined"
    >
        <!-- Background Effects (Blue Theme) -->
        <span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-cyan-400/10 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        
        <!-- Icon -->
        <EyeIcon class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:scale-110" />
        
        <!-- Text Label (Conditional) -->
        <span v-if="!iconOnly" class="relative z-20">{{ label }}</span>
    </RouterLink>
</template>