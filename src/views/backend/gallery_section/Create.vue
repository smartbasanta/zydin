<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import GalleryImageFormPartial from "./partials/GalleryImageFormPartial.vue";
import { useGalleryImageFormAPI } from "@/composables/form/gallery-section/useGalleryImageFormAPI";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useGalleryImageFormAPI();
</script>
<template>
    <CRUDCard 
        title="Add New Gallery Image" 
        description="Upload an image and provide its details to add it to a gallery."
    >
        <form @submit.prevent="submit" class="space-y-6" id="galleryImageForm">
            <GalleryImageFormPartial
                :form="form"
                :errors="errors"
                :is-edit="false"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="galleryImageForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Uploading..." : "Add Image" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.gallery-images.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>