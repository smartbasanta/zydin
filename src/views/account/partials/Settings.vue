<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiError, ApiResponse } from '@/types/api';
import type { Settings } from '@/types/auth';
import { LoaderCircle, Save } from 'lucide-vue-next';
import ToggleSwitch from '@/components/form/ToggleSwitch.vue';

// --- Composables & State ---
const { notify } = useNotifier('bottom-right');
const isLoading = ref(true);
const isSubmitting = ref(false);

const settings = ref<Omit<Settings, 'user_id' | 'id'>>({
  email_notifications: false,
  sms_notifications: false,
  preferences: '{}',
});

// --- API Functions ---
const fetchSettings = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.get<ApiResponse<Settings>>('/user/account/settings');
    const data = response.data;
    
    // --- FIX FOR PROBLEM #2 (EXCESSIVE ESCAPING) ---
    // This block intelligently handles the 'preferences' data, breaking the escaping feedback loop.
    let prefsObject: object;
    const incomingPrefs = data.preferences;

    if (typeof incomingPrefs === 'string') {
      try {
        // If the server sent back a string, parse it into an object.
        prefsObject = JSON.parse(incomingPrefs);
      } catch (e) {
        // If the string is corrupt, default to an empty object.
        prefsObject = {};
      }
    } else {
      // If the server sent back an object or null, use it directly.
      prefsObject = incomingPrefs || {};
    }
    
    settings.value = {
        email_notifications: !!data.email_notifications,
        sms_notifications: !!data.sms_notifications,
        // Now, we safely stringify the guaranteed object for pretty display in the textarea.
        preferences: JSON.stringify(prefsObject, null, 2),
    };

  } catch (error) {
    notify(error as ApiError);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSettings);

const updateSettings = async () => {
  isSubmitting.value = true;

  // --- FIX FOR PROBLEM #1 (EMPTY INPUT) ---
  // If the user clears the textarea, treat it as a valid empty JSON object.
  let preferencesPayload = settings.value.preferences?.trim();
  if (!preferencesPayload) {
    preferencesPayload = '{}';
  }

  // First, validate the JSON string on the client-side
  try {
    JSON.parse(preferencesPayload);
  } catch (error) {
    if (error instanceof SyntaxError) {
      notify({ 
        notification: { 
          type: 'error', 
          title: 'Invalid JSON',
          message: 'The format of your Advanced Preferences is incorrect. Please fix it and try again.'
        } 
      });
      isSubmitting.value = false;
      return;
    }
  }

  // If the JSON is valid, proceed with the API call
  try {
    const payload = {
      email_notifications: settings.value.email_notifications,
      sms_notifications: settings.value.sms_notifications,
      preferences: preferencesPayload, // Send the validated (and potentially defaulted) string
    };

    const response = await apiService.put<ApiResponse<Settings>>('/user/account/settings/update', payload);
    if (response.notification) {
      notify({ notification: response.notification });
    }
    // Re-fetch to ensure the view is consistent with the database state
    await fetchSettings();
  } catch (error) {
    notify(error as ApiError);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl">
    <h3 class="text-xl font-bold mb-6">Notification Settings</h3>

    <div v-if="isLoading" class="text-center p-8">
      <LoaderCircle class="size-8 animate-spin mx-auto" />
      <p class="mt-2 text-slate-500">Loading settings...</p>
    </div>

    <form v-else @submit.prevent="updateSettings" class="space-y-6">
      <ToggleSwitch 
        v-model="settings.email_notifications" 
        label="Email Notifications" 
        description="Receive important notifications and updates via email."
      />
      <ToggleSwitch 
        v-model="settings.sms_notifications" 
        label="SMS Notifications" 
        description="Receive critical alerts via text message (carrier rates may apply)."
      />

      <div>
        <label for="preferences" class="block text-sm font-medium mb-1">Advanced Preferences (JSON)</label>
        <textarea 
          id="preferences" 
          v-model="settings.preferences" 
          rows="4" 
          class="form-input w-full font-mono text-sm"
          placeholder="{}"
        ></textarea>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn primary icon-left" :disabled="isSubmitting">
          <LoaderCircle v-if="isSubmitting" class="size-4 animate-spin" />
          <Save v-else class="size-4" />
          Save Settings
        </button>
      </div>
    </form>
  </div>
</template>