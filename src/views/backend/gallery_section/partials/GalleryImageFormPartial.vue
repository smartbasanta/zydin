<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { GalleryImageFormData } from "@/types";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";

defineProps<{
	form: GalleryImageFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof GalleryImageFormData, boolean>>;
}>();

const groupOptions = [
    { value: 'company_culture', label: 'Company Culture' },
    { value: 'employee_life', label: 'Employee Life' },
];
</script>
<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Image Details</template>
                <div class="p-4 space-y-6">
                    <TextInput label="Caption" v-model="form.caption" :error="errors.caption?.[0]" />
                    <TextInput label="Alt Text" v-model="form.alt_text" :error="errors.alt_text?.[0]" hint="Descriptive text for screen readers." />
                </div>
            </ExpandableCard>
            <ExpandableCard :expanded="true">
                <template #header>Image File</template>
                <div class="p-4">
                    <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-1">Current Image</label>
                        <img :src="form.image_url" alt="Current image" class="w-full h-auto rounded-lg border object-cover">
                    </div>
                    <FileInput label="Upload Image" v-model="form.image" :error="errors.image?.[0]" :required="!isEdit" />
                </div>
            </ExpandableCard>
        </div>
        <div class="lg:col-span-1 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                     <SelectInput label="Gallery Group" v-model="form.gallery_group" :options="groupOptions" :error="errors.gallery_group?.[0]" required />
                    <TextInput label="Display Order" type="number" v-model.number="form.order_column" :error="errors.order_column?.[0]" required hint="Lower numbers appear first." />
                </div>
            </ExpandableCard>
        </div>
        <ToggleSwitch
            v-model="form.is_featured"
            label="Feature This Image"
            description="Featured Images may appear on the home/about page."
            :is-dirty="dirtyFields?.is_featured"
        />
	</div>
</template>