<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import type { CertificationFormData } from "@/types";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";

defineProps<{
	form: CertificationFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof CertificationFormData, boolean>>;
}>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
            <TextInput label="Certification Name" v-model="form.name" :error="errors.name?.[0]" required />
            <TextInput label="Issuing Body" v-model="form.issuing_body" :error="errors.issuing_body?.[0]" required />
            <TextareaInput label="Description" v-model="form.description" :error="errors.description?.[0]" :rows="6" />
            <ToggleSwitch
                v-model="form.is_featured"
                label="Feature This Certificate"
                description="Featured articles may appear on the homepage."
                :is-dirty="dirtyFields?.is_featured"
            />
        </div>
        <div class="md:col-span-1 space-y-6">
            <div class="p-4 border dark:border-gray-700 rounded-lg">
                <div v-if="isEdit && form.logo_url" class="mb-4">
                    <label class="label mb-1">Current Logo</label>
                    <img :src="form.logo_url" class="w-full h-auto rounded border">
                </div>
                <FileInput label="Logo" v-model="form.logo_image" :error="errors.logo_image?.[0]" hint="Optional logo image." />
            </div>
            <div class="p-4 border dark:border-gray-700 rounded-lg">
                <div v-if="isEdit && form.pdf_url" class="mb-4">
                    <label class="label mb-1">Current PDF</label>
                    <a :href="form.pdf_url" target="_blank" class="link">View Current PDF</a>
                </div>
                <FileInput label="PDF Document" v-model="form.pdf_file" :error="errors.pdf_file?.[0]" accept=".pdf" />
            </div>
        </div>
    </div>
</template>