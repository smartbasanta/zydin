<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '@/components/form/TextInput.vue';
import TextareaInput from '@/components/form/TextareaInput.vue';
import { MailIcon, MapPinIcon, PhoneIcon, Loader2Icon, CheckCircleIcon } from 'lucide-vue-next';
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
    <div class="section-bg">
        <!-- Modern Hero Header -->
        <header class="contact-hero">
            <div class="contact-hero__glow contact-hero__glow--primary" aria-hidden="true"></div>
            <div class="contact-hero__glow contact-hero__glow--secondary" aria-hidden="true"></div>
            <div class="container mx-auto px-6 py-20 md:py-28 text-center relative z-10">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg">Get In Touch</h1>
                <p class="max-w-3xl mx-auto mt-4 text-lg text-white/90 text-shadow-md">
                    We welcome your inquiries. Whether you are a healthcare professional, potential partner, or a member of the community, we'd love to hear from you.
                </p>
            </div>
        </header>

        <!-- Main Content Grid -->
        <main class="container grid lg:grid-cols-5 gap-12 md:gap-16 px-6 py-20 md:py-28 mx-auto">
            
            <!-- Left Column: Contact Information & Map -->
            <div class="lg:col-span-2 space-y-8">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold section-title mb-6">Contact Information</h2>
                    <div class="space-y-6">
                        <div class="contact-item">
                            <div class="contact-item__icon">
                                <MapPinIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="contact-item__title">Our Address</h3>
                                <p class="contact-item__text">Pharmaceutical Park, Chitwan, Nepal</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-item__icon">
                                <MailIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="contact-item__title">General Inquiries</h3>
                                <a href="mailto:info@zydinbiotech.com" class="contact-item__link">info@zydinbiotech.com</a>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-item__icon">
                                <PhoneIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="contact-item__title">Call Us</h3>
                                <a href="tel:+977000000000" class="contact-item__link">+977-XXX-XXXXXX</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aspect-w-16 aspect-h-9 w-full rounded-2xl overflow-hidden shadow-lg border border-muted">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113110.19890184288!2d84.3621453972656!3d27.625340000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994454f05920f6b%3A0x91d31980898565f5!2sChitwan%20National%20Park!5e0!3m2!1sen!2snp!4v1678886453123!5m2!1sen!2snp"
                        width="100%" height="100%" style="border:0;" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>

            <!-- Right Column: Contact Form -->
            <div class="lg:col-span-3">
                <div class="auth-card">
                    <div class="auth-card-content p-8 md:p-10">
                        <h2 class="text-2xl md:text-3xl font-bold section-title mb-6">Send Us a Message</h2>
                        
                        <div v-if="formSuccess" class="flex flex-col items-center justify-center text-center p-8 bg-green-500/10 rounded-xl">
                             <CheckCircleIcon class="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <p class="font-semibold section-title">Message Sent Successfully!</p>
                            <p class="text-muted">Thank you for contacting us. We will get back to you shortly.</p>
                        </div>

                        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                            <TextInput label="Full Name" type="text" v-model="form.name" required :error="formErrors.name?.[0]" />
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <TextInput label="Email Address" type="email" v-model="form.email" required :error="formErrors.email?.[0]" />
                                <TextInput label="Phone Number" type="tel" v-model="form.phone" :error="formErrors.phone?.[0]" />
                            </div>
                            <TextInput label="Subject" type="text" v-model="form.subject" required :error="formErrors.subject?.[0]" />
                            <TextareaInput label="Your Message" v-model="form.message" :rows="5" required :error="formErrors.message?.[0]" />
                            <div>
                                <button type="submit" class="btn btn-primary w-full sm:w-auto" :disabled="isSubmitting">
                                    <Loader2Icon v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                                    <span v-else>Send Message</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.contact-hero {
    position: relative;
    overflow: hidden;
    background-image: var(--gradient-hero);
}

.contact-hero__glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(120px);
    pointer-events: none;
}
.contact-hero__glow--primary {
    background: var(--gradient-accent);
    width: 350px; height: 350px;
    top: -100px; left: -100px; opacity: 0.4;
}
.contact-hero__glow--secondary {
    background: var(--gradient-secondary);
    width: 300px; height: 300px;
    bottom: -100px; right: -50px; opacity: 0.3;
}
.text-shadow-lg { text-shadow: 0 4px 15px rgba(0,0,0,0.4); }
.text-shadow-md { text-shadow: 0 2px 5px rgba(0,0,0,0.3); }

.contact-item {
    @apply flex items-start gap-4;
}
.contact-item__icon {
    @apply flex-shrink-0 grid place-content-center size-12 rounded-xl;
    background-image: var(--gradient-primary);
}
.contact-item__title {
    @apply font-bold section-title;
}
.contact-item__text {
    @apply text-muted;
}
.contact-item__link {
    @apply text-muted transition-colors duration-200;
}
.contact-item__link:hover {
    color: var(--color-primary-500);
}
</style>