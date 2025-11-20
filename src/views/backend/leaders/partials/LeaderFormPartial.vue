<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import ExpandableCard from '@/components/card/ExpandableCard.vue';
import JsonInput from "@/components/form/JsonInput.vue";
import type { LeaderFormData } from "@/types";
import { onMounted } from "vue";

const props = defineProps<{
    form: LeaderFormData;
    errors: Record<string, string[]>;
    isEdit: boolean;
    dirtyFields?: Record<string, boolean>;
}>();

// onMounted(console.log(props.form));
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Core Information</template>
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TextInput label="Full Name" v-model="form.name" :error="errors.name?.[0]"
                            :is-dirty="dirtyFields?.name" required />
                        <TextInput label="Position / Role" v-model="form.position" :error="errors.position?.[0]"
                            :is-dirty="dirtyFields?.position" required />
                    </div>
                    <TextInput label="Title" v-model="form.title" :error="errors.title?.[0]"
                        :is-dirty="dirtyFields?.title" placeholder="e.g., PhD, MBA" />
                    <TextareaInput label="Quote" v-model="form.quote" :error="errors.quote?.[0]"
                        :is-dirty="dirtyFields?.quote" :rows="2" placeholder="An inspirational quote." />
                    <TextareaInput label="Biography" v-model="form.bio" :error="errors.bio?.[0]"
                        :is-dirty="dirtyFields?.bio" :rows="5" />
                    <TextareaInput label="Message from Leader" v-model="form.message" :error="errors.message?.[0]"
                        :is-dirty="dirtyFields?.message" :rows="5" />
                </div>
            </ExpandableCard>

            <ExpandableCard :expanded="true">
                <template #header>Additional Details</template>
                <div class="p-4 space-y-6">
                    <JsonInput label="Education" v-model="form.education" :error="errors.education?.[0]"
                        :is-dirty="dirtyFields?.education"
                        hint='Enter as a JSON array. E.g., [{"degree": "B.Sc.", "field": "Chemistry"}]' />
                    <JsonInput label="Career Highlights" v-model="form.career_highlights"
                        :error="errors.career_highlights?.[0]" :is-dirty="dirtyFields?.career_highlights"
                        hint='Enter as a JSON array. E.g., [{"role": "CEO", "company": "ABC Inc."}]' />
                </div>
            </ExpandableCard>
        </div>

        <div class="lg:col-span-1 space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Media & Socials</template>
                <div class="p-4 space-y-6">
                    <div v-if="isEdit && form.image_url" class="mb-4">
                        <label class="label mb-1">Current Image</label>
                        <img :src="form.image_url" alt="Current leader image"
                            class="w-full h-auto rounded-lg border object-contain bg-white">
                    </div>
                    <FileInput label="Profile Image" v-model="form.image" :error="errors.image?.[0]"
                        :is-dirty="dirtyFields?.image" accept="image/jpeg,image/png,image/webp" />
                    <JsonInput label="Social Links" v-model="form.socials" :error="errors.socials?.[0]"
                        :is-dirty="dirtyFields?.socials" hint='E.g., { "linkedin": "...", "twitter": "..." }'
                        required />
                </div>
            </ExpandableCard>
        </div>
    </div>
</template>