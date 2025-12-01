<script setup lang="ts">
    import { ArrowLeftIcon, XIcon } from "lucide-vue-next";
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
		class="btn btn-secondary py-3 hover:scale-[1.03] group relative border"
	>
		<span class="absolute inset-0 rounded bg-gradient-to-br from-blue-200/10 via-purple-200/10 to-pink-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
		<span class="absolute inset-0 rounded border border-white/30 dark:border-white/10 group-hover:border-blue-400/40 transition-colors duration-300 z-10"></span>
		<XIcon class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:-translate-x-1 group-hover:rotate-[5deg]" />
		<span class="relative z-20">
            <slot />
        </span>
	</button>
</template>
