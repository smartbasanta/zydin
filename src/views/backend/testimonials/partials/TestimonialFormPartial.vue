<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import type { TestimonialFormData } from "@/types";

defineProps<{
	form: TestimonialFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
    dirtyFields?: Partial<Record<keyof TestimonialFormData, boolean>>;
}>();

const typeOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'employee', label: 'Employee' },
];
const ratingOptions = [
    { value: 5, label: '5 Stars (Excellent)' },
    { value: 4, label: '4 Stars (Good)' },
    { value: 3, label: '3 Stars (Average)' },
    { value: 2, label: '2 Stars (Fair)' },
    { value: 1, label: '1 Star (Poor)' },
];
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Testimonial Details</template>
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput label="Full Name" v-model="form.name" :error="errors.name?.[0]" :is-dirty="dirtyFields?.name" required />
                        <TextInput label="Role / Position" v-model="form.role" :error="errors.role?.[0]" :is-dirty="dirtyFields?.role" required placeholder="e.g., CEO, ABC Corp."/>
                    </div>
                    <TextareaInput
                        label="Testimonial Text"
                        v-model="form.text"
                        :error="errors.text?.[0]"
                        :is-dirty="dirtyFields?.text"
                        :rows="5"
                        required
                    />
                </div>
            </ExpandableCard>
        </div>

        <div class="lg:col-span-1 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Configuration</template>
                <div class="p-4 space-y-6">
                    <SelectInput label="Rating" v-model.number="form.rating" :options="ratingOptions" :error="errors.rating?.[0]" :is-dirty="dirtyFields?.rating" required />
                    <SelectInput label="Type" v-model="form.type" :options="typeOptions" :error="errors.type?.[0]" :is-dirty="dirtyFields?.type" required />
                    <ToggleSwitch v-model="form.is_featured" label="Feature this testimonial" :is-dirty="dirtyFields?.is_featured" />
                </div>
            </ExpandableCard>

            <ExpandableCard :expanded="true">
                <template #header>Avatar</template>
                <div class="p-4 space-y-4">
                     <div v-if="isEdit && form.avatar_url" class="mb-4">
                        <label class="label mb-1">Current Avatar</label>
                        <img :src="form.avatar_url" alt="Current avatar" class="w-24 h-24 rounded-full border object-cover">
                    </div>
                    <FileInput
                        label="Avatar Image"
                        v-model="form.avatar"
                        :error="errors.avatar?.[0]"
                        :is-dirty="dirtyFields?.avatar"
                        accept="image/jpeg,image/png,image/webp"
                        hint="Optional. Upload a new avatar to replace the current one."
                    />
                </div>
            </ExpandableCard>
        </div>
	</div>
</template>