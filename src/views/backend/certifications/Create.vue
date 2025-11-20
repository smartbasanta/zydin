<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useCertificationFormAPI } from "@/composables/form/certification/useCertificationFormApi";
import CertificationFormPartial from "./partials/CertificationFormPartial.vue";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useCertificationFormAPI();
</script>

<template>
    <CRUDCard 
        title="Add New Certification" 
        description="Fill in the details for the new certification."
    >
        <form @submit.prevent="submit" class="space-y-6" id="certificationForm">
            <CertificationFormPartial
                :form="form"
                :errors="errors"
                :is-edit="false"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="certificationForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Save Certification" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.certifications.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>