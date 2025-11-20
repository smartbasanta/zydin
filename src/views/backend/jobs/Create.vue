<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import JobOpeningFormPartial from "./partials/JobOpeningFormPartial.vue";
import { useJobOpeningFormAPI } from "@/composables/form/job/useJobOpeningFormAPI";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useJobOpeningFormAPI();
</script>

<template>
    <CRUDCard 
        title="Post New Job Opening" 
        description="Fill in the details for the new position."
    >
        <form @submit.prevent="submit" class="space-y-6" id="jobForm">
            <JobOpeningFormPartial
                :form="form"
                :errors="errors"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="jobForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Posting..." : "Post Job" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.jobs.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>