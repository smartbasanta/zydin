<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import HeroSlideFormPartial from "./partials/HeroSlideFormPartial.vue";
import { useHeroSlideFormAPI } from "@/composables/form/hero-section/useHeroSectionFormAPI";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useHeroSlideFormAPI();
</script>

<template>
    <CRUDCard 
        title="Add New Hero Slide" 
        description="Fill in the details to create a new slide for the homepage hero section."
    >
        <form @submit.prevent="submit" class="space-y-6" id="heroSlideForm">
            <HeroSlideFormPartial
                :form="form"
                :errors="errors"
                :is-edit="false"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="heroSlideForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Create Slide" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.hero-slides.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>