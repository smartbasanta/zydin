<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { HeroSlideFormData } from "@/types";

defineProps<{
	form: HeroSlideFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof HeroSlideFormData, boolean>>;
}>();
</script>
<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Slide Content</template>
                <div class="p-4 space-y-6">
                    <TextInput label="Title" v-model="form.title" :error="errors.title?.[0]" required />
                    <TextareaInput label="Description" v-model="form.description" :error="errors.description?.[0]" :rows="3" />
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Button Text" v-model="form.link_text" :error="errors.link_text?.[0]" placeholder="e.g., Learn More" />
                        <TextInput label="Button URL" v-model="form.link_url" :error="errors.link_url?.[0]" placeholder="https://example.com" />
                    </div>
                </div>
            </ExpandableCard>
            <ExpandableCard :expanded="true">
                <template #header>Background Image</template>
                <div class="p-4">
                    <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-1">Current Image</label>
                        <img :src="form.image_url" alt="Current image" class="w-full h-auto rounded-lg border object-cover">
                    </div>
                    <FileInput label="Upload Image" v-model="form.image" :error="errors.image?.[0]" />
                </div>
            </ExpandableCard>
        </div>
        <div class="lg:col-span-1 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                    <TextInput label="Display Order" type="number" v-model.number="form.order_column" :error="errors.order_column?.[0]" required hint="Lower numbers appear first." />
                    <ToggleSwitch v-model="form.is_active" label="Activate this slide" />
                </div>
            </ExpandableCard>
        </div>
	</div>
</template>