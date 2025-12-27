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
                <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
                  From molecule to medicine, our vertical integration ensures unparalleled quality, affordability, and control across the entire pharmaceutical product development lifecycle. At Zydin, we recognize that what we do directly impacts the health and well-being of patients. As a result, protecting patients and safeguarding consumer health by ensuring the quality and safety of our products is central to Zydin’s ethics and the way we operate within our supply chain. Every step of our development, manufacturing, and monitoring processes is firmly grounded in this commitment.
                </p>
            </div>

            <div class="relative grid lg:grid-cols-2 gap-12 lg:gap-8">
                <!-- Card 1 -->
                <router-link to="/drug-discovery"  class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                    <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
                        <FlaskConical :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Drug Discovery</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Innovating potent Active Pharmaceutical Ingredients in our state-of-the-art laboratories with comprehensive R&D services.</p>
                  </router-link>
                <!-- Card 2 -->
                <router-link to="/drug-substance-development-manufacturing"  class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                     <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-secondary shadow-lg">
                        <Pilcrow :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Drug Substance Development & Manufacturing</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Transforming APIs into safe, effective, and stable finished medications with precision engineering and GMP compliance.</p>
                  </router-link>
                <!-- Card 3 -->
                <router-link to="/oncology-drug-product"  class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                    <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-accent shadow-lg">
                        <ShieldCheck :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Oncology Drug Product Development and Manufactoring</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Advanced oral solid and sterile injectable manufacturing with dedicated isolator facilities for oncology applications.</p>
                  </router-link>
                <router-link to="/crams-cdmo-facilities"  class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
                    <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
                        <ShieldCheck :size="48" class="text-white drop-shadow-lg" />
                    </div>
                    <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">CRAMS and CDMO Facilities</h3>
                    <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto">Comprehensive contract research, development, and manufacturing services with global regulatory compliance.</p>
                  </router-link>
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
