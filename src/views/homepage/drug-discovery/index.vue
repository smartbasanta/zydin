<script setup lang="ts">
import { FlaskConical, Microscope, Factory, Shield, Beaker, Zap } from 'lucide-vue-next';
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
                  Drug Discovery Excellence
                </h1>
                <p class="mb-8 text-base md:text-lg lg:text-xl section-description font-medium leading-relaxed drop-shadow-md max-w-2xl">
                  Pioneering synthetic chemistry and advanced R&D services to accelerate drug discovery, evaluate materials, and establish cost-effective production routes—ultimately contributing to the health and well-being of society.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <RouterLink to="/contact" class="btn btn-primary">
                    Explore Services
                  </RouterLink>
                  <RouterLink to="/about" class="btn btn-glass">
                    Learn More
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES OVERVIEW -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
      <div class="container px-6 mx-auto text-center relative z-10">
        <div class="max-w-4xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Comprehensive Drug Discovery Solutions
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            From early-stage research to GMP manufacturing, our integrated approach ensures seamless transitions and consistent quality throughout the development lifecycle.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Synthetic Chemistry -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
              <FlaskConical :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Synthetic Chemistry</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              Advanced synthetic chemistry providing vital tools and techniques for drug synthesis, material evaluation, and cost-effective production routes.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Beaker class="w-4 h-4" />
                <span>Molecular Design & Synthesis</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Microscope class="w-4 h-4" />
                <span>Process Optimization</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Zap class="w-4 h-4" />
                <span>Route Development</span>
              </div>
            </div>
          </div>

          <!-- Non-GMP Kilo Lab -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-secondary shadow-lg">
              <Factory :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">Non-GMP Kilo Lab Service</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              Seamless transitions from non-GMP to GMP facilities, enabling smooth progression between development and GMP phases for early-stage development.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Shield class="w-4 h-4" />
                <span>Early-Stage Development</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Zap class="w-4 h-4" />
                <span>Rapid Prototyping</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Microscope class="w-4 h-4" />
                <span>Process Validation</span>
              </div>
            </div>
          </div>

          <!-- GMP Kilo Lab -->
          <div class="card-backdrop card-icon-feature p-8 md:p-10 text-center">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-accent shadow-lg">
              <Shield :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-xl md:text-2xl font-bold section-title tracking-tight">GMP Kilo Lab Service</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-sm mx-auto mb-6">
              State-of-the-art facilities capable of handling diverse chemical syntheses with advanced reactor systems for scale-up and technical validations.
            </p>
            <div class="space-y-2 text-sm section-text">
              <div class="flex items-center justify-center gap-2">
                <Beaker class="w-4 h-4" />
                <span>Hydrogenation & Alkylation</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Zap class="w-4 h-4" />
                <span>Azo Coupling & Cyclization</span>
              </div>
              <div class="flex items-center justify-center gap-2">
                <Shield class="w-4 h-4" />
                <span>Distillation & Purification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TECHNICAL CAPABILITIES -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg vertical-section">
      <div class="vertical-section__glow vertical-section__glow--primary" aria-hidden="true"></div>
      <div class="vertical-section__glow vertical-section__glow--secondary" aria-hidden="true"></div>
      <div class="vertical-section__grid" aria-hidden="true"></div>
      
      <div class="container px-6 mx-auto relative z-10">
        <div class="max-w-4xl mx-auto mb-16 text-center">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Advanced Reactor Systems
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our cutting-edge reactor technologies ensure high-quality production while maintaining strict safety and environmental standards.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Hastelloy Reactors</h3>
              <p class="section-text">
                High for demanding-temperature resistant reactors designed chemical processes with excellent corrosion resistance and durability.
              </p>
            </div>
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Glass Lined Reactors</h3>
              <p class="section-text">
                Superior chemical resistance against acids, alkalis, and solvents, ensuring product purity and process integrity.
              </p>
            </div>
            <div class="card-backdrop p-6">
              <h3 class="text-xl font-bold section-title mb-3">Scale-Up Capabilities</h3>
              <p class="section-text">
                Seamless progression from laboratory scale to commercial production with validated processes and quality assurance.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="card-backdrop p-8 text-center">
              <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Factory class="w-16 h-16 text-white" />
              </div>
              <h3 class="text-2xl font-bold section-title mb-4">Manufacturing Excellence</h3>
              <p class="section-text mb-6">
                Our facilities are ideally suited for scale-up and technical validations, ensuring high-quality production while strictly adhering to safety and environmental standards.
              </p>
              <RouterLink to="/contact" class="btn btn-primary">
                Schedule Consultation
              </RouterLink>
            </div>
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
</style>
