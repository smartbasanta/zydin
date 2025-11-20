<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useProductFormAPI } from "@/composables/form/product/useProductFormAPI";
import ProductFormPartial from "./partials/ProductFormPartial.vue";
import { useBrands } from "@/composables/backend/useBrands";
import LoadingState from "@/components/loading/LoadingState.vue";

const router = useRouter();
const {
    form,
    errors,
    isLoading,
    submit,
    isDirty,
    dirtyFields,
} = useProductFormAPI();
const { brands, isLoading: brandIsLoading, error } = useBrands();
</script>

<template>
    <LoadingState v-if="brandIsLoading" />
    <CRUDCard v-else
        title="Edit Product" 
        description="Modify the product details and save your changes."
    >
        <form @submit.prevent="submit" class="space-y-6" id="productForm">
            <ProductFormPartial
                :form="form"
                :errors="errors"
                :is-edit="true"
                :dirty-fields="dirtyFields"
                @update:form="Object.assign(form, $event)"
                :brands="brands"
            />
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="productForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Update Product" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'dashboard.products.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
    </CRUDCard>
</template>