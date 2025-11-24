<script setup lang="ts">
    import { Edit3Icon } from "lucide-vue-next";

    const props = defineProps({
        to: {
            type: [String, Object],
            required: true,
        },
        iconOnly: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "Edit",
        }
    });
</script>

<template>
    <router-link
        :to="to"
        class="group relative inline-flex items-center justify-center rounded-2xl bg-white/60 dark:bg-white/5 border border-green-200/60 dark:border-green-900/60 backdrop-blur-md shadow-xl text-green-600 dark:text-green-400 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03]"
        :class="[ 
            iconOnly ? 'p-3' : 'px-5 py-3 gap-2' 
        ]"
        :title="iconOnly ? label : undefined"
    >
        <!-- Background Effects (Green/Emerald Theme) -->
        <span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/10 via-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        
        <!-- Icon -->
        <Edit3Icon class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        
        <!-- Text Label (Conditional) -->
        <span v-if="!iconOnly" class="relative z-20">{{ label }}</span>
    </router-link>
</template>