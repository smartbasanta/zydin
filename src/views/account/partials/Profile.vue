<script setup lang="ts">
import { reactive, computed, watch, onMounted, ref } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';
import { useNotifier } from '@/composables/useNotifier';
import { apiService } from '@/services/api.service';
import type { ApiError, ApiResponse } from '@/types/api';
import type { Profile } from '@/types/auth';
import AvatarUploader from './AvatarUploader.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';

import AuthHeader from '@/components/auth/AuthHeader.vue';
import TextInput from '@/components/form/TextInput.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import TextareaInput from '@/components/form/TextareaInput.vue';
// --- Composables and Stores ---

const { notify } = useNotifier('bottom-right');

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

// --- Component State ---
const countries = ref<Record<string, string>>({});
const isLoading = ref(true);

const form = reactive({
  data: {
    first_name: '',
    last_name: '',
    gender: '',
    mobile_number: '',
    date_of_birth: '',
    bio: '',
    timezone: '', // You might want to auto-detect or provide a list
    language_preference: 'en', // Default value
  },
  errors: {} as Record<string, [string]>,
  isSubmitting: false,
});

// --- Data Fetching ---
const fetchProfileData = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.get<ApiResponse<{profile:Profile}>>('/user/account/profile/edit');
    const profileData = response.data.profile;
    // countries.value = response.country;
    // Populate form with fetched data
    form.data.first_name = profileData.first_name || '';
    form.data.last_name = profileData.last_name || '';
    form.data.gender = profileData.gender || '';
    form.data.mobile_number = profileData.mobile_number || '';
    form.data.date_of_birth = profileData.date_of_birth ? profileData.date_of_birth.split('T')[0] : '';
    form.data.bio = profileData.bio || '';
    form.data.timezone = profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    form.data.language_preference = profileData.language_preference || 'en';

  } catch (error) {
    const apiError = error as ApiError;
    notify(apiError); // Show error notification from API
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfileData);


// --- Form Submission ---
const submit = async () => {
  form.isSubmitting = true;
  form.errors = {};

  try {
    // console.log(form.data.timezone +" is a type of "+typeof(form.data.timezone));
    const response = await apiService.put<ApiResponse<Profile>>('/user/account/profile/update', form.data);
    notify(response); // Show success notification from API
  } catch (error) {
    const apiError = error as ApiError;
    form.errors = apiError.errors || {};
    notify(apiError); // Show error notification with details
  } finally {
    form.isSubmitting = false;
  }
};

// --- Computed Properties & Watchers ---
const genderOptions = { male: 'Male', female: 'Female', other: 'Other' };
const formattedDate = computed({
  get: () => form.data.date_of_birth,
  set: (newValue: string) => { form.data.date_of_birth = newValue; }
});
</script>

<template>
  <!-- Profile Header with Avatar Uploader -->
    <div
    class="relative rounded-2xl p-6 mb-8 overflow-hidden backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-30"></div>
      <div class="flex flex-col sm:flex-row items-center gap-6 ">
        <AvatarUploader upload-url="/user/account/profile/avatar/update" />
        <div class="text-center sm:text-left">
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent capitalize">
            {{ currentUser?.username || 'User Profile' }}
          </h2>
          <p class="text-secondary text-slate-600 dark:text-slate-400">
            {{ currentUser?.email }}
          </p>
        </div>
      </div>
    </div>

  <!-- Profile Edit Form -->
  <div class="space-y-6">
    <div
      class="relative rounded-2xl p-6 overflow-hidden backdrop-blur-lg bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div>

      <AuthHeader title="Edit Profile" description="Keep your personal information up to date." :showLogo="false"
        class="text-center sm:text-left !pt-0" />

        <!-- Loading Skeleton -->
      <div v-if="isLoading" class="mt-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 6" :key="i" class="h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
        </div>
        <div class="h-24 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
      </div>

      <!-- Form Content -->
      <form v-else @submit.prevent="submit" class="flex flex-col gap-6 mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput v-model="form.data.first_name" id="first_name" label="First Name" placeholder="Eg. Basanta"
            :error="form.errors.first_name" />
          <TextInput v-model="form.data.last_name" id="last_name" label="Last Name" :error="form.errors.last_name" placeholder="Eg. Sharma Gyawali"/>
          <TextInput v-model="form.data.mobile_number" id="mobile_number" label="Mobile Number" type="tel"
            :error="form.errors.mobile_number" placeholder="Eg. 9869452545"/>
          <TextInput v-model="formattedDate" id="date_of_birth" label="Date of Birth" type="date"
            :error="form.errors.date_of_birth" />
          <SelectInput v-model="form.data.gender" id="gender" label="Gender" :options="genderOptions"
            :error="form.errors.gender" />
          <TextInput v-model="form.data.timezone" id="timezone" label="Timezone"
            :error="form.errors.timezone" />
        </div>
        <div>
          <TextareaInput v-model="form.data.bio" id="bio" label="About Me" :rows="4"
            placeholder="Tell us a little about yourself" :error="form.errors.bio" />
        </div>
        <button type="submit" class="btn btn-primary w-full md:w-auto md:self-end" :disabled="form.isSubmitting || isLoading">
          <LoaderCircle v-if="form.isSubmitting" class="size-4 animate-spin mr-2" />
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>