<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import GalleryImageFormPartial from "./partials/GalleryImageFormPartial.vue";
import { useGalleryImageFormAPI } from "@/composables/form/gallery-section/useGalleryImageFormAPI";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty, dirtyFields } = useGalleryImageFormAPI();
</script>
<template>
    <CRUDCard 
        title="Edit Gallery Image" 
        description="Modify the image details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="galleryImageForm">
            <GalleryImageFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="galleryImageForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Image" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.gallery-images.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>