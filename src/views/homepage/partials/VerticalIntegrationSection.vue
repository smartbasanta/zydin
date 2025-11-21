<script setup lang="ts">
import { FlaskConical, Pilcrow, ShieldCheck } from 'lucide-vue-next';


</script>
<template>
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg vertical-section">
        <div class="vertical-section__glow vertical-section__glow--primary" aria-hidden="true"></div>
        <div class="vertical-section__glow vertical-section__glow--secondary" aria-hidden="true"></div>
        <div class="vertical-section__grid" aria-hidden="true"></div>
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

<style scoped>
@reference "@/assets/css/main.css";

.vertical-section {
  position: relative;
}
.vertical-section__grid {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: linear-gradient(120deg, color-mix(in srgb, var(--section-title-color) 10%, transparent) 1px, transparent 1px);
  background-size: 120px 120px;
}
.vertical-section__glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.35;
  pointer-events: none;
}
.vertical-section__glow--primary {
  top: -60px;
  right: 15%;
  background: var(--gradient-secondary);
}
.vertical-section__glow--secondary {
  bottom: -80px;
  left: 10%;
  background: var(--gradient-accent);
}

.card-icon-feature {
  background-color: color-mix(in srgb, var(--section-bg) 80%, transparent);
  border-color: color-mix(in srgb, var(--section-title-color) 20%, transparent);
  box-shadow: 0 25px 55px -35px color-mix(in srgb, var(--section-title-color) 40%, transparent);
}
.card-icon-feature h3 {
  color: var(--section-title-color);
}
.card-icon-feature p {
  color: var(--section-text-color);
}
</style>
