<script setup lang="ts">
    import { ref, onMounted, onUnmounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { usePasswordResetForm } from '@/composables/form/auth/usePasswordResetForm';

    import { useAuthStore } from '@/stores/auth.store';
    import AuthCard from '@/components/auth/AuthCard.vue';
    import AuthHeader from '@/components/auth/AuthHeader.vue';
    import TextInput from '@/components/form/TextInput.vue';
    import PasswordInput from '@/components/form/PasswordInput.vue';
    import { LoaderCircle } from 'lucide-vue-next';
import type { ResetPasswordData } from '@/types/auth';

    const props = defineProps<{
        token: string;
        email: string;
    }>();

    const router = useRouter();
    const { isLoading, error, statusMessage, resetPassword, clearError } = usePasswordResetForm();

    const form = ref<ResetPasswordData>({
        token: props.token || '',
        email: props.email || '',
        password: '',
        password_confirmation: ''
    });

    const handleResetPassword = async () => {
        try {
            await resetPassword(form.value);
        } catch (err) {}
    };
    
    onMounted(() => {
      if (!props.token || !props.email) {
        router.replace({ name: 'forgot-password' });
      }
    });

    onUnmounted(() => {
        clearError();
    });

    const getError = (field: keyof ResetPasswordData) => computed (() => error.value?.errors?.[field]?.[0]);
</script>

<template>
    <div class="py-12">
        <AuthCard>
            <AuthHeader 
                title="Set a New Password" 
                description="Create a new, strong password for your account." 
            />
            
            <!-- Success Message -->
            <div v-if="statusMessage" class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm" role="alert">
                {{ statusMessage }} Redirecting to login...
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-6">
                 <TextInput 
                    v-model="form.email" 
                    id="email" 
                    name="email"
                    type="email"
                    label="Email Address"
                    :error="getError('email').value"
                    autocomplete="email"
                    required
                    disabled
                />
                
                <PasswordInput 
                    v-model="form.password" 
                    id="password" 
                    name="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    :error="getError('password').value" 
                    autocomplete="new-password"
                    required
                    autofocus
                />

                <PasswordInput 
                    v-model="form.password_confirmation" 
                    id="password_confirmation" 
                    name="password_confirmation"
                    label="Confirm New Password"
                    placeholder="Retype your new password"
                    required
                />

                <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" :disabled="isLoading">
                    <LoaderCircle v-if="isLoading" class="w-5 h-5 animate-spin" />
                    <span v-else>Reset Password</span>
                </button>
            </form>
        </AuthCard>
    </div>
</template>