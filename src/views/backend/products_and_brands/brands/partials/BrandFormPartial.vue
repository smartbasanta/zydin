<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SlugInput from "@/components/form/SlugInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import FileInput from "@/components/form/FileInput.vue";
import ExpandableCard from "@/components/card/ExpandableCard.vue"; // Import ExpandableCard
import type { BrandFormData } from "@/types";

defineProps<{
	form: BrandFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Record<string, boolean>;
}>();
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- ===== LEFT COLUMN (Main Info) ===== -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Core Information Card -->
            <ExpandableCard :expanded="true">
                <template #header>Brand Information</template>
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput 
                            label="Brand Name" 
                            v-model="form.name" 
                            :error="errors.name?.[0]" 
                            :is-dirty="dirtyFields?.name"
                            required 
                            autofocus 
                        />
                        <SlugInput 
                            v-model="form.slug" 
                            :sourceValue="form.name" 
                            :disabled="isEdit" 
                            label="URL Slug" 
                            hint="Unique identifier used in the website URL."
                        />
                    </div>
                    <TextareaInput 
                        label="Description" 
                        v-model="form.description" 
                        :error="errors.description?.[0]" 
                        :is-dirty="dirtyFields?.description"
                        :rows="5" 
                        placeholder="Describe the brand's mission, values, or key characteristics."
                    />
                </div>
            </ExpandableCard>
        </div>

        <!-- ===== RIGHT COLUMN (Media & Config) ===== -->
        <div class="lg:col-span-1 space-y-6">
            
            <!-- Media Card -->
            <ExpandableCard :expanded="true">
                <template #header>Logo & Media</template>
                <div class="p-4 space-y-4">
                    <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-2">Current Logo</label>
                        <div class="p-2 bg-white rounded-lg border border-muted flex items-center justify-center h-32">
                            <img 
                                :src="form.image_url" 
                                alt="Current brand logo" 
                                class="max-w-full max-h-full object-contain"
                            >
                        </div>
                    </div>
                    <FileInput
                        label="Brand Logo"
                        v-model="form.image"
                        :error="errors.image?.[0]"
                        :is-dirty="dirtyFields?.image"
                        accept="image/jpeg,image/png,image/webp"
                        :hint="isEdit ? 'Upload to replace the current logo.' : 'Upload a high-quality logo.'"
                    />
                </div>
            </ExpandableCard>

            <!-- Configuration Card -->
            <ExpandableCard :expanded="true">
                <template #header>Settings</template>
                <div class="p-4">
                     <ToggleSwitch
                        v-model="form.is_featured"
                        label="Feature This Brand"
                        description="Featured brands are highlighted on the homepage."
                        :is-dirty="dirtyFields?.is_featured"
                    />
                </div>
            </ExpandableCard>
        </div>
	</div>
</template>