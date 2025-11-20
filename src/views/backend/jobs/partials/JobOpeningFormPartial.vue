<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import ToggleSwitch from "@/components/form/ToggleSwitch.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import ArrayInput from "@/components/form/ArrayInput.vue";
import type { JobOpeningFormData } from "@/types";

defineProps<{
form: JobOpeningFormData;
errors: Record<string, string[]>;
isEdit?: boolean;
dirtyFields?: Record<string, boolean>;
}>();

const jobTypes = [
{ value: 'Full-time', label: 'Full-time' },
{ value: 'Internship', label: 'Internship' },
{ value: 'Part-time', label: 'Part-time' },
{ value: 'Contract', label: 'Contract' },
];
</script>

<template>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div class="lg:col-span-2 space-y-6">
<ExpandableCard :expanded="true">
<template #header>Job Details</template>
<div class="p-4 space-y-6">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<TextInput label="Job Title" v-model="form.title" :error="errors.title?.[0]" :is-dirty="dirtyFields?.title" required />
<TextInput label="Department" v-model="form.department" :error="errors.department?.[0]" :is-dirty="dirtyFields?.department" required />
</div>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<TextInput label="Location" v-model="form.location" :error="errors.location?.[0]" :is-dirty="dirtyFields?.location" placeholder="e.g., New York, NY or Remote" />
<SelectInput label="Job Type" v-model="form.type" :options="jobTypes" :error="errors.type?.[0]" :is-dirty="dirtyFields?.type" required />
</div>
<TextareaInput label="Job Description" v-model="form.description" :error="errors.description?.[0]" :is-dirty="dirtyFields?.description" :rows="6" />
</div>
</ExpandableCard>

<ExpandableCard :expanded="true">
<template #header>Requirements</template>
<div class="p-4 space-y-6">
<ArrayInput id="responsibilities" label="Responsibilities" v-model="form.responsibilities" hint="List the key responsibilities for this role." />
<ArrayInput id="qualifications" label="Qualifications" v-model="form.qualifications" hint="List the required qualifications and skills." />
</div>
</ExpandableCard>
</div>

<div class="lg:col-span-1 space-y-6">
<ExpandableCard :expanded="true">
<template #header>Status</template>
<div class="p-4">
<ToggleSwitch v-model="form.is_active" label="Activate Job Opening" description="Inactive openings will not be visible to applicants." />
</div>
</ExpandableCard>
</div>
</div>
</template>