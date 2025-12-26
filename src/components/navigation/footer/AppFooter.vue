<script setup lang="ts">
import AppLogo from '@/components/logo/AppLogo.vue';
import AppLogoAnimation from '@/components/logo/AppLogoAnimation.vue';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { zydinLogoImage } = useDefaultImages(); // 2. Get the images you need
</script>

<template>
    <footer class="footer-shell relative print:hidden">
        <div class="footer-shell__content container mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Main Footer Content -->
            <div class="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

                <!-- Column 1: Brand & Socials -->
                <div class="lg:col-span-4">
                    <a href="/" class="inline-block mb-4">
                        <!-- Using the same logo component from the header for consistency -->
                        <div class="flex items-center space-x-3 group">
                            <!-- <AppLogo class="size-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]" /> -->
                            <!-- <div class="size-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]">
                                Z
                            </div> -->
                            <div class="w-18 max-w-lg mx-auto mr-2">
                                <div class="relative aspect-square">
                                    <AppLogoAnimation :glow="false" :animation="true" />
                                </div>
                            </div>
                            <!-- <img :src="zydinLogoImage" class="w-18" /> -->
                            <div class="block">
                                <div class="font-bold text-3xl text-white">
                                    Zydin Biotech
                                </div>
                                <div class="flex items-center justify-end gap-1.5">
                                    <div
                                        class="h-px w-8 rounded-full bg-gradient-to-r from-primary-400 to-transparent">
                                    </div>
                                    <div
                                        class="text-xs font-bold tracking-wider text-primary-400">
                                        Hope for Life</div>
                                </div>
                            </div>
                        </div>
                    </a>
                    <p class="text-sm leading-relaxed max-w-sm footer-text">
                        Zydin Biotech is a dedicated oncology company, established with the vision of advancing from synthetic to biopharmaceutical medicines to address affordable and unmet medical needs through targeted delivery. The company’s current focus is to drive innovation across each onco-therapeutic segment by developing dosage forms designed to enhance efficacy, safety, and cost-effectiveness
                    </p>
                    <div class="mt-6 flex items-center gap-4">
                        <a href="#" class="footer-social-link" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-5 h-5">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-5 h-5">
                                <path
                                    d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1 1.4-12.1 6.1-12.1 6.1v2c-2.4-.6-4.6-2.4-4.6-2.4l1.3-1.3c2.7-1.3 5.4-3.3 5.4-3.3s-2.1.2-4.6-.9c-2.4-1-4.6-4.6-4.6-4.6s1.3.6 2.7.6c-2.7-1.3-4-4.6-4-4.6s2.7 2.1 5.4 2.7c-2.7-2.7-2.7-5.4-2.7-5.4s2.1 1.4 4.6 2.7c1.3-.6 2.7-1.3 4-1.3z">
                                </path>
                            </svg>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-5 h-5">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Spacer Column -->
                <div class="hidden lg:block lg:col-span-1"></div>

                <!-- Link Columns -->
                <div class="lg:col-span-7 grid grid-cols-3 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="footer-heading">Company</h3>
                        <ul class="mt-4 space-y-3">
                            <li><a href="#" class="footer-link">Home</a></li>
                            <li><a href="#" class="footer-link">service</a></li>
                            <li><a href="#" class="footer-link">About Us</a></li>
                            <li><a href="#" class="footer-link">Leaderships</a></li>
                            <li><a href="#" class="footer-link">Programs</a></li>
                            <li><a href="#" class="footer-link">Products</a></li>
                            <li><a href="#" class="footer-link">News & Articles</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="footer-heading">Support</h3>
                        <ul class="mt-4 space-y-3">
                            <li><a href="#" class="footer-link">Contact Us</a></li>
                            <li><a href="#" class="footer-link">FAQs</a></li>
                            <li><a href="#" class="footer-link">Report a Bug</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="footer-heading">Invester Relationship</h3>
                        <ul class="mt-4 space-y-3">
                            <li><a href="#" class="footer-link">Overview</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="footer-heading">Legal</h3>
                        <ul class="mt-4 space-y-3">
                            <li><a href="#" class="footer-link">Terms of Service</a></li>
                            <li><a href="#" class="footer-link">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div
                class="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
                :style="{ borderColor: 'var(--footer-border)' }">
                <p class="text-sm text-center sm:text-left">
                    © {{ new Date().getFullYear() }} Zydin Biotech. All rights reserved.
                </p>
                <p class="text-sm text-center sm:text-right">
                    Built for Users, by Users.
                </p>
            </div>
        </div>
    </footer>
</template>

