<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useRegisterForm } from '@/composables/form/auth/useRegisterForm';
import type { RegisterCredentials } from '@/types/auth';

import AuthCard from '@/components/auth/AuthCard.vue';
import AuthHeader from '@/components/auth/AuthHeader.vue';
import TextInput from '@/components/form/TextInput.vue';
import PasswordInput from '@/components/form/PasswordInput.vue';
import InputError from '@/components/form/InputError.vue';
import { LoaderCircle } from 'lucide-vue-next';

const { isLoading, error, register, clearError } = useRegisterForm();
const getInitialFormState = (): RegisterCredentials => ({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    used_referral_code: '',
    terms_accepted: false,
    remember: false,
});

const form = ref<RegisterCredentials>(getInitialFormState());


const handleRegister = async () => {
    try {
        const success = await register(form.value);
        if (success) {
            form.value = getInitialFormState();
        }
    } catch (error) {
        // console.error("Registration failed in component:", error);
        // TODO :: You could add a toast notification here if you wanted.
    }
};

// A helper computed to easily get errors for specific fields
const getError = (field: keyof RegisterCredentials) => computed(
    () => error.value?.errors?.[field]?.[0]
);

onUnmounted(() => {
    clearError();
});
</script>

<template>
    <div class="flex items-center justify-center mt-8 bg-primary-50 dark:bg-gray-1100">
        <div
            class="w-full max-w-2xl p-8 space-y-8 bg-white border rounded-3xl shadow-xl sm:p-10 border-primary-100 dark:bg-gray-1150 dark:border-gray-1000">
            <AuthHeader title="Create Your Account"
                description="Join our community of healthcare professionals and innovators." />

            <form @submit.prevent="handleRegister" class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Username -->
                <div class="md:col-span-1">
                    <TextInput v-model="form.username" autocomplete="username" id="username" label="Username" placeholder="e.g., drsharma"
                        :error="getError('username').value" required />
                </div>

                <!-- Email Address -->
                <div class="md:col-span-1">
                    <TextInput v-model="form.email" type="email" id="email" label="Email Address"
                        placeholder="you@example.com" :error="getError('email').value" required />
                </div>

                <!-- Password -->
                <div class="md:col-span-1">
                    <PasswordInput v-model="form.password" id="password" label="Password" autocomplete="new-password"
                        placeholder="Create a strong password" :error="getError('password').value" required />
                </div>

                <!-- Confirm Password -->
                <div class="md:col-span-1">
                    <PasswordInput v-model="form.password_confirmation" autocomplete="new-password" id="password_confirmation"
                        label="Confirm Password" placeholder="Retype your password" required />
                </div>

                <!-- Referral Code (Full Width) -->
                <div class="md:col-span-2">
                    <TextInput v-model="form.used_referral_code" id="used_referral_code"
                        label="Referral Code (Optional)" placeholder="Enter referral code if you have one"
                        :error="getError('used_referral_code').value" />
                </div>

                <!-- Checkboxes (Full Width) -->
                <div class="space-y-4 md:col-span-2">
                    <label for="terms_accepted" class="flex items-start space-x-3 cursor-pointer group">
                        <input type="checkbox" v-model="form.terms_accepted" id="terms_accepted"
                            class="mt-1 checkbox primary" />
                        <span class="text-sm text-gray-700 dark:text-primary-300">
                            I agree to the
                            <a href="#"
                                class="font-semibold transition-colors link group-hover:text-secondary-500">Terms of
                                Service</a> and
                            <a href="#"
                                class="font-semibold transition-colors link group-hover:text-secondary-500">Privacy
                                Policy</a>.
                        </span>
                    </label>
                    <InputError :error="getError('terms_accepted').value" class="-mt-2" />

                    <label for="remember" class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" v-model="form.remember" id="remember" class="checkbox primary" />
                        <span class="text-sm text-gray-700 dark:text-primary-300">Keep me logged in on this
                            device</span>
                    </label>
                </div>

                <!-- Submit Button (Full Width) -->
                <div class="md:col-span-2">
                    <button type="submit" class="w-full btn btn-primary" :disabled="isLoading">
                        <LoaderCircle v-if="isLoading" class="size-5 animate-spin" />
                        <span v-else>Create Account</span>
                    </button>
                </div>
            </form>

            <p class="text-sm text-center text-gray-600 dark:text-primary-400">
                Already have an account?
                <router-link :to="{ name: 'login' }"
                    class="font-semibold transition-colors link hover:text-secondary-500">
                    Sign in here
                </router-link>
            </p>
        </div>
    </div>
</template>