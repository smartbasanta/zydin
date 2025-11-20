<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import CertificationFormPartial from "./partials/CertificationFormPartial.vue";
import { useCertificationFormAPI } from "@/composables/form/certification/useCertificationFormApi";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty, dirtyFields } = useCertificationFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit Certification" 
        description="Modify the certification details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="certificationForm">
            <CertificationFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="certificationForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Updating..." : "Update Certification" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.certifications.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>