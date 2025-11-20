<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import type { JobOpening } from '@/types';
import { XIcon, CheckCircleIcon } from 'lucide-vue-next';

// Import your custom form components
import TextInput from '@/components/form/TextInput.vue';
import TextareaInput from '@/components/form/TextareaInput.vue';
import FileInput from '@/components/form/FileInput.vue'; // We will use this for the resume
import { useCareerAPI } from '@/composables/fetch-public-apis/useCareerAPI';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    job: { type: Object as PropType<JobOpening | null>, default: null },
});

const emit = defineEmits(['close']);

const { isSubmitting, applyForJob } = useCareerAPI();

const form = reactive({
    name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume: null as File | null, // The form object will now hold the file
});

const errors = ref<Record<string, string[]>>({});
const submissionSuccess = ref(false);

const handleSubmit = async () => {
    if (!props.job) return;
    errors.value = {};

    const submissionData = {
        ...form, // Copies name, email, phone, cover_letter, and the resume File object
        job_opening_id: props.job.id,
    };

    const result = await applyForJob(props.job.id, submissionData);

    if (result === true) {
        submissionSuccess.value = true;
    } else if (result) {
        errors.value = result;
    }
};

watch(() => props.isOpen, (newVal) => {
    submissionSuccess.value = false;
    errors.value = {};
    if (newVal) {
        Object.assign(form, { name: '', email: '', phone: '', cover_letter: '', resume: null });
    }
});
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen" @click="emit('close')"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div @click.stop
                class="relative bg-white dark:bg-primary-1000 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all max-h-[90vh] flex flex-col">

                <div v-if="submissionSuccess">
                    <CheckCircleIcon class="w-16 h-16 mb-4 text-green-500" />
                    <h2 class="text-2xl font-bold font-grotesk text-primary-900 dark:text-white">Application Submitted!
                    </h2>
                    <p class="mt-2 text-gray-600 dark:text-primary-300">Thank you for your interest. We have received
                        your application and will be in touch if your qualifications match our needs.</p>
                    <button @click="emit('close')" class="mt-6 btn btn-primary">Close</button>
                </div>

                <!-- Form State -->
                <template v-else>
                    <!-- Header -->
                    <div class="p-6 border-b border-primary-200 dark:border-primary-900">
                        <h2 class="text-2xl font-bold font-grotesk text-primary-900 dark:text-white">Apply for {{ job?.title }}</h2>
                        <button @click="emit('close')" class="absolute top-4 right-4 ..."><XIcon /></button>
                    </div>

                    <!-- Form Body (Scrollable) -->
                    <form @submit.prevent="handleSubmit" class="p-6 space-y-6 overflow-y-auto">
                        <TextInput 
                            label="Full Name" 
                            type="text"
                            v-model="form.name" 
                            required 
                            :error="errors.name?.[0]" 
                        />
                        <TextInput 
                            label="Email Address"
                            type="email"
                            v-model="form.email"
                            required
                            :error="errors.email?.[0]"
                        />
                         <TextInput
                            label="Phone Number"
                            type="tel"
                            v-model="form.phone"
                            required
                            :error="errors.phone?.[0]"
                        />

                        <!-- Use the FileInput component -->
                        <FileInput 
                            label="Upload CV/Resume"
                            v-model="form.resume"
                            required
                            accept=".pdf,.doc,.docx"
                            :error="errors.resume?.[0]"
                            hint="PDF, DOC, DOCX (MAX. 5MB)"
                        />

                        <TextareaInput
                            label="Cover Letter (Optional)"
                            v-model="form.cover_letter"
                            :rows="5"
                            placeholder="Tell us why you're a great fit for this role..."
                            :error="errors.cover_letter?.[0]"
                        />
                    </form>

                    <!-- Footer -->
                    <div class="p-6 mt-auto border-t border-primary-200 dark:border-primary-900">
                        <button @click="handleSubmit" class="w-full btn btn-primary" :disabled="isSubmitting">
                            <span v-if="isSubmitting">Submitting...</span>
                            <span v-else>Submit Application</span>
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference "@/assets/main.css";

.form-label {
    @apply block text-sm font-medium mb-1 text-gray-700 dark:text-primary-300;
}

.form-input {
    @apply w-full p-3 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>