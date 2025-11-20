<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '@/components/form/TextInput.vue';
import TextareaInput from '@/components/form/TextareaInput.vue';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-vue-next';
import { useContactAPI } from '@/composables/fetch-public-apis/useContactAPI';

const { form, isSubmitting, submitContactForm } = useContactAPI();

const formErrors = ref<Record<string, string[]>>({});
const formSuccess = ref(false);

const handleSubmit = async () => {
    formSuccess.value = false;
    formErrors.value = {};
    const result = await submitContactForm();
    if (result === true) {
        formSuccess.value = true;
    } else {
        formErrors.value = result;
    }
};
</script>

<template>
    <div class="bg-white dark:bg-primary-1200">
        <!-- Page Header -->
        <section class="py-20 text-center text-white bg-primary-1100 dark:bg-primary-1100">
            <div class="container px-4 mx-auto">
                <h1 class="text-4xl font-bold md:text-5xl font-grotesk">Get In Touch</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-primary-200">
                    We welcome your inquiries. Whether you are a healthcare professional, potential partner, or a member
                    of the community, we'd love to hear from you.
                </p>
            </div>
        </section>

        <!-- Main Content -->
        <main class="container grid gap-16 px-4 py-20 mx-auto sm:grid-cols-1 md:grid-cols-2 sm:py-24">
            <!-- Contact Form -->
            <div
                class="p-8 bg-white border rounded-lg shadow-xl lg:col-span-1 border-primary-100 dark:bg-primary-1000 dark:border-primary-900">
                <h2 class="mb-6 text-3xl font-bold font-grotesk text-primary-900 dark:text-white">Send Us a Message</h2>

                <div v-if="formSuccess"
                    class="p-4 text-green-800 bg-green-100 border-l-4 border-green-500 rounded-r-lg">
                    <p class="font-bold">Message Sent!</p>
                    <p>Thank you for contacting us. We will get back to you shortly.</p>
                </div>

                <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                    <TextInput label="Full Name" type="text" v-model="form.name" required
                        :error="formErrors.name?.[0]" />
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInput label="Email Address" type="email" v-model="form.email" required
                            :error="formErrors.email?.[0]" />
                        <TextInput label="Phone Number" type="tel" v-model="form.phone"
                            :error="formErrors.phone?.[0]" />
                    </div>
                    <TextInput label="Subject" type="text" v-model="form.subject" required
                        :error="formErrors.subject?.[0]" />
                    <TextareaInput label="Message" v-model="form.message" :rows="5" required
                        :error="formErrors.message?.[0]" />
                    <div>
                        <button type="submit" class="w-full btn btn-primary sm:w-auto" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                        </button>
                    </div>
                </form>
            </div>
            <!-- Contact Information -->
            <div>
                <h2 class="text-2xl font-bold mb-6">Contact Information</h2>
                <div class="space-y-4 mb-8">
                    <div class="flex items-start gap-4">
                        <MapPinIcon class="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 class="font-semibold">Our Address</h3>
                            <p class="text-primary-800">Pharmaceutical Park, Chitwan, Nepal</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <MailIcon class="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 class="font-semibold">General Inquiries</h3>
                            <a href="mailto:info@zydinbiotech.com"
                                class="text-primary-800 hover:underline">info@zydinbiotech.com</a>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <PhoneIcon class="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 class="font-semibold">Call Us</h3>
                            <a href="tel:+977-..." class="text-primary-800 hover:underline">+977-XXX-XXXXXX</a>
                        </div>
                    </div>
                </div>

                <!-- Embedded Map -->
                <div class="aspect-video w-full rounded-lg overflow-hidden shadow-md">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113110.19890184288!2d84.3621453972656!3d27.625340000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994454f05920f6b%3A0x91d31980898565f5!2sChitwan%20National%20Park!5e0!3m2!1sen!2snp!4v1678886453123!5m2!1sen!2snp"
                        width="100%" height="100%" style="border:0;" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </main>
    </div>
</template>