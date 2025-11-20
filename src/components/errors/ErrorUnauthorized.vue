<script setup lang="ts">
    import { useAuthStore } from "@/stores/auth.store";
    import { HomeIcon, RefreshCcw, ShieldOffIcon } from "lucide-vue-next";

    defineEmits<{
        (e: "retry"): void;
    }>();

    withDefaults(defineProps<{
        canRetry: boolean;
    }>(), {
        canRetry: true
    });

    const authStore = useAuthStore();

    const handleLogout = async () => {
        await authStore.logout();
    };
</script>

<template>
	<div class="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] bg-gradient-to-b from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 p-6 border-2 border-rose-400/60 dark:border-red-600/40 shadow-lg shadow-rose-300/30 dark:shadow-red-900/30 backdrop-blur-sm transition-all duration-300">
		<div class="max-w-md w-full bg-black/20 rounded-2xl shadow-xl border-2 border-black/20 p-8 text-center">
			<div class="mb-6">
				<ShieldOffIcon class="size-12 mx-auto mb-4 text-red-600 dark:text-rose-400 animate-glitch" />
			
				<h1 class="text-2xl font-bold text-red-500 mb-2">
					Access Denied
				</h1>

				<p class="text-red-300 leading-relaxed">
					You don't have the necessary
					permissions to access this resource. Please contact your
					administrator if you think this is a mistake.
				</p>
			</div>

			<div class="space-y-3">
				
				<RouterLink :to="{ name: 'dashboard.index' }" class="cursor-pointer w-full bg-black/25 hover:bg-black/35 text-red-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
					<HomeIcon class="w-4 h-4" />
					Go to Dashboard
				</RouterLink>

                <button @click="$emit('retry')" class="cursor-pointer w-full bg-black/15 hover:bg-black/20 text-red-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" :disabled="!canRetry">
					<RefreshCcw class="w-4 h-4" />
					Try Again
				</button>

				<button
					@click="handleLogout"
					class="cursor-pointer w-full text-red-500 hover:text-red-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
				>
					Sign Out
				</button>
			</div>

			<div class="mt-6 pt-6 border-t border-red-900">
				<p class="text-xs text-red-400">
					Need help? Contact support at
					<a
						href="mailto:support@example.com"
						class="text-red-300 hover:underline"
					>
						support@zydinBiotech.com
					</a>
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
    .animate-glitch {
        animation: glitch 1.5s infinite;
    }

    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(-1px, 1px); }
        80% { transform: translate(1px, -1px); }
        100% { transform: translate(0); }
    }
</style>
