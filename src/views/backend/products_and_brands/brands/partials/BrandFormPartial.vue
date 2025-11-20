<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SlugInput from "@/components/form/SlugInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import FileInput from "@/components/form/FileInput.vue"; // ADDED
import type { BrandFormData } from "@/types";

defineProps<{
	form: BrandFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Record<string, boolean>;
}>();
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
            <!-- Name, Slug, Description -->
            <TextInput label="Brand Name" v-model="form.name" :error="errors.name?.[0]" required autofocus />
            <SlugInput v-model="form.slug" :sourceValue="form.name" :disabled="isEdit" label="URL Slug" />
            <TextareaInput label="Description" v-model="form.description" :error="errors.description?.[0]" :rows="4" />
        </div>
        <div class="md:col-span-1 space-y-6">
            <!-- File Input -->
            <div class="p-4 border dark:border-gray-700 rounded-lg">
                <div v-if="isEdit && form.image_url" class="mb-4">
                    <label class="label mb-1">Current Logo</label>
                    <img :src="form.image_url" alt="Current brand logo" class="w-full h-auto rounded-lg border object-contain bg-white">
                </div>
                <FileInput
                    label="Brand Logo"
                    v-model="form.image"
                    :error="errors.image?.[0]"
                    accept="image/jpeg,image/png,image/webp"
                    :hint="isEdit ? 'Upload to replace the logo.' : 'Optional logo.'"
                />
            </div>
             <!-- Featured Status -->
            <div class="p-4 border dark:border-gray-700 rounded-lg">
                 <ToggleSwitch
                    v-model="form.is_featured"
                    label="Feature This Brand"
                    description="Featured brands may be highlighted."
                />
            </div>
        </div>
	</div>
</template>