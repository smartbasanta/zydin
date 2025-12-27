<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { 
  ArrowLeft,
  ShieldCheck, 
  Building2, 
  Beaker,
  Cpu,
  Globe,
  Heart,
  Clock,
  CheckCircle,
  Calendar,
  Target,
  TrendingUp,
  Users,
  MapPin,
  Award,
  FileText,
  BarChart3,
  AlertCircle
} from 'lucide-vue-next';
import { useProgramsAPI, type Program } from '@/composables/fetch-public-apis/useProgramsAPI';

const route = useRoute();
const programId = computed(() => route.params.id as string);

const {
  programs,
  isLoading: loading,
  error,
  fetchPrograms
} = useProgramsAPI();

// Get current program from the programs list - database-driven
const currentProgram = computed(() => {
  return programs.value.find(program => program.id.toString() === programId.value);
});

// Enhanced program data for detail view - database-driven
const enhancedProgram = computed(() => {
  if (!currentProgram.value) return null;
  
  const program = currentProgram.value;
  return {
    ...program,
    // Use database fields directly
    progress: program.progress_percentage,
    timeline: program.timeline,
    category: program.category,
    impact: program.impact_description,
    status: program.status_type,
    statusType: program.status_type,
    is_active: program.status,
    // Additional detail fields from database
    startDate: program.start_date,
    expectedCompletion: program.end_date,
    // Note: budget, teamSize, and other detailed data could be added to database in future
    keyMilestones: getKeyMilestones(program.title),
    stakeholders: getStakeholders(program.title),
    risks: getRiskFactors(program.title),
    deliverables: getDeliverables(program.title)
  };
});

const iconComponents = {
  ShieldCheckIcon: ShieldCheck,
  BuildingOfficeIcon: Building2,
  BeakerIcon: Beaker,
  CpuChipIcon: Cpu,
  GlobeAltIcon: Globe,
  HeartIcon: Heart
};

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || ShieldCheck;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'from-green-500 to-emerald-500';
    case 'in-progress':
      return 'from-blue-500 to-cyan-500';
    case 'planned':
      return 'from-purple-500 to-indigo-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'in-progress':
      return Clock;
    default:
      return Clock;
  }
};

// Helper functions
const getCategoryFromTitle = (title: string): string => {
  if (title.toLowerCase().includes('regulatory') || title.toLowerCase().includes('approval')) return 'Regulatory';
  if (title.toLowerCase().includes('manufacturing') || title.toLowerCase().includes('facility')) return 'Manufacturing';
  if (title.toLowerCase().includes('drug product') || title.toLowerCase().includes('oncology')) return 'Product Development';
  if (title.toLowerCase().includes('biosimilar')) return 'Biotechnology';
  if (title.toLowerCase().includes('substance') || title.toLowerCase().includes('api')) return 'API Development';
  if (title.toLowerCase().includes('social') || title.toLowerCase().includes('responsibility')) return 'Social Impact';
  return 'Development';
};

const getImpactFromTitle = (title: string): string => {
  if (title.toLowerCase().includes('regulatory')) return "Enables export to international markets and positions Zydin as a global player in oncology manufacturing.";
  if (title.toLowerCase().includes('manufacturing')) return "Positions Zydin as a key player in patented API manufacturing and strengthens partnerships.";
  if (title.toLowerCase().includes('drug product')) return "Establishes Nepal as a regional hub for oncology drug manufacturing.";
  if (title.toLowerCase().includes('biosimilar')) return "Addresses growing demand for affordable oncology treatments.";
  if (title.toLowerCase().includes('substance')) return "Diversifies product portfolio and opens new market opportunities.";
  if (title.toLowerCase().includes('social')) return "Strengthens community ties and supports national healthcare development.";
  return "Advancing pharmaceutical innovation in Nepal.";
};

const getKeyMilestones = (title: string) => [
  { date: '2024-03-15', title: 'Project Initiation & Team Formation', status: 'completed' },
  { date: '2024-06-30', title: 'Phase 1 Completion', status: 'completed' },
  { date: '2024-12-15', title: 'Mid-term Review & Adjustments', status: 'in-progress' },
  { date: '2025-06-30', title: 'Final Testing & Validation', status: 'planned' },
  { date: '2025-08-30', title: 'Project Delivery & Handover', status: 'planned' }
];

const getStakeholders = (title: string) => [
  { name: 'Ministry of Health & Population', role: 'Regulatory Authority', involvement: 'High' },
  { name: 'Department of Drug Administration', role: 'Licensing Body', involvement: 'Medium' },
  { name: 'International Partners', role: 'Technical Collaboration', involvement: 'High' },
  { name: 'Local Suppliers', role: 'Supply Chain', involvement: 'Medium' },
  { name: 'Quality Assurance Team', role: 'Compliance', involvement: 'High' }
];

const getRiskFactors = (title: string) => [
  { risk: 'Regulatory Approval Delays', impact: 'High', mitigation: 'Early engagement with authorities' },
  { risk: 'Supply Chain Disruptions', impact: 'Medium', mitigation: 'Diversified supplier base' },
  { risk: 'Technology Transfer Challenges', impact: 'Medium', mitigation: 'Robust training programs' },
  { risk: 'Market Competition', impact: 'Low', mitigation: 'Unique value proposition' }
];

const getDeliverables = (title: string) => [
  { item: 'Regulatory Approval Documentation', dueDate: '2024-12-30', status: 'in-progress' },
  { item: 'Manufacturing Facility Setup', dueDate: '2025-03-15', status: 'planned' },
  { item: 'Quality Management System', dueDate: '2025-01-30', status: 'in-progress' },
  { item: 'Training & Certification Program', dueDate: '2025-02-28', status: 'planned' },
  { item: 'Final Audit & Compliance Report', dueDate: '2025-08-15', status: 'planned' }
];

// Fetch program data when component mounts
onMounted(() => {
  if (programs.value.length === 0) {
    fetchPrograms();
  }
});
</script>

<template>
  <div class="program-detail-page-shell">
    <!-- Navigation Header -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-20 z-30">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <RouterLink 
            to="/programs" 
            class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeft class="w-5 h-5 mr-2" />
            Back to Programs
          </RouterLink>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">Program Details</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 animate-spin animation-delay-150"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-600 dark:text-red-400 mb-6">
        <AlertCircle class="mx-auto h-16 w-16" />
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-lg">{{ error }}</p>
      <RouterLink 
        to="/programs"
        class="mt-4 inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Programs
      </RouterLink>
    </div>

    <!-- Program Not Found -->
    <div v-else-if="!enhancedProgram" class="text-center py-20">
      <div class="text-gray-400 dark:text-gray-600 mb-6">
        <FileText class="mx-auto h-16 w-16" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Program Not Found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">The program you're looking for doesn't exist or has been removed.</p>
      <RouterLink 
        to="/programs"
        class="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Programs
      </RouterLink>
    </div>

    <!-- Program Detail Content -->
    <div v-else class="py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <!-- Hero Section -->
        <div class="relative bg-section-bg rounded-3xl p-12 mb-12 overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(59,130,246,0.3) 1px, transparent 0); background-size: 60px 60px;"></div>
          </div>
          
          <div class="relative z-10">
            <!-- Status Badge -->
            <div class="flex items-center justify-between mb-8">
              <div :class="`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getStatusColor(enhancedProgram.status)}`">
                <component :is="getStatusIcon(enhancedProgram.status)" class="w-4 h-4 mr-2" />
                {{ enhancedProgram.status.replace('-', ' ').toUpperCase() }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <Calendar class="w-4 h-4 inline mr-1" />
                {{ enhancedProgram.timeline }}
              </div>
            </div>

            <!-- Program Icon & Title -->
            <div class="flex items-start space-x-6 mb-8">
              <div class="relative flex-shrink-0">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                <div class="relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white">
                  <component :is="getIconComponent(enhancedProgram.icon)" class="w-12 h-12" />
                </div>
              </div>
              <div class="flex-1">
                <h1 class="text-4xl lg:text-5xl font-bold section-title mb-4 leading-tight">
                  {{ enhancedProgram.title }}
                </h1>
                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center">
                    <Target class="w-4 h-4 mr-1" />
                    {{ enhancedProgram.category || 'General' }}
                  </span>
                  <span class="flex items-center">
                    <Users class="w-4 h-4 mr-1" />
                    Active Team
                  </span>
                  <span class="flex items-center">
                    <MapPin class="w-4 h-4 mr-1" />
                    Nepal
                  </span>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ enhancedProgram.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${enhancedProgram.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ enhancedProgram.progress }}%</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Progress</div>
              </div>
              <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">Active</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Status</div>
              </div>
              <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ enhancedProgram.keyMilestones.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Key Milestones</div>
              </div>
              <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ enhancedProgram.stakeholders.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Stakeholders</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FileText class="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                Program Overview
              </h2>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {{ enhancedProgram.description }}
              </p>
            </div>

            <!-- Key Milestones -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <CheckCircle class="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                Key Milestones
              </h2>
              <div class="space-y-4">
                <div 
                  v-for="milestone in enhancedProgram.keyMilestones" 
                  :key="milestone.date"
                  class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700"
                >
                  <div :class="`w-3 h-3 rounded-full mt-2 ${
                    milestone.status === 'completed' ? 'bg-green-500' :
                    milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`"></div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white">{{ milestone.title }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ milestone.date }}</p>
                  </div>
                  <div :class="`px-3 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`">
                    {{ milestone.status.replace('-', ' ') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Expected Impact -->
            <div class="bg-section-bg rounded-2xl p-8">
              <h2 class="text-2xl font-bold section-title mb-6 flex items-center">
                <TrendingUp class="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                Expected Impact
              </h2>
              <p class="section-title leading-relaxed text-lg">
                {{ enhancedProgram.impact }}
              </p>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Program Details -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Program Details
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
                  <p class="text-gray-900 dark:text-white">{{ enhancedProgram.category }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                  <p class="text-gray-900 dark:text-white">{{ enhancedProgram.startDate }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Expected Completion</label>
                  <p class="text-gray-900 dark:text-white">{{ enhancedProgram.expectedCompletion }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</label>
                  <p class="text-gray-900 dark:text-white">{{ enhancedProgram.progress }}%</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status</label>
                  <p class="text-gray-900 dark:text-white">{{ enhancedProgram.status.replace('-', ' ') }}</p>
                </div>
              </div>
            </div>

            <!-- Risk Management -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle class="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                Risk Management
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="risk in enhancedProgram.risks" 
                  :key="risk.risk"
                  class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ risk.risk }}</h4>
                    <span :class="`px-2 py-1 rounded text-xs font-medium ${
                      risk.impact === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`">
                      {{ risk.impact }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ risk.mitigation }}</p>
                </div>
              </div>
            </div>

            <!-- Key Deliverables -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Key Deliverables
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="deliverable in enhancedProgram.deliverables" 
                  :key="deliverable.item"
                  class="flex justify-between items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ deliverable.item }}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ deliverable.dueDate }}</p>
                  </div>
                  <span :class="`px-2 py-1 rounded text-xs font-medium ${
                    deliverable.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`">
                    {{ deliverable.status.replace('-', ' ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-16 text-center">
          <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-3xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4">Interested in This Program?</h3>
            <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
              Learn more about our innovative approach to pharmaceutical development and how you can be part of Nepal's healthcare transformation.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink 
                to="/contact" 
                class="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <Users class="w-5 h-5 mr-2" />
                Partner With Us
              </RouterLink>
              <RouterLink 
                to="/investor-relations" 
                class="inline-flex items-center px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <TrendingUp class="w-5 h-5 mr-2" />
                Investor Resources
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.program-detail-page-shell {
  background-color: var(--section-bg);
  color: var(--section-title-color);
  min-height: 100vh;
}

.animation-delay-150 {
  animation-delay: 150ms;
}
</style>

