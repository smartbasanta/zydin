<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SlugInput from "@/components/form/SlugInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import FileInput from "@/components/form/FileInput.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { Brand, ProductFormData } from "@/types";
import JsonInput from "@/components/form/JsonInput.vue";
import ArrayInput from "@/components/form/ArrayInput.vue";

defineProps<{
	form: ProductFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Record<string, boolean>;
    brands: Brand[];
}>();
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ===== LEFT COLUMN ===== -->
        <div class="lg:col-span-2 space-y-6">

            <!-- Core Information Card -->
            <ExpandableCard :expanded="true">
                <template #header>Core Information</template>
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TextInput
                            label="Product Name"
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
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SelectInput
                            label="Product Type"
                            v-model="form.type"
                            :options="[{value: 'ff', label: 'Finished Formulation (FF)'}, {value: 'api', label: 'Active Pharmaceutical Ingredient (API)'}]"
                            :error="errors.type?.[0]"
                            :is-dirty="dirtyFields?.type"
                            required
                        />
                        <SelectInput
                            label="Brand"
                            v-model.number="form.brand_id"
                            :options="brands.map(b => ({ value: b.id, label: b.name }))"
                            :error="errors.brand_id?.[0]"
                            :is-dirty="dirtyFields?.brand_id"
                            placeholder="Select a brand"
                        />
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TextareaInput
                            label="Description"
                            v-model="form.description"
                            :error="errors.description?.[0]"
                            :is-dirty="dirtyFields?.description"
                            :rows="4"
                            placeholder="A brief summary of the product's purpose and benefits."
                        />
                        <ToggleSwitch
                            v-model="form.is_featured"
                            label="Feature This Product"
                            description="Featured products may be highlighted on the homepage."
                        />
                    </div>
                </div>
            </ExpandableCard>

            <!-- Finished Formulation (FF) Card -->
            <ExpandableCard :expanded="true" v-if="form.type === 'ff'">
                <template #header>Finished Formulation Details</template>
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Generic Name" v-model="form.generic_name" :error="errors.generic_name?.[0]" :is-dirty="dirtyFields?.generic_name" required />
                        <TextInput label="Therapeutic Area" v-model="form.therapeutic_area" :error="errors.therapeutic_area?.[0]" :is-dirty="dirtyFields?.therapeutic_area" />
                        <TextInput label="Dosage Form" v-model="form.dosage_form" :error="errors.dosage_form?.[0]" :is-dirty="dirtyFields?.dosage_form" />
                        <TextInput label="Strength" v-model="form.strength" :error="errors.strength?.[0]" :is-dirty="dirtyFields?.strength" />
                    </div>
                    <TextareaInput label="Pharmacology" v-model="form.pharmacology" :rows="3" />
                    <TextareaInput label="Indications" v-model="form.indications" :rows="3" />
                </div>
            </ExpandableCard>

            <!-- Active Pharmaceutical Ingredient (API) Card -->
             <ExpandableCard :expanded="true" v-if="form.type === 'api'">
                <template #header>API Details</template>
                <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput label="CAS Number" v-model="form.cas_number" :error="errors.cas_number?.[0]" :is-dirty="dirtyFields?.cas_number" required />
                    <TextInput label="Category" v-model="form.category" :error="errors.category?.[0]" :is-dirty="dirtyFields?.category" />
                    <TextInput label="Molecular Formula" v-model="form.molecular_formula" :error="errors.molecular_formula?.[0]" />
                    <TextInput label="Molecular Weight" v-model="form.molecular_weight" :error="errors.molecular_weight?.[0]" />
                </div>
            </ExpandableCard>
        </div>

        <!-- ===== RIGHT COLUMN ===== -->
        <div class="lg:col-span-1 space-y-6">

            <!-- Configuration Card -->
            <!-- <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                    <SelectInput
                        label="Product Type"
                        v-model="form.type"
                        :options="[{value: 'ff', label: 'Finished Formulation (FF)'}, {value: 'api', label: 'Active Pharmaceutical Ingredient (API)'}]"
                        :error="errors.type?.[0]"
                        :is-dirty="dirtyFields?.type"
                        :disabled="isEdit"
                        required
                    />
                    <SelectInput
                        label="Brand"
                        v-model.number="form.brand_id"
                        :options="brands.map(b => ({ value: b.id, label: b.name }))"
                        :error="errors.brand_id?.[0]"
                        :is-dirty="dirtyFields?.brand_id"
                        placeholder="Select a brand"
                        required
                    />
                    <ToggleSwitch
                        v-model="form.is_featured"
                        label="Feature This Product"
                        description="Featured products may be highlighted on the homepage."
                    />
                </div>
            </ExpandableCard> -->

            <ExpandableCard :expanded="true">
                <template #header>Media</template>
                <div class="p-4 space-y-4">
                    <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-1">Current Image</label>
                        <img :src="form.image_url" alt="Current product image" class="w-full h-auto rounded-lg border object-contain bg-white">
                    </div>
                    <FileInput
                        label="Product Image"
                        v-model="form.image"
                        :error="errors.image?.[0]"
                        :is-dirty="dirtyFields?.image"
                        accept="image/jpeg,image/png,image/webp"
                        :hint="isEdit ? 'Upload to replace the current image.' : 'Optional product image.'"
                    />
                </div>
            </ExpandableCard>
            
            <!-- Documents Card -->
            <ExpandableCard :expanded="true">
                <template #header>Safty & Prescription</template>
                <div class="p-4 space-y-6">
                <ArrayInput
                    id="prescribtions"
                    label="Prescribtions"
                    hint="Add prescribtions for the users."
                    v-model="form.prescribtion"
                />
                <ArrayInput
                    id="safety_precaution"
                    label="Safty Measures"
                    hint="Add safty measures."
                    v-model="form.safety_precaution"
                />
                </div>
            </ExpandableCard>
        </div>
	</div>
</template>