<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useJobOpeningFormAPI } from "@/composables/form/job/useJobOpeningFormAPI";
import JobOpeningFormPartial from "./partials/JobOpeningFormPartial.vue";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty, dirtyFields } = useJobOpeningFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit Job Opening" 
        description="Modify the job details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="jobForm">
            <JobOpeningFormPartial
                :form="form"
                :errors="errors"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="jobForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Job" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.jobs.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>