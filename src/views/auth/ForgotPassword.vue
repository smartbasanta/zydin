<script setup lang="ts">
    import { ref, onUnmounted, computed } from 'vue';
    import { useForgotPasswordForm } from '@/composables/form/auth/useForgotPasswordForm';

    import AuthCard from '@/components/auth/AuthCard.vue';
    import AuthHeader from '@/components/auth/AuthHeader.vue';
    import TextInput from '@/components/form/TextInput.vue';
    import { LoaderCircle } from 'lucide-vue-next';

    const { isLoading, error, statusMessage, sendResetLink, clearError } = useForgotPasswordForm();

    const email = ref('');

    const handleSendLink = async () => {
        try {
            await sendResetLink({ email: email.value });
        } catch (err) {}
    };

    const emailError = computed(() => error.value?.errors?.email?.[0]);

    onUnmounted(() => {
        clearError();
    });
</script>

<template>
    <div class="py-12">
        <AuthCard>
            <AuthHeader 
                title="Forgot Your Password?" 
                description="No problem. Enter your email and we'll send you a password reset link." 
            />

            <!-- Success Message -->
            <div v-if="statusMessage" class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm" role="alert">
                {{ statusMessage }}
            </div>

            <form @submit.prevent="handleSendLink" class="space-y-6">
                <TextInput 
                    v-model="email" 
                    id="email" 
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    :error="emailError"
                    autocomplete="email"
                    required
                    autofocus
                />

                <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
                    <LoaderCircle v-if="isLoading" class="w-5 h-5 animate-spin" />
                    <span v-else>Email Password Reset Link</span>
                </button>
            </form>

            <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                Remembered your password?
                <router-link :to="{ name: 'login' }" class="link">
                    Sign in
                </router-link>
            </p>
        </AuthCard>
    </div>
</template>