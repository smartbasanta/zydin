<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import NewsUpdateFormPartial from "./partials/NewsUpdateFormPartial.vue";
import { useNewsUpdateFormAPI } from "@/composables/form/news/useNewsUpdateFormAPI";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useNewsUpdateFormAPI();
</script>

<template>
    <CRUDCard 
        title="Create New Post" 
        description="Fill in the details to publish a new news or update."
    >
        <form @submit.prevent="submit" class="space-y-6" id="newsUpdateForm">
            <NewsUpdateFormPartial
                :form="form"
                :errors="errors"
                :is-edit="false"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="newsUpdateForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Publishing..." : "Publish Post" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.news.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>