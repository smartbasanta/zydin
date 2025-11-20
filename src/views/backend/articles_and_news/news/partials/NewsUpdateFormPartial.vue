<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import RichTextEditor from "@/components/form/RichTextEditor.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { NewsUpdateFormData } from "@/types";

defineProps<{
	form: NewsUpdateFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof NewsUpdateFormData, boolean>>;
}>();
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Post Content</template>
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
                        placeholder="A short summary for list pages."
                    />
                    <RichTextEditor
                        label="Full Content"
                        v-model="form.full_content"
                        :error="errors.full_content?.[0]"
                        :is-dirty="dirtyFields?.full_content"
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
                        hint="Optional. Used for display on the website."
                    />
                </div>
            </ExpandableCard>
        </div>

        <div class="lg:col-span-1 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                    <DateInput
                        label="Publish Date"
                        v-model="form.publish_date"
                        :error="errors.publish_date?.[0]"
                        :is-dirty="dirtyFields?.publish_date"
                        required
                    />
                    <TextInput
                        label="Source"
                        v-model="form.source"
                        :error="errors.source?.[0]"
                        :is-dirty="dirtyFields?.source"
                        placeholder="e.g., Company Blog, Forbes"
                    />
                    <TextInput
                        label="External Link"
                        v-model="form.link"
                        :error="errors.link?.[0]"
                        :is-dirty="dirtyFields?.link"
                        placeholder="https://example.com/original-article"
                        hint="Optional. If provided, users will be redirected here."
                    />
                     <ToggleSwitch
                        v-model="form.is_featured"
                        label="Feature This Post"
                        description="Featured posts may appear on the homepage."
                        :is-dirty="dirtyFields?.is_featured"
                    />
                </div>
            </ExpandableCard>
        </div>
	</div>
</template>