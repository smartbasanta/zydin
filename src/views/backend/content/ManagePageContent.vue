<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SaveButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import RichTextEditor from "@/components/form/RichTextEditor.vue";
// ----> 1. Import the new RepeaterInput component
import RepeaterInput from "@/components/form/RepeaterInput.vue"; 
import { usePageContentFormAPI } from "@/composables/form/page-content/usePageContentFormAPI";

const route = useRoute();
const pageSlug = computed(() => route.params.pageSlug as string);

const { form, errors, isLoading, submit, isDirty, pageDetails } = usePageContentFormAPI(pageSlug.value);
watch(isLoading, (newValue)=>{
    // console.log(form.content_blocks);
    form.content_blocks.forEach((block, index )=> {
        if(block.type === 'repeater'){
            // console.log(form.content_blocks[index]);
        }
    });
})
</script>

<template>
    <CRUDCard 
        :title="pageDetails.title || 'Loading...'" 
        :description="pageDetails.description || 'Fetching page content configuration.'"
    >
        <div v-if="isLoading && form.content_blocks.length === 0" class="text-center p-8">Loading content...</div>
        <form v-else @submit.prevent="submit" class="space-y-8" id="pageContentForm">
            <div class="grid grid-cols-2 gap-4">

                <div v-for="(block, index) in form.content_blocks" :key="block.key">
                    <!-- <div class=""> -->
                        <TextInput
                            v-if="block.type === 'text'"
                            :label="block.label"
                            v-model="form.content_blocks[index].value"
                            :error="errors[`content_blocks.${index}.value`]?.[0]"
                            :placeholder="block.placeholder"
                        />
                        <TextareaInput
                            v-if="block.type === 'textarea'"
                            :label="block.label"
                            v-model="form.content_blocks[index].value"
                            :error="errors[`content_blocks.${index}.value`]?.[0]"
                            :placeholder="block.placeholder"
                            :rows="4"
                        />
                    <!-- </div> -->
                    <div>
                        <RichTextEditor
                            v-if="block.type === 'richtext'"
                            :label="block.label"
                            v-model="form.content_blocks[index].value"
                            :error="errors[`content_blocks.${index}.value`]?.[0]"
                        />
                        
                        <RepeaterInput
                            v-if="block.type === 'repeater'"
                            :label="block.label"
                            v-model="form.content_blocks[index].value"
                            :fields="block.fields!"
                            :error="errors[`content_blocks.${index}.value`]?.[0]"
                            :placeholder="block.placeholder"
                        />
                    </div>
                </div>
            </div>

            <div class="flex justify-end items-center gap-4">
                <SaveButton form="pageContentForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Saving..." : "Save Changes" }}
                </SaveButton>
            </div>
        </form>
    </CRUDCard>
</template>