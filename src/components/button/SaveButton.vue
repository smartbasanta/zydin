<script setup lang="ts">
    import { CheckIcon, LoaderCircleIcon } from "lucide-vue-next";

    withDefaults(defineProps<{
        isLoading?: boolean;
        isDirty?: boolean;
    }>(), {
        isLoading: false,
        isDirty: false
    })
</script>

<template>
	<button
        type="submit"
        :disabled="isLoading || !isDirty"
		class="btn btn-success py-3 hover:scale-[1.03] group relative"
	>
        <LoaderCircleIcon
            v-if="isLoading"
            class="w-5 h-5 animate-spin mr-2"
        />
		<CheckIcon v-else class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
		<span class="relative z-20">
            <slot />
        </span>
	</button>
</template>
