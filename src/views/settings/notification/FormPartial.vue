<script setup lang="ts">
import type { SystemNotificationFormData } from "@/types/notification"; // Assuming you have a type for this
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import InputError from "@/components/form/InputError.vue";
import { defineProps, defineEmits } from 'vue';
import { getNamedRoutesAsSelectOptions } from "@/composables/useRouteExtractor";
import SearchableSelectInput from "@/components/form/SearchableSelectInput.vue";

const props = defineProps<{
	form: SystemNotificationFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Record<string, boolean>;
}>();

defineEmits(["update:form"]);

// Helper to format date for datetime-local input
const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Adjust for timezone offset to display correctly in user's local time
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        return localDate.toISOString().slice(0, 16);
    } catch (e) {
        return '';
    }
};
</script>

<template>
	<div class="space-y-6">
        <TextareaInput
            label="Notification Content"
            id="text"
            v-model="form.text"
            :error="errors.text?.[0]"
            :rows="4"
            required
            autofocus
            placeholder="Enter the main content of the notification."
            :class="{ 'dirty-input': dirtyFields?.text }"
        />
        <SelectInput
            label="Notification Type"
            id="type"
            v-model="form.type"
            :error="errors.type?.[0]"
            :options="[
                { value: 'info', label: 'Info' },
                { value: 'success', label: 'Success' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' }
            ]"
            required
            :class="{ 'dirty-input': dirtyFields?.type }"
        />
        <SearchableSelectInput
            label="Route"
            id="route"
            v-model="form.route"
            :options="getNamedRoutesAsSelectOptions()"
            :error="errors.route?.[0]"
            placeholder="e.g., dashboard, home"
            hint="Optional: A client-side route to determine where to show notification"
            :class="{ 'dirty-input': dirtyFields?.route }"
            clearable
            clear-option-label="No Specific Route"
        />
        <!-- <SelectInput
            label="Route"
            id="route"
            v-model="form.route"
            :error="errors.route?.[0]"
            placeholder="e.g., dashboard, home"
            hint="Optional: A client-side route to determine where to show notification"
            :class="{ 'dirty-input': dirtyFields?.route }"
        /> -->
        <TextInput
            label="Link"
            id="link"
            v-model="form.link"
            :error="errors.link?.[0]"
            placeholder="e.g., /dashboard, /users/1"
            hint="Optional: A client-side route to navigate to on click."
            :class="{ 'dirty-input': dirtyFields?.link }"
        />

        <TextInput
            type="datetime-local"
            label="Expires At"
            id="expires_at"
            :model-value="formatDateForInput(form.expires_at)"
            @update:model-value="form.expires_at = $event?.toString() ?? null"
            :error="errors.expires_at?.[0]"
            hint="Optional: The notification will be hidden after this date."
            :class="{ 'dirty-input': dirtyFields?.expires_at }"
        />

        <div>
            <div class="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_visible"
                    v-model="form.is_visible"
                    class="checkbox checkbox-primary"
                    :class="{ 'dirty-input': dirtyFields?.is_visible }"
                />
                <label
                    for="is_visible"
                    class="label cursor-pointer select-none"
                    >Visible to Users</label
                >
            </div>
            <InputError :error="errors.is_visible?.[0]" />
            <p class="text-xs text-gray-500 mt-1">
                Uncheck to hide this notification from all users.
            </p>
        </div>
	</div>
</template>