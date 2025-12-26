<script setup lang="ts">
import { Pill, Factory, Shield, Zap, Award, Globe } from 'lucide-vue-next';
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- HERO SECTION -->
    <section class="relative w-full h-[75vh] min-h-[500px] md:h-[80vh] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-hero clip-path-hero"></div>
      <div class="absolute inset-0 hero-grid-overlay" aria-hidden="true"></div>
      <div class="hero-glow hero-glow--one" aria-hidden="true"></div>
      <div class="hero-glow hero-glow--two" aria-hidden="true"></div>

      <div class="relative z-20 flex items-center w-full h-full">
        <div class="container px-6 mx-auto">
          <div class="max-w-4xl md:ml-8 lg:ml-16">
            <div class="card-backdrop">
              <div class="relative z-10">
                <h1 class="mb-6 text-3xl md:text-4xl lg:text-5xl leading-tight section-title font-bold tracking-tight drop-shadow-lg">
                  Drug Substance Development & Manufacturing
                </h1>
                <p class="mb-8 text-base md:text-lg lg:text-xl section-description font-medium leading-relaxed drop-shadow-md max-w-2xl">
                  Specialized manufacturing of highly potent APIs with dedicated facilities supporting the entire journey from early development to commercial manufacture across therapeutic areas, serving regulatory markets including the EU and US.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <RouterLink to="/contact" class="btn btn-primary">
                    Explore Capabilities
                  </RouterLink>
                  <RouterLink to="/about" class="btn btn-glass">
                    View Facilities
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CAPABILITIES OVERVIEW -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
      <div class="container px-6 mx-auto text-center relative z-10">
        <div class="max-w-4xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Speciality Highly Potent API Manufacturing
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our dedicated facilities for highly potent APIs emphasize our responsibility to uphold quality and safety, contributing to a healthier society through comprehensive development and manufacturing services.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Development Excellence -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
              <Zap :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Early Development</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              Comprehensive support from early development phases with cutting-edge research and development capabilities.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Pill class="w-4 h-4" />
                <span>Molecule Optimization</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Shield class="w-4 h-4" />
                <span>Safety Assessment</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Award class="w-4 h-4" />
                <span>Regulatory Strategy</span>
              </div>
            </div>
          </div>

          <!-- Commercial Manufacturing -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-secondary shadow-lg">
              <Factory :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Commercial Manufacturing</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              Scalable production capabilities ensuring consistent quality and regulatory compliance for global markets.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Pill class="w-4 h-4" />
                <span>Scale-Up Production</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Shield class="w-4 h-4" />
                <span>Quality Assurance</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Award class="w-4 h-4" />
                <span>GMP Compliance</span>
              </div>
            </div>
          </div>

          <!-- Regulatory Markets -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-accent shadow-lg">
              <Globe :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Regulatory Markets</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              Serving major regulatory markets including EU and US with comprehensive compliance and documentation support.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Shield class="w-4 h-4" />
                <span>EU Market Access</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Award class="w-4 h-4" />
                <span>FDA Compliance</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Globe class="w-4 h-4" />
                <span>Global Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUALITY & SAFETY COMMITMENT -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg vertical-section">
      <div class="vertical-section__glow vertical-section__glow--primary" aria-hidden="true"></div>
      <div class="vertical-section__glow vertical-section__glow--secondary" aria-hidden="true"></div>
      <div class="vertical-section__grid" aria-hidden="true"></div>
      
      <div class="container px-6 mx-auto relative z-10">
        <div class="max-w-4xl mx-auto mb-16 text-center">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Quality & Safety Commitment
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our commitment to upholding quality and safety standards is central to our operations, directly contributing to patient health and well-being.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div class="card-backdrop p-8 text-center">
              <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Shield class="w-16 h-16 text-white" />
              </div>
              <h3 class="text-2xl font-bold section-title mb-4">Protecting Patient Health</h3>
              <p class="section-text mb-6">
                Every step of our development, manufacturing, and monitoring processes is firmly grounded in our commitment to protect patients and safeguard consumer health by ensuring the quality and safety of our products.
              </p>
              <RouterLink to="/about/certifications" class="btn btn-primary">
                View Certifications
              </RouterLink>
            </div>
          </div>
          
          <div class="space-y-8">
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Therapeutic Areas</h3>
              <p class="section-text">
                Comprehensive coverage across multiple therapeutic areas with specialized expertise in highly potent APIs for targeted treatments.
              </p>
            </div>
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Quality Control</h3>
              <p class="section-text">
                Rigorous quality control measures and advanced analytical testing ensure consistent product quality and regulatory compliance.
              </p>
            </div>
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Supply Chain Excellence</h3>
              <p class="section-text">
                Integrated supply chain management ensuring reliable delivery and maintaining product integrity throughout the manufacturing process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="py-20 md:py-28 relative overflow-hidden section-bg">
      <div class="container px-6 mx-auto text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Ready to Partner with Us?
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto mb-8">
            Let us support your highly potent API development and manufacturing needs with our dedicated facilities and expertise.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/contact" class="btn btn-primary">
              Schedule Consultation
            </RouterLink>
            <RouterLink to="/products" class="btn btn-glass">
              View Portfolio
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.hero-grid-overlay {
  background-image:
    linear-gradient(0deg, color-mix(in srgb, var(--color-gray-0) 4%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-gray-0) 4%, transparent) 1px, transparent 1px);
  background-size: 120px 120px;
  mix-blend-mode: soft-light;
}

.hero-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}
.hero-glow--one {
  width: 320px;
  height: 320px;
  top: 10%;
  right: 15%;
  background: var(--gradient-secondary);
}
.hero-glow--two {
  width: 260px;
  height: 260px;
  bottom: 5%;
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
</style>
