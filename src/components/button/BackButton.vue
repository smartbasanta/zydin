<script setup lang="ts">
    import { ArrowLeftIcon } from "lucide-vue-next";
    import { useRouter } from "vue-router";

    const router = useRouter();
    
    const props = defineProps({
        to: {
            type: [String, Object],
            default: null,
        },
        iconOnly: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "Back",
        }
    });

    function goBack() {
        if (props.to) {
            router.push(props.to);
        } else {
            router.back();
        }
    }
</script>

<template>
    <button
        type="button"
        @click="goBack"
        class="group relative inline-flex items-center justify-center rounded-2xl section-bg border backdrop-blur-md shadow-xl section-title font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03] cursor-pointer"
        :class="[ 
            iconOnly ? 'p-3' : 'px-5 py-3 gap-2' 
        ]"
        :title="iconOnly ? label : undefined"
    >
        <!-- Background Effects (Neutral/Slate Theme) -->
        <span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-200/10 via-slate-200/10 to-zinc-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
        <span class="absolute inset-0 rounded-2xl border border-white/30 dark:border-white/10 group-hover:border-gray-400/40 transition-colors duration-300 z-10"></span>
        
        <!-- Icon (Slides left on hover) -->
        <ArrowLeftIcon class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:-translate-x-1" />
        
        <!-- Text Label (Conditional) -->
        <span v-if="!iconOnly" class="relative z-20">{{ label }}</span>
    </button>
</template>