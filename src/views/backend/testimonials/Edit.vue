<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useTestimonialFormAPI } from "@/composables/form/testimonial/useTestimonialFormAPI";
import TestimonialFormPartial from "./partials/TestimonialFormPartial.vue";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty, dirtyFields } = useTestimonialFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit Testimonial" 
        description="Modify the testimonial details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="testimonialForm">
            <TestimonialFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="testimonialForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Testimonial" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.testimonials.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>