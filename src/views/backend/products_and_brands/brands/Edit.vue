<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useBrandFormAPI } from "@/composables/form/brand/useBrandFormAPI";
import BrandFormPartial from "./partials/BrandFormPartial.vue";

const router = useRouter();
const {
    form,
    errors,
    isLoading,
    submit,
    isDirty,
    dirtyFields,
} = useBrandFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit Brand" 
        description="Modify the brand details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="brandForm">
            <BrandFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="brandForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Brand" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.brands.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>