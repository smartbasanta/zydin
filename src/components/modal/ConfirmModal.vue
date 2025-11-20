<script setup lang="ts">
    import { useConfirmModal } from "@/composables/useConfirmModal";
    import { inject, onMounted } from "vue";

    const { state, confirm, cancel } = useConfirmModal();
    const refreshData = inject<() => void>("refreshData");

    const getConfirmMessage = () => {
        return state.value.itemName
            ? `Are you sure you want to delete "${state.value.itemName}"?`
            : state.value.confirmMessage;
    };
</script>

<template>
	<transition name="fade">
		<div
			v-if="state.isVisible"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
			@click.self="cancel"
			@keydown.esc="cancel"
			tabindex="0"
		>
			<div
				class="relative w-full max-w-sm p-6 rounded-2xl bg-white/85 dark:bg-white/10 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl dark:shadow-black/60 transition-transform duration-300 scale-100"
			>
				<!-- Gradient glow -->
				<span
					class="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-200/20 via-red-300/20 to-red-400/20 opacity-40 blur-md z-0"
				></span>
				<!-- Outer border -->
				<span
					class="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10 z-10"
				></span>

				<!-- Modal Content -->
				<div class="relative z-20 space-y-4">
					<h3
						class="text-xl font-semibold text-gray-900 dark:text-gray-100 font-poppins"
					>
						Confirm Deletion
					</h3>
					<p
						class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
					>
						{{ getConfirmMessage() }}
					</p>

					<div class="flex justify-end gap-3 pt-2">
						<!-- Cancel Button -->
						<button
							@click="cancel"
							class="group relative inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-105 cursor-pointer"
						>
							<span
								class="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-300/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"
							/>
							<span
								class="absolute inset-0 rounded-xl border border-white/30 dark:border-white/10 group-hover:border-gray-400/40 transition-colors duration-300 z-10"
							/>
							<span class="relative z-20">Cancel</span>
						</button>

						<!-- Confirm Button -->
						<button
							@click="confirm(refreshData)"
							class="group relative inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 text-red-700 dark:text-red-400 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-105 cursor-pointer"
						>
							<span
								class="absolute inset-0 rounded-xl bg-gradient-to-br from-red-300/20 via-red-400/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"
							/>
							<span
								class="absolute inset-0 rounded-xl border border-white/30 dark:border-white/10 group-hover:border-red-400/40 transition-colors duration-300 z-10"
							/>
							<span class="relative z-20">Confirm</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.25s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
