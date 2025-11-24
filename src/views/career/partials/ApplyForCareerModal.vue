<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import type { JobOpening } from '@/types';
import { XIcon, CheckCircleIcon, Loader2Icon } from 'lucide-vue-next';
import { useCareerAPI } from '@/composables/fetch-public-apis/useCareerAPI';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    job: { type: Object as PropType<JobOpening | null>, default: null },
});

const emit = defineEmits(['close']);

const { isSubmitting, applyForJob } = useCareerAPI();

const form = reactive({
    name: '', email: '', phone: '', cover_letter: '', resume: null as File | null,
});
const errors = ref<Record<string, string[]>>({});
const submissionSuccess = ref(false);

const handleSubmit = async () => {
    if (!props.job) return;
    errors.value = {};
    const result = await applyForJob(props.job.id, { ...form, job_opening_id: props.job.id });
    if (result === true) {
        submissionSuccess.value = true;
    } else if (result) {
        errors.value = result;
    }
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        submissionSuccess.value = false;
        errors.value = {};
        Object.assign(form, { name: '', email: '', phone: '', cover_letter: '', resume: null });
    }
});
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen" @click="emit('close')" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div @click.stop class="auth-card w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div class="auth-card-content">
                    <!-- Success State -->
                    <div v-if="submissionSuccess" class="p-8 md:p-12 text-center">
                        <CheckCircleIcon class="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h2 class="text-2xl font-bold section-title">Application Submitted!</h2>
                        <p class="mt-2 text-muted">Thank you for your interest. We have received your application and will be in touch if your qualifications match our needs.</p>
                        <button @click="emit('close')" class="btn btn-primary mt-6">Close</button>
                    </div>

                    <!-- Form State -->
                    <template v-else>
                        <header class="p-6 border-b border-muted flex justify-between items-center">
                            <div>
                                <h2 class="text-xl font-bold section-title">Apply for {{ job?.title }}</h2>
                                <p class="text-sm text-muted">{{ job?.department }} &middot; {{ job?.location }}</p>
                            </div>
                            <button @click="emit('close')" class="btn btn-icon section-title"><XIcon /></button>
                        </header>

                        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto">
                            <div class="grid sm:grid-cols-2 gap-4">
                                <label class="block">
                                    <span class="label">Full Name</span>
                                    <input type="text" v-model="form.name" required class="input mt-1" :class="{'invalid-input': errors.name}" />
                                    <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
                                </label>
                                <label class="block">
                                    <span class="label">Email Address</span>
                                    <input type="email" v-model="form.email" required class="input mt-1" :class="{'invalid-input': errors.email}" />
                                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</p>
                                </label>
                            </div>
                            <label class="block">
                                <span class="label">Phone Number</span>
                                <input type="tel" v-model="form.phone" required class="input mt-1" :class="{'invalid-input': errors.phone}" />
                                <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone[0] }}</p>
                            </label>
                            <label class="block">
                                <span class="label">Upload CV/Resume (PDF, DOC, DOCX - Max 5MB)</span>
                                <!-- Basic file input, replace with a styled component if you have one -->
                                <input type="file" @change="e => form.resume = (e.target as HTMLInputElement).files?.[0] ?? null" required accept=".pdf,.doc,.docx" class="input mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" :class="{'invalid-input': errors.resume}"/>
                                <p v-if="errors.resume" class="text-red-500 text-sm mt-1">{{ errors.resume[0] }}</p>
                            </label>
                            <label class="block">
                                <span class="label">Cover Letter (Optional)</span>
                                <textarea v-model="form.cover_letter" :rows="4" class="input mt-1" :class="{'invalid-input': errors.cover_letter}" placeholder="Tell us why you're a great fit for this role..."></textarea>
                                <p v-if="errors.cover_letter" class="text-red-500 text-sm mt-1">{{ errors.cover_letter[0] }}</p>
                            </label>
                        </form>

                        <footer class="p-6 mt-auto border-t border-muted">
                            <button type="submit" @click="handleSubmit" class="w-full btn btn-primary" :disabled="isSubmitting">
                                <Loader2Icon v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                                <span v-else>Submit Application</span>
                            </button>
                        </footer>
                    </template>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference "@/assets/css/main.css";
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>