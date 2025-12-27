
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  Building2, 
  FileText, 
  Users,
  TrendingUp,
  Calendar,
  Download,
  DollarSign,
  BarChart3,
  Target,
  Globe,
  Award,
  ArrowRight,
  PieChart,
  Activity,
  Shield,
  Eye,
  Phone,
  Mail
} from 'lucide-vue-next';
import FinancialChart from '@/components/investor/FinancialChart.vue';
import DocumentLibrary from '@/components/investor/DocumentLibrary.vue';
import SectionDivider from '@/views/homepage/partials/SectionDivider.vue';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useInvestorRelationsAPI } from '@/composables/fetch-public-apis/useInvestorRelationsAPI';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'excel' | 'powerpoint' | 'image' | 'other';
  category: 'financial' | 'governance' | 'reports' | 'presentations';
  size: string;
  date: string;
  downloadUrl: string;
  isNew?: boolean;
}

const {
  investorRelations,
  isLoading: loading,
  error,
  fetchInvestorRelations
} = useInvestorRelationsAPI();

const route = useRoute();

const getCurrentSection = () => {
  return route.params.section || 'overview';
};

// Fetch investor relations when component is mounted
onMounted(() => {
  fetchInvestorRelations();
});

// Enhanced key metrics
const keyMetrics = computed(() => [
  {
    label: 'Total Revenue (2024)',
    value: '₹4.12 Cr',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    label: 'R&D Investment',
    value: '₹1.2 Cr',
    change: '+25.4%',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: 'Active Programs',
    value: '6',
    change: '+2',
    trend: 'up',
    icon: Target,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    label: 'Market Presence',
    value: '15+',
    change: 'Countries',
    trend: 'neutral',
    icon: Globe,
    color: 'text-orange-600 dark:text-orange-400'
  }
]);

// Mock financial data for charts
const financialData = computed(() => [
  { label: 'Q1 2024', value: 850000, change: 12.5 },
  { label: 'Q2 2024', value: 920000, change: 8.2 },
  { label: 'Q3 2024', value: 1100000, change: 19.6 },
  { label: 'Q4 2024', value: 1250000, change: 13.6 },
]);

const revenueGrowth = computed(() => [
  { label: '2022', value: 2800000, color: '#3b82f6' },
  { label: '2023', value: 3650000, color: '#10b981' },
  { label: '2024', value: 4120000, color: '#f59e0b' },
  { label: '2025E', value: 4850000, color: '#8b5cf6' },
]);

const documents = computed<Document[]>(() => [
  {
    id: '1',
    title: 'Annual Report 2024',
    description: 'Comprehensive annual report covering financial performance, strategic initiatives, and future outlook.',
    type: 'pdf',
    category: 'financial',
    size: '2.4 MB',
    date: '2024-12-15',
    downloadUrl: '/documents/annual-report-2024.pdf',
    isNew: true
  },
  {
    id: '2',
    title: 'Quarterly Financial Statement Q4 2024',
    description: 'Detailed quarterly financial statements and management discussion.',
    type: 'pdf',
    category: 'financial',
    size: '1.8 MB',
    date: '2024-10-30',
    downloadUrl: '/documents/q4-2024-statement.pdf'
  },
  {
    id: '3',
    title: 'Corporate Governance Guidelines',
    description: 'Board composition, committees, and governance policies document.',
    type: 'pdf',
    category: 'governance',
    size: '1.2 MB',
    date: '2024-11-20',
    downloadUrl: '/documents/governance-guidelines.pdf'
  },
  {
    id: '4',
    title: 'Investor Presentation Q4 2024',
    description: 'PowerPoint presentation for quarterly investor meeting.',
    type: 'powerpoint',
    category: 'presentations',
    size: '5.6 MB',
    date: '2024-10-25',
    downloadUrl: '/documents/investor-presentation-q4-2024.pptx'
  },
  {
    id: '5',
    title: 'Risk Management Report',
    description: 'Comprehensive analysis of company risks and mitigation strategies.',
    type: 'pdf',
    category: 'reports',
    size: '1.5 MB',
    date: '2024-09-15',
    downloadUrl: '/documents/risk-management-report.pdf'
  },
]);

// Handle document download
const handleDocumentDownload = (document: Document) => {
  console.log('Downloading document:', document.title);
  // In a real application, this would trigger the actual download
};

// Handle filter
const handleFilter = (category: string) => {
  console.log('Filtering by category:', category);
};
</script>

<template>
  <div class="investor-relations-page-shell">
    <!-- Enhanced Hero Section -->
    <section class="relative overflow-hidden py-24 lg:py-32">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-5xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
            <TrendingUp class="w-4 h-4 mr-2" />
            Investor Relations
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-5xl lg:text-7xl font-bold section-title mb-8 leading-tight">
            Building <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Trust</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl lg:text-2xl section-title mb-12 max-w-4xl mx-auto leading-relaxed">
            Stay informed about Zydin Biotech's financial performance, governance practices, 
            and strategic initiatives as we continue to innovate in oncology healthcare and build Nepal's pharmaceutical future.
          </p>
          
          <!-- Key Metrics -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div 
              v-for="metric in keyMetrics" 
              :key="metric.label"
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-3">
                <component :is="metric.icon" class="w-6 h-6" :class="metric.color" />
                <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ metric.change }}</span>
              </div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ metric.value }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ metric.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <section class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8 overflow-x-auto">
          <RouterLink 
            to="/investor-relations" 
            class="py-6 px-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap"
            :class="$route.path === '/investor-relations' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            <div class="flex items-center space-x-2">
              <Building2 class="w-5 h-5" />
              <span>Company Overview</span>
            </div>
          </RouterLink>
          <RouterLink 
            to="/investor-relations/corporate-governance" 
            class="py-6 px-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap"
          >
            <div class="flex items-center space-x-2">
              <Shield class="w-5 h-5" />
              <span>Corporate Governance</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-green-600 animate-spin animation-delay-150"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-600 dark:text-red-400 mb-6">
            <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg">{{ error }}</p>
        </div>

        <div v-else class="space-y-16">
          <!-- Overview Hero -->
          <div class="text-center max-w-4xl mx-auto">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <Building2 class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold section-title mb-6">
              Leading Nepal's <span class="text-blue-600 dark:text-blue-400">Pharmaceutical</span> Future
            </h2>
            <p class="text-xl section-title leading-relaxed">
              Transforming oncology healthcare through innovative manufacturing, regulatory excellence, 
              and strategic partnerships that position Nepal as a regional pharmaceutical hub.
            </p>
          </div>

          <!-- Financial Performance Charts -->
          <div class="grid lg:grid-cols-2 gap-8">
            <FinancialChart 
              title="Quarterly Revenue Growth"
              :data="financialData"
              type="line"
              :height="350"
            />
            <FinancialChart 
              title="Annual Revenue Projection"
              :data="revenueGrowth"
              type="bar"
              :height="350"
            />
          </div>

          <!-- Company Highlights -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8">
              <div class="flex items-center mb-4">
                <Award class="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Industry Pioneer</h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                First company in Nepal to manufacture Oncology APIs, establishing a new industry standard 
                and opening doors for international partnerships.
              </p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl p-8">
              <div class="flex items-center mb-4">
                <TrendingUp class="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Public Company</h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                Converted to Public Limited Company on 21st July 2025, marking a significant milestone 
                towards Nepal Stock Exchange listing.
              </p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl p-8">
              <div class="flex items-center mb-4">
                <Target class="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Future Focus</h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                Developing patented drug products that address unmet medical needs in oncology, 
                driving innovation in cancer treatment.
              </p>
            </div>
          </div>

          <!-- Document Library -->
          <div>
            <DocumentLibrary 
              :documents="documents"
              title="Investor Resources"
              @download="handleDocumentDownload"
              @filter="handleFilter"
            />
          </div>
        </div>

        <!-- Enhanced Call to Action -->
        <div class="mt-20">
          <div class="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-3xl p-12 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 60px 60px;"></div>
            </div>
            
            <div class="relative z-10 text-center max-w-4xl mx-auto">
              <div class="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-blue-100 text-sm font-medium mb-6">
                <Globe class="w-4 h-4 mr-2" />
                Global Partnership Initiative
              </div>
              
              <h2 class="text-4xl lg:text-5xl font-bold mb-6">
                Partner with Nepal's Future in Oncology
              </h2>
              
              <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join us in building Nepal's premier pharmaceutical company. Together, we can advance 
                cancer treatment, create value for shareholders, and transform healthcare in the region.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <RouterLink 
                  to="/contact" 
                  class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  <Phone class="w-5 h-5 mr-2" />
                  Contact IR Team
                </RouterLink>
                <button class="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                  <Mail class="w-5 h-5 mr-2" />
                  Investor Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  @reference "@/assets/css/main.css";
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #10b981);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #059669);
}

.investor-relations-page-shell {
  background-color: var(--section-bg);
  color: var(--section-title-color);
  min-height: 100vh;
}
</style>

