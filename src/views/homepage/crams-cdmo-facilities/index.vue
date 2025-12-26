<script setup lang="ts">
import { Factory, Handshake, Cog, Shield, Users, Globe, Zap, Award, TrendingUp, CheckCircle } from 'lucide-vue-next';
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
                  CRAMS & CDMO Facilities
                </h1>
                <p class="mb-8 text-base md:text-lg lg:text-xl section-description font-medium leading-relaxed drop-shadow-md max-w-2xl">
                  Zydin's CRAMS/CDMO facilities play a major role in the pharmaceutical industry by offering comprehensive services including both contract research and manufacturing, enabling companies to outsource diverse functions for greater flexibility, operational efficiency, and cost optimization.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <RouterLink to="/contact" class="btn btn-primary">
                    Explore Our Services
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

    <!-- SERVICES OVERVIEW -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
      <div class="container px-6 mx-auto text-center relative z-10">
        <div class="max-w-4xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Comprehensive CRAMS/CDMO Solutions
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            From concept to commercialization, our integrated approach provides clients with the flexibility, expertise, and resources needed to bring innovative pharmaceutical products to market efficiently.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Contract Research -->
          <div class="card-backdrop card-icon-feature p-6 md:p-8 text-center">
            <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-primary shadow-lg">
              <Cog :size="40" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-3 text-lg md:text-xl font-bold section-title tracking-tight">Contract Research</h3>
            <p class="text-sm section-text leading-relaxed font-medium max-w-xs mx-auto mb-4">
              Advanced research capabilities spanning from early discovery to preclinical development.
            </p>
            <div class="space-y-1 text-xs section-text">
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Drug Discovery</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Analytical Development</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Formulation Studies</span>
              </div>
            </div>
          </div>

          <!-- Contract Manufacturing -->
          <div class="card-backdrop card-icon-feature p-6 md:p-8 text-center">
            <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-secondary shadow-lg">
              <Factory :size="40" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-3 text-lg md:text-xl font-bold section-title tracking-tight">Contract Manufacturing</h3>
            <p class="text-sm section-text leading-relaxed font-medium max-w-xs mx-auto mb-4">
              Full-scale manufacturing capabilities from small batch to commercial production.
            </p>
            <div class="space-y-1 text-xs section-text">
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>GMP Production</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Scale-Up Services</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Quality Control</span>
              </div>
            </div>
          </div>

          <!-- Regulatory Compliance -->
          <div class="card-backdrop card-icon-feature p-6 md:p-8 text-center">
            <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-accent shadow-lg">
              <Shield :size="40" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-3 text-lg md:text-xl font-bold section-title tracking-tight">Regulatory Compliance</h3>
            <p class="text-sm section-text leading-relaxed font-medium max-w-xs mx-auto mb-4">
              Comprehensive regulatory support ensuring compliance across global markets.
            </p>
            <div class="space-y-1 text-xs section-text">
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>FDA/EMA Submissions</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Documentation</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Audit Support</span>
              </div>
            </div>
          </div>

          <!-- Commercial Manufacturing -->
          <div class="card-backdrop card-icon-feature p-6 md:p-8 text-center">
            <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-primary shadow-lg">
              <TrendingUp :size="40" class="text-white drop-shadow-lg" />
            </div>
            <h3 class="mb-3 text-lg md:text-xl font-bold section-title tracking-tight">Commercial Manufacturing</h3>
            <p class="text-sm section-text leading-relaxed font-medium max-w-xs mx-auto mb-4">
              Scalable commercial production with global distribution capabilities.
            </p>
            <div class="space-y-1 text-xs section-text">
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Large-Scale Production</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Supply Chain</span>
              </div>
              <div class="flex items-center justify-center gap-1">
                <CheckCircle class="w-3 h-3" />
                <span>Global Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg vertical-section">
      <div class="vertical-section__glow vertical-section__glow--primary" aria-hidden="true"></div>
      <div class="vertical-section__glow vertical-section__glow--secondary" aria-hidden="true"></div>
      <div class="vertical-section__grid" aria-hidden="true"></div>
      
      <div class="container px-6 mx-auto relative z-10">
        <div class="max-w-4xl mx-auto mb-16 text-center">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Why Partner with Zydin CRAMS/CDMO?
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our integrated approach provides clients with unmatched flexibility, operational efficiency, and cost optimization across the entire pharmaceutical value chain.
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary">
              <Zap class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">Speed to Market</h3>
            <p class="text-sm section-text">
              Accelerated development timelines through our streamlined processes and established infrastructure.
            </p>
          </div>
          
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-secondary">
              <Award class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">Quality Excellence</h3>
            <p class="text-sm section-text">
              Proven track record of quality and regulatory compliance across global markets.
            </p>
          </div>
          
          <div class="card-backdrop p-6 text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-accent">
              <Users class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold section-title mb-3">Expert Partnership</h3>
            <p class="text-sm section-text">
              Collaborative approach with dedicated project management and technical expertise.
            </p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <Globe class="w-6 h-6 text-blue-500" />
                <h3 class="text-xl font-bold section-title">Global Reach</h3>
              </div>
              <p class="section-text">
                Serving clients worldwide with facilities and expertise that meet international regulatory requirements and standards.
              </p>
            </div>
            
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <Handshake class="w-6 h-6 text-green-500" />
                <h3 class="text-xl font-bold section-title">Flexible Solutions</h3>
              </div>
              <p class="section-text">
                Customizable service packages tailored to meet specific client needs, from early-stage development to commercial manufacturing.
              </p>
            </div>
            
            <div class="card-backdrop p-6">
              <div class="flex items-center gap-3 mb-3">
                <TrendingUp class="w-6 h-6 text-purple-500" />
                <h3 class="text-xl font-bold section-title">Cost Optimization</h3>
              </div>
              <p class="section-text">
                Efficient resource utilization and economies of scale that reduce overall development and manufacturing costs.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="card-backdrop p-8 text-center">
              <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Handshake class="w-16 h-16 text-white" />
              </div>
              <h3 class="text-2xl font-bold section-title mb-4">Your Success is Our Mission</h3>
              <p class="section-text mb-6">
                Partner with us to leverage our comprehensive CRAMS/CDMO capabilities and accelerate your pharmaceutical development journey from concept to commercialization.
              </p>
              <RouterLink to="/contact" class="btn btn-primary">
                Start Your Partnership
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INDUSTRY IMPACT -->
    <section class="py-20 md:py-28 relative overflow-hidden clip-path-section section-bg">
      <div class="container px-6 mx-auto">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Major Industry Impact
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto">
            Our CRAMS/CDMO facilities are transforming the pharmaceutical industry by providing comprehensive solutions that enable companies to focus on their core competencies while we handle the complexities of development and manufacturing.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="card-backdrop p-8">
            <h3 class="text-2xl font-bold section-title mb-4">Comprehensive Service Portfolio</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <CheckCircle class="w-5 h-5 text-green-500" />
                <span class="section-text">Research & Development Services</span>
              </li>
              <li class="flex items-center gap-3">
                <CheckCircle class="w-5 h-5 text-green-500" />
                <span class="section-text">Scale-Up & Process Development</span>
              </li>
              <li class="flex items-center gap-3">
                <CheckCircle class="w-5 h-5 text-green-500" />
                <span class="section-text">Commercial Manufacturing</span>
              </li>
              <li class="flex items-center gap-3">
                <CheckCircle class="w-5 h-5 text-green-500" />
                <span class="section-text">Regulatory Support & Compliance</span>
              </li>
            </ul>
          </div>
          
          <div class="card-backdrop p-8">
            <h3 class="text-2xl font-bold section-title mb-4">Client Benefits</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <Zap class="w-5 h-5 text-blue-500" />
                <span class="section-text">Greater Flexibility & Agility</span>
              </li>
              <li class="flex items-center gap-3">
                <TrendingUp class="w-5 h-5 text-blue-500" />
                <span class="section-text">Operational Efficiency</span>
              </li>
              <li class="flex items-center gap-3">
                <Award class="w-5 h-5 text-blue-500" />
                <span class="section-text">Cost Optimization</span>
              </li>
              <li class="flex items-center gap-3">
                <Shield class="w-5 h-5 text-blue-500" />
                <span class="section-text">Risk Mitigation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="py-20 md:py-28 relative overflow-hidden section-bg">
      <div class="container px-6 mx-auto text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl lg:text-5xl section-title tracking-tight mb-6">
            Ready to Accelerate Your Development?
          </h2>
          <p class="text-sm md:text-md lg:text-lg section-description max-w-7xl mx-auto mb-8">
            Leverage our comprehensive CRAMS/CDMO capabilities to streamline your pharmaceutical development and manufacturing needs.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/contact" class="btn btn-primary">
              Schedule Consultation
            </RouterLink>
            <RouterLink to="/about" class="btn btn-glass">
              Explore Our Facilities
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
