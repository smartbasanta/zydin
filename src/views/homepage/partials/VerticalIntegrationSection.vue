<script setup lang="ts">
import { FlaskConical, Pilcrow, ShieldCheck } from 'lucide-vue-next';


</script>
<template>
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
        <div class="container px-6 mx-auto text-center relative z-10">
            <div class="max-w-4xl mx-auto mb-16">
                <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
                    Excellence at Every Step
                </h2>
                <p class="text-lg md:text-xl lg:text-2xl section-description max-w-3xl mx-auto">
                    From molecule to medicine, our vertical integration ensures unparalleled quality, affordability, and control over the entire pharmaceutical lifecycle.
                </p>
            </div>

            <div class="relative grid lg:grid-cols-3 gap-12 lg:gap-8">
                <!-- Card 1 -->
                <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                    <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
                        <FlaskConical :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">R&D and API Synthesis</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Innovating potent Active Pharmaceutical Ingredients in our state-of-the-art laboratories.</p>
                </div>
                <!-- Card 2 -->
                <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                     <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-secondary shadow-lg">
                        <Pilcrow :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Finished Formulation</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Transforming APIs into safe, effective, and stable finished medications with precision engineering.</p>
                </div>
                <!-- Card 3 -->
                <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                    <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-accent shadow-lg">
                        <ShieldCheck :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Quality Assurance</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Adhering to stringent GMP and international standards through rigorous testing and validation.</p>
                </div>
            </div>
        </div>
    </section>
</template>
