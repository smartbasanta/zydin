<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import NewsUpdateFormPartial from "./partials/NewsUpdateFormPartial.vue";
import { useNewsUpdateFormAPI } from "@/composables/form/news/useNewsUpdateFormAPI";

const router = useRouter();
const {
    form,
    errors,
    isLoading,
    submit,
    isDirty,
    dirtyFields,
} = useNewsUpdateFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit News/Update" 
        description="Modify the post details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="newsUpdateForm">
            <NewsUpdateFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="newsUpdateForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Post" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.news.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>