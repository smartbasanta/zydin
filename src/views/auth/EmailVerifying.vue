<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth.store';
    import { apiService } from '@/services/api.service';
    
    import { LoaderCircle, CheckCircle2, ShieldAlert } from 'lucide-vue-next';

    type VerificationStatus = 'verifying' | 'success' | 'error';

    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    const status = ref<VerificationStatus>('verifying');
    const errorMessage = ref<string | null>(null);

    const verifyEmail = async () => {
        // Construct the full verification URL from the route path and query
        const verificationUrl = route.fullPath;
        
        // The URL from Laravel looks like /verify-email/1/somehash?expires=...&signature=...
        // We just need to pass this full path (starting from /verify-email) to our API.
        
        if (!verificationUrl.includes('/verify-email/')) {
            status.value = 'error';
            errorMessage.value = 'Invalid verification link. Please request a new one.';
            return;
        }

        try {
            await apiService.get(verificationUrl);
            status.value = 'success';
            
            // Re-fetch the user data to update their `email_verified_at` status in the store
            if (authStore.isAuthenticated) {
                await authStore.fetchUser();
            }

            // Redirect to the dashboard after a short delay
            setTimeout(() => {
                router.push({ name: 'dashboard' });
            }, 3000);

        } catch (error: any) {
            status.value = 'error';
            errorMessage.value = error.message || 'Verification failed. The link may be expired or invalid.';
        }
    };

    onMounted(() => {
        verifyEmail();
    });
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-1200 p-4">
        <div class="w-full max-w-md mx-auto text-center">
        
            <!-- Verifying State -->
            <div v-if="status === 'verifying'" class="space-y-6">
                <div class="relative w-24 h-24 mx-auto">
                    <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                    <div class="relative grid place-content-center w-full h-full bg-white dark:bg-gray-1100 rounded-full shadow-lg">
                        <LoaderCircle class="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                </div>
                <h2 class="text-3xl font-bold font-grotesk text-gray-900 dark:text-gray-50">Verifying Your Email</h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Please wait a moment while we confirm your identity. This shouldn't take long.
                </p>
            </div>

            <!-- Success State -->
            <div v-if="status === 'success'" class="space-y-6">
                <div class="relative w-24 h-24 mx-auto">
                     <div class="relative grid place-content-center w-full h-full bg-green-500/10 dark:bg-green-500/20 rounded-full shadow-lg">
                        <CheckCircle2 class="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <h2 class="text-3xl font-bold font-grotesk text-gray-900 dark:text-gray-50">Verification Complete!</h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Your email has been successfully verified. You will be redirected to your dashboard shortly.
                </p>
            </div>

            <!-- Error State -->
            <div v-if="status === 'error'" class="space-y-6">
                 <div class="relative w-24 h-24 mx-auto">
                     <div class="relative grid place-content-center w-full h-full bg-red-500/10 dark:bg-red-500/20 rounded-full shadow-lg">
                        <ShieldAlert class="w-12 h-12 text-red-500" />
                    </div>
                </div>
                <h2 class="text-3xl font-bold font-grotesk text-gray-900 dark:text-gray-50">Verification Failed</h2>
                <p class="text-gray-500 dark:text-gray-400">
                    {{ errorMessage }}
                </p>
                <div class="pt-4">
                    <button @click="router.push({ name: 'home' })" class="btn btn-primary">
                        Back to Homepage
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>