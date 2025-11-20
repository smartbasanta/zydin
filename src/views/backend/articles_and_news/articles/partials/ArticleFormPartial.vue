<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import RichTextEditor from "@/components/form/RichTextEditor.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { ArticleFormData } from "@/types";

defineProps<{
	form: ArticleFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof ArticleFormData, boolean>>;
}>();

const categoryOptions = [
    { value: 'Industry Insights', label: 'Industry Insights' },
    { value: 'Research & Development', label: 'Research & Development' },
    { value: 'Company Culture', label: 'Company Culture' },
];
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ===== LEFT COLUMN: Main Content ===== -->
        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Article Content</template>
                <div class="p-4 space-y-6">
                    <TextInput
                        label="Title"
                        v-model="form.title"
                        :error="errors.title?.[0]"
                        :is-dirty="dirtyFields?.title"
                        required
                        autofocus
                    />
                    <TextareaInput
                        label="Excerpt"
                        v-model="form.excerpt"
                        :error="errors.excerpt?.[0]"
                        :is-dirty="dirtyFields?.excerpt"
                        :rows="3"
                        :max-length="500"
                        placeholder="A short, compelling summary for list pages and social media."
                    />
                    <RichTextEditor
                        label="Full Content"
                        v-model="form.content"
                        :error="errors.content?.[0]"
                        :is-dirty="dirtyFields?.content"
                        required
                    />
                </div>
            </ExpandableCard>
            <ExpandableCard :expanded="true">
                <template #header>Media</template>
                <div class="p-4 space-y-4">
                     <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-1">Current Image</label>
                        <img :src="form.image_url" alt="Current featured image" class="w-full h-auto rounded-lg border object-cover">
                    </div>
                    <FileInput
                        label="Featured Image"
                        v-model="form.image"
                        :error="errors.image?.[0]"
                        :is-dirty="dirtyFields?.image"
                        accept="image/jpeg,image/png,image/webp"
                        :hint="isEdit ? 'Upload a new file to replace the current image.' : 'Image is required.'"
                    />
                </div>
            </ExpandableCard>
        </div>

        <!-- ===== RIGHT COLUMN: Metadata & Media ===== -->
        <div class="lg:col-span-1 space-y-6">

            <!-- Configuration Card -->
            <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                    <SelectInput
                        label="Category"
                        v-model="form.category"
                        :options="categoryOptions"
                        :error="errors.category?.[0]"
                        :is-dirty="dirtyFields?.category"
                        required
                    />
                     <DateInput
                        label="Publish Date"
                        v-model="form.publish_date"
                        :error="errors.publish_date?.[0]"
                        :is-dirty="dirtyFields?.publish_date"
                        required
                    />
                     <ToggleSwitch
                        v-model="form.is_featured"
                        label="Feature This Article"
                        description="Featured articles may appear on the homepage."
                        :is-dirty="dirtyFields?.is_featured"
                    />
                </div>
            </ExpandableCard>

            <!-- Author Card -->
             <ExpandableCard :expanded="true">
                <template #header>Author Details</template>
                 <div class="p-4 space-y-6">
                     <TextInput
                        label="Author Name"
                        v-model="form.author"
                        :error="errors.author?.[0]"
                        :is-dirty="dirtyFields?.author"
                        required
                    />
                     <TextInput
                        label="Author Title"
                        v-model="form.author_title"
                        :error="errors.author_title?.[0]"
                        :is-dirty="dirtyFields?.author_title"
                        placeholder="e.g., Lead Scientist"
                        required
                    />
                </div>
            </ExpandableCard>             
        </div>
	</div>
</template>