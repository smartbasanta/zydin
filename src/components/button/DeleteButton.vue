<script setup lang="ts">
    import { Trash2Icon, Loader2Icon } from "lucide-vue-next";
    import { ref, onMounted, onBeforeUnmount } from "vue";

    const props = defineProps({
        loading: Boolean,
        disabled: Boolean,
    });

    const emit = defineEmits(["confirm"]);

    const showConfirm = ref(false);
    const buttonRef = ref<HTMLElement | null>(null);
    const popoverRef = ref<HTMLElement | null>(null);

    function openConfirm() {
        if (!props.loading && !props.disabled) {
            showConfirm.value = true;
        }
    }
    function confirmDelete() {
        showConfirm.value = false;
        emit("confirm");
    }
    function cancelDelete() {
        showConfirm.value = false;
    }

    function handleClickOutside(e: MouseEvent) {
        if (
            showConfirm.value &&
            !buttonRef.value?.contains(e.target as Node) &&
            !popoverRef.value?.contains(e.target as Node)
        ) {
            showConfirm.value = false;
        }
    }

    onMounted(() => {
        document.addEventListener("mousedown", handleClickOutside);
    });
    onBeforeUnmount(() => {
        document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

<template>
	<div class="relative inline-block">
		<button
            type="button"
			ref="buttonRef"
			@click="openConfirm"
			:disabled="loading || disabled"
			class="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md shadow-xl dark:shadow-gray-900/50 text-red-600 dark:text-red-400 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03] cursor-pointer"
		>
			<span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-300/10 via-red-400/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
		    <span class="absolute inset-0 rounded-2xl border border-white/30 dark:border-white/10 group-hover:border-red-400/40 transition-colors duration-300 z-10"></span>

			<component
				:is="loading ? Loader2Icon : Trash2Icon"
				class="w-5 h-5 relative z-10"
				:class="{ 'animate-spin': loading }"
			/>
			<span class="relative z-10">
				{{ loading ? "Deleting..." : "Delete" }}
			</span>
		</button>

		<!-- Confirm Popover -->
		<transition name="fade">
			<div
				v-if="showConfirm"
				ref="popoverRef"
				class="absolute right-0 mt-2 z-50 w-64"
			>
                <div class="relative space-y-3 bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-4 text-center">
                    <span class="absolute inset-0 h-full rounded-2xl bg-gradient-to-br from-red-300/10 via-red-400/10 to-rose-500/10 opacity-100 transition-opacity duration-300 blur-sm -z-10"></span>
		            <span class="absolute inset-0 h-full rounded-2xl border-2 dark:border-white/10 border-red-400/40 transition-colors duration-300 -z-10"></span>
                    <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        Are you sure you want to delete?
                    </p>
                    <div class="flex justify-center gap-3">
                        <button
                            type="button"
                            @click="confirmDelete"
                            class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
						    Yes
					    </button>
                        <button
                            type="button"
                            @click="cancelDelete"
                            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>

