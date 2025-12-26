<script setup lang="ts">
import { Pill, Syringe, Shield, Zap, Award, Heart, ShieldCheck, Factory } from 'lucide-vue-next';
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
                  Oncology Drug Product Development
                </h1>
                <p class="mb-8 text-base md:text-lg lg:text-xl section-description font-medium leading-relaxed drop-shadow-md max-w-2xl">
                  Specialized expertise in complex oral solid dosage forms and sterile injectable manufacturing for oncology applications, advancing HPAPI drugs seamlessly from early development to commercial production within dedicated isolator facilities.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <RouterLink to="/contact" class="btn btn-primary">
                    Explore Oncology Services
                  </RouterLink>
                  <RouterLink to="/about" class="btn btn-glass">
                    View Capabilities
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DOSAGE FORMS OVERVIEW -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
      <div class="container px-6 mx-auto text-center relative z-10">
        <div class="max-w-4xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Comprehensive Oncology Dosage Forms
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            From complex oral solid formulations to advanced sterile injectable products, our expertise spans the entire spectrum of oncology drug delivery systems.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Oral Solid Dosage Forms -->
          <div class="card-backdrop p-8 md:p-10">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary shadow-lg">
              <Pill :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-2xl md:text-3xl font-bold section-title tracking-tight text-center">Oral Solid Dosage Forms</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-md mx-auto text-center mb-8">
              Extensive expertise in complex oral solid dosage form manufacturing and development, advancing HPAPI drugs seamlessly from early development to commercial production.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">Tablets & Capsules</h4>
                  <p class="text-sm section-text">Advanced formulations for precise dosing and patient compliance</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">HPAPI Integration</h4>
                  <p class="text-sm section-text">Dedicated isolator facilities for highly potent active ingredients</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">Manufacturing Excellence</h4>
                  <p class="text-sm section-text">Complete unit process control within dedicated facilities</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sterile Injectable Manufacturing -->
          <div class="card-backdrop p-8 md:p-10">
            <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-secondary shadow-lg">
              <Syringe :size="48" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-4 text-2xl md:text-3xl font-bold section-title tracking-tight text-center">Sterile Injectable Manufacturing</h3>
            <p class="text-base section-text leading-relaxed font-medium max-w-md mx-auto text-center mb-8">
              State-of-the-art sterile injectable manufacturing facilities offering cGMP production for comprehensive parenteral drug products under Class A isolator conditions.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">Sterile Liquids & Suspensions</h4>
                  <p class="text-sm section-text">Advanced parenteral formulations with precise control</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">Lyophilized Dosage Forms</h4>
                  <p class="text-sm section-text">Freeze-dried products for enhanced stability and shelf life</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-gradient-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <h4 class="font-semibold section-title">Class A Isolator Facilities</h4>
                  <p class="text-sm section-text">Complete skids ensuring highest sterility standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MANUFACTURING EXCELLENCE -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg vertical-section">
      <div class="vertical-section__glow vertical-section__glow--primary" aria-hidden="true"></div>
      <div class="vertical-section__glow vertical-section__glow--secondary" aria-hidden="true"></div>
      <div class="vertical-section__grid" aria-hidden="true"></div>
      
      <div class="container px-6 mx-auto relative z-10">
        <div class="max-w-4xl mx-auto mb-16 text-center">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            cGMP Excellence in Oncology Manufacturing
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our comprehensive approach ensures the highest standards of quality and safety in oncology drug product manufacturing.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-accent">
              <ShieldCheck class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">cGMP Compliance</h3>
            <p class="text-sm section-text">
              Strict adherence to current Good Manufacturing Practices for all oncology products.
            </p>
          </div>
          
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary">
              <Factory class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">Isolator Technology</h3>
            <p class="text-sm section-text">
              Advanced isolator facilities ensuring operator safety and product integrity.
            </p>
          </div>
          
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-secondary">
              <Award class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">Quality Assurance</h3>
            <p class="text-sm section-text">
              Comprehensive quality control throughout the entire manufacturing process.
            </p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <Heart class="w-6 h-6 text-red-500" />
                <h3 class="text-xl font-bold section-title">Patient-Centered Approach</h3>
              </div>
              <p class="section-text">
                Every product is developed with patient safety and therapeutic efficacy as our primary focus, ensuring the highest standards of care.
              </p>
            </div>
            
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <Zap class="w-6 h-6 text-yellow-500" />
                <h3 class="text-xl font-bold section-title">Rapid Development</h3>
              </div>
              <p class="section-text">
                Accelerated development timelines without compromising quality, bringing life-saving oncology treatments to market faster.
              </p>
            </div>
            
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <Shield class="w-6 h-6 text-blue-500" />
                <h3 class="text-xl font-bold section-title">Safety First</h3>
              </div>
              <p class="section-text">
                Comprehensive safety protocols protecting both patients and healthcare workers throughout the manufacturing process.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="card-backdrop p-8 text-center">
              <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Syringe class="w-16 h-16 text-white" />
              </div>
              <h3 class="text-2xl font-bold section-title mb-4">Complete Manufacturing Solutions</h3>
              <p class="section-text mb-6">
                From early development to commercial production, we provide comprehensive oncology drug product manufacturing services with unparalleled expertise and quality.
              </p>
              <RouterLink to="/contact" class="btn btn-primary">
                Partner With Us
              </RouterLink>
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
            Advancing Oncology Treatment Together
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto mb-8">
            Partner with us for comprehensive oncology drug product development and manufacturing, from concept to commercial production.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/contact" class="btn btn-primary">
              Start Your Project
            </RouterLink>
            <RouterLink to="/products" class="btn btn-glass">
              View Oncology Portfolio
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

.card-backdrop {
  background-color: color-mix(in srgb, var(--section-bg) 80%, transparent);
  border-color: color-mix(in srgb, var(--section-title-color) 20%, transparent);
  box-shadow: 0 25px 55px -35px color-mix(in srgb, var(--section-title-color) 40%, transparent);
}
.card-backdrop h3 {
  color: var(--section-title-color);
}
.card-backdrop p {
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
