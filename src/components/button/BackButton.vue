<script setup lang="ts">
    import { ArrowLeftIcon } from "lucide-vue-next";
    import { useRouter } from "vue-router";

    const router = useRouter();
    const props = defineProps({
        to: {
            type: [String, Object],
            default: null,
        },

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
		class="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-gray-800 dark:text-gray-200 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03] cursor-pointer"
	>
		<span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-200/10 via-purple-200/10 to-pink-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
		<span class="absolute inset-0 rounded-2xl border border-white/30 dark:border-white/10 group-hover:border-blue-400/40 transition-colors duration-300 z-10"></span>
		<ArrowLeftIcon class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:-translate-x-1 group-hover:rotate-[5deg]" />
		<span class="relative z-20">
            <slot>
                Back
            </slot>
        </span>
	</button>
</template>
