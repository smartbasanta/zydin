<script setup lang="ts">
import NotificationFormPartial from "./FormPartial.vue";
// You will need to create this composable based on useRoleFormAPI
import { useSystemNotificationFormAPI } from "@/composables/settings/useSystemNotificationFormAPI";
import { useRouter } from "vue-router";
import ExpandableCard from "@/components/card/ExpandableCard.vue";

import { onMounted, ref } from "vue";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";

const router = useRouter();
// The composable will automatically get the ID from the route params
const {
    form,
    errors,
    isLoading,
    submit,
    isDirty,
    dirtyFields,
} = useSystemNotificationFormAPI();

const canTeleport = ref(false);
onMounted(() => {
    canTeleport.value = !!document.querySelector("[data-slot=actions]");
});
</script>

<template>
    <CRUDCard 
        title="Edit Notification" 
        description="Modify the notification details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="notificationForm">
            <ExpandableCard :expanded="true">
                <template #header>Notification Details</template>
                <NotificationFormPartial
                    :form="form"
                    :errors="errors"
                    :is-edit="true"
                    :dirty-fields="dirtyFields"
                    @update:form="Object.assign(form, $event)"
                />
            </ExpandableCard>

            <div class="flex justify-end items-center gap-4">
                <SaveButton form="notificationForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Notification" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'settings.system-notifications.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
        <!-- <Teleport v-if="canTeleport" to="[data-slot='actions']">
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="notificationForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Notification" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'settings.system-notifications.index' })">
                    Cancel
                </CancelButton>
            </div>
        </Teleport> -->
    </CRUDCard>
</template>