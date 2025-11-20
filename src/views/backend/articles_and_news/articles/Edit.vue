<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useArticleFormAPI } from "@/composables/form/article/useArticleFormAPI";
import ArticleFormPartial from "./partials/ArticleFormPartial.vue";

const router = useRouter();
const {
    form,
    errors,
    isLoading,
    submit,
    isDirty,
    dirtyFields,
} = useArticleFormAPI();
</script>

<template>
    <CRUDCard 
        title="Edit Article" 
        description="Modify the article details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="articleForm">
            <ArticleFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="articleForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Article" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.articles.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>