<script setup lang="ts">
    import { ref, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth.store';
    import AuthCard from '@/components/auth/AuthCard.vue';
    import AuthHeader from '@/components/auth/AuthHeader.vue';
    import TextInput from '@/components/form/TextInput.vue';
    import PasswordInput from '@/components/form/PasswordInput.vue';
    import InputError from '@/components/form/InputError.vue';
    import { LoaderCircle } from 'lucide-vue-next';

    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref({
        email: 'super.admin@zydinbiotech.com',
        password: '090078601',
    });

    const handleLogin = async () => {
        try {
            await authStore.login(form.value);
            // 1. Get the URL we stored earlier.
        const redirectPath = authStore.returnUrl;

        // 2. Clear it from the store to prevent accidental future redirects.
        authStore.setReturnUrl(null);

        // 3. Redirect the user.
        if (redirectPath) {
            // If we have a stored path, go there.
            router.push(redirectPath);
        } else {
            // Otherwise, go to the default dashboard.
            router.push({ name: 'dashboard.index' });
        }

        } catch (error) {
            // console.error("Login failed in component:", error);
        }
    };

    // Clear any previous auth errors when the component is unmounted
    onUnmounted(() => {
        authStore.clearError();
    });
</script>

<template>
    <div class="py-12 group">
        <AuthCard>
            <AuthHeader 
                title="Welcome Back, to Zydin Biotech!" 
                description="Sign in to continue your epic journey." 
            />

            <!-- Generic Error Message -->
            <!-- <div v-if="authStore.error && authStore.error.message && !authStore.error.errors" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                {{ authStore.error.errors }}
            </div> -->
            
            <form @submit.prevent="handleLogin" class="space-y-6">
                <TextInput 
                    v-model="form.email" 
                    id="email" 
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="username or you@example.com"
                    :error="authStore.error?.errors?.email"
                    autocomplete="email"
                    required
                    autofocus
                />

                <PasswordInput 
                    v-model="form.password" 
                    id="password" 
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    :error="authStore.error?.errors?.password" 
                    autocomplete="current-password"
                    required
                />

                <div class="flex items-center justify-between">
                    <label for="remember" class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" id="remember" name="remember" class="checkbox" />
                        <span class="text-sm section-description">Remember me</span>
                    </label>

                    <router-link :to="{ name: 'forgot-password' }" class="text-sm link section-description">
                        Forgot your password?
                    </router-link>
                </div>          

                <button type="submit" class="btn btn-primary w-full" :disabled="authStore.isLoading">
                    <LoaderCircle v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
                    <span v-else>Sign In</span>
                </button>
            </form>
            
            <p class="mt-8 text-center text-sm section-description">
                Don't have an account?
                <router-link :to="{ name: 'register' }" class="link">
                    Sign up
                </router-link>
            </p>
        </AuthCard>
    </div>
</template>