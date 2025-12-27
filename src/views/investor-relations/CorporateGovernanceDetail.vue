<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { 
  ArrowLeft,
  Shield,
  Users,
  FileText,
  Award,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  Target,
  Activity,
  Globe,
  BarChart3,
  Scale,
  Gavel
} from 'lucide-vue-next';
import { useInvestorRelationsAPI } from '@/composables/fetch-public-apis/useInvestorRelationsAPI';

const route = useRoute();
const section = computed(() => route.params.section as string);

const {
  investorRelations,
  isLoading: loading,
  error,
  fetchInvestorRelations
} = useInvestorRelationsAPI();

// Enhanced governance data for detail view
const governanceData = computed(() => {
  return {
    overview: {
      title: "Corporate Governance Framework",
      description: "Zydin Biotech is committed to maintaining the highest standards of corporate governance, transparency, and ethical business practices. Our governance framework is designed to ensure accountability, protect shareholder interests, and promote sustainable business growth.",
      lastUpdated: "2024-12-01"
    },
    boardOfDirectors: {
      title: "Board of Directors",
      description: "Our Board of Directors brings extensive experience in business strategy, financial oversight, and pharmaceutical industry expertise.",
      composition: {
        totalMembers: 5,
        independentDirectors: 3,
        executiveDirectors: 2,
        committees: 3
      },
      members: [
        {
          name: "Dr. Rajesh Kumar Sharma",
          position: "Chairman & Managing Director",
          appointmentDate: "2020-03-15",
          experience: "25+ years in pharmaceutical industry",
          expertise: "Strategic Planning, Regulatory Affairs",
          education: "PhD in Pharmaceutical Sciences, MBA"
        },
        {
          name: "Ms. Sita Devi Gautam",
          position: "Independent Director",
          appointmentDate: "2021-07-01",
          experience: "20+ years in finance and banking",
          expertise: "Financial Management, Risk Assessment",
          education: "CA, MBA Finance"
        },
        {
          name: "Dr. Binod Kumar Aryal",
          position: "Independent Director",
          appointmentDate: "2022-01-10",
          experience: "18+ years in oncology research",
          expertise: "Medical Research, Clinical Development",
          education: "MD Oncology, PhD Medical Sciences"
        },
        {
          name: "Mr. Deepak Kumar Shrestha",
          position: "Executive Director",
          appointmentDate: "2019-05-20",
          experience: "15+ years in operations management",
          expertise: "Operations, Supply Chain, Manufacturing",
          education: "MBA Operations, BTech Chemical Engineering"
        },
        {
          name: "Prof. Dr. Anjana Pradhan",
          position: "Independent Director",
          appointmentDate: "2023-02-15",
          experience: "22+ years in academia and research",
          expertise: "Academic Research, Innovation Strategy",
          education: "PhD Biotechnology, PostDoc Research"
        }
      ]
    },
    committees: {
      title: "Board Committees",
      description: "Specialized committees ensure focused oversight and decision-making in key areas.",
      committees: [
        {
          name: "Audit Committee",
          chairman: "Ms. Sita Devi Gautam",
          members: ["Ms. Sita Devi Gautam", "Dr. Binod Kumar Aryal", "Prof. Dr. Anjana Pradhan"],
          responsibilities: [
            "Financial reporting oversight",
            "Internal control systems",
            "External auditor relationship",
            "Risk management framework"
          ],
          meetingsLastYear: 12,
          attendance: "95%"
        },
        {
          name: "Remuneration Committee",
          chairman: "Dr. Binod Kumar Aryal",
          members: ["Dr. Binod Kumar Aryal", "Ms. Sita Devi Gautam", "Prof. Dr. Anjana Pradhan"],
          responsibilities: [
            "Executive compensation",
            "Performance evaluation",
            "Succession planning",
            "Employee benefit plans"
          ],
          meetingsLastYear: 6,
          attendance: "100%"
        },
        {
          name: "Risk Management Committee",
          chairman: "Prof. Dr. Anjana Pradhan",
          members: ["Prof. Dr. Anjana Pradhan", "Mr. Deepak Kumar Shrestha", "Ms. Sita Devi Gautam"],
          responsibilities: [
            "Enterprise risk assessment",
            "Operational risk monitoring",
            "Compliance oversight",
            "Business continuity planning"
          ],
          meetingsLastYear: 8,
          attendance: "92%"
        }
      ]
    },
    policies: {
      title: "Corporate Policies",
      description: "Comprehensive policies ensure ethical conduct and regulatory compliance across all operations.",
      policies: [
        {
          name: "Code of Conduct",
          description: "Ethical guidelines for all employees and board members",
          lastUpdated: "2024-01-15",
          compliance: "Mandatory for all personnel"
        },
        {
          name: "Whistleblower Policy",
          description: "Protected reporting mechanism for ethical concerns",
          lastUpdated: "2024-03-20",
          compliance: "Anonymous reporting available"
        },
        {
          name: "Anti-Corruption Policy",
          description: "Zero tolerance for corruption and bribery",
          lastUpdated: "2024-02-10",
          compliance: "Regular training conducted"
        },
        {
          name: "Conflict of Interest Policy",
          description: "Guidelines for managing potential conflicts",
          lastUpdated: "2024-01-30",
          compliance: "Annual disclosure required"
        },
        {
          name: "Data Protection Policy",
          description: "GDPR and local privacy law compliance",
          lastUpdated: "2024-04-15",
          compliance: "Regular audits conducted"
        }
      ]
    },
    compliance: {
      title: "Regulatory Compliance",
      description: "Strict adherence to all applicable laws, regulations, and industry standards.",
      certifications: [
        {
          name: "WHO-GMP Certification",
          issuer: "World Health Organization",
          validUntil: "2026-03-15",
          scope: "Manufacturing practices"
        },
        {
          name: "ISO 9001:2015",
          issuer: "International Organization for Standardization",
          validUntil: "2025-11-20",
          scope: "Quality management systems"
        },
        {
          name: "NABL Accreditation",
          issuer: "National Accreditation Board for Testing and Calibration",
          validUntil: "2025-08-30",
          scope: "Laboratory testing"
        }
      ],
      regulatoryBodies: [
        "Department of Drug Administration (DDA)",
        "Ministry of Health & Population",
        "Nepal Food and Drug Quality Control Laboratory",
        "Pharmaceuticals Association of Nepal"
      ]
    },
    shareholderRights: {
      title: "Shareholder Rights & Protection",
      description: "Comprehensive framework protecting shareholder interests and ensuring transparency.",
      rights: [
        {
          right: "Voting Rights",
          description: "One vote per share on all resolutions",
          exercise: "Annual General Meeting & Special Meetings"
        },
        {
          right: "Dividend Rights",
          description: "Entitled to declared dividends",
          exercise: "As per board declaration"
        },
        {
          right: "Information Rights",
          description: "Access to financial statements and reports",
          exercise: "Quarterly and annual reports"
        },
        {
          right: "Inspection Rights",
          description: "Right to inspect corporate records",
          exercise: "During business hours with notice"
        }
      ],
      protections: [
        "Equal treatment of all shareholders",
        "Anti-takeover provisions",
        "Related party transaction oversight",
        "Minority shareholder protection"
      ]
    },
    riskManagement: {
      title: "Risk Management Framework",
      description: "Comprehensive risk identification, assessment, and mitigation strategies.",
      categories: [
        {
          category: "Operational Risk",
          risks: [
            { risk: "Manufacturing disruption", mitigation: "Backup facilities and supply chain redundancy" },
            { risk: "Quality control failures", mitigation: "Multi-layer quality assurance systems" },
            { risk: "Technology obsolescence", mitigation: "Regular technology assessment and upgrades" }
          ]
        },
        {
          category: "Financial Risk",
          risks: [
            { risk: "Currency fluctuation", mitigation: "Hedging strategies and diversified revenue streams" },
            { risk: "Credit risk", mitigation: "Credit assessment and monitoring procedures" },
            { risk: "Liquidity risk", mitigation: "Cash flow management and credit facilities" }
          ]
        },
        {
          category: "Regulatory Risk",
          risks: [
            { risk: "Regulatory changes", mitigation: "Proactive regulatory monitoring and compliance" },
            { risk: "Licensing issues", mitigation: "Strong regulatory relationships and compliance history" },
            { risk: "Environmental regulations", mitigation: "Environmental management systems" }
          ]
        }
      ]
    },
    performance: {
      title: "Governance Performance Metrics",
      description: "Key indicators measuring the effectiveness of our governance practices.",
      metrics: [
        { metric: "Board Meeting Attendance", value: "96%", target: "≥90%" },
        { metric: "Committee Meeting Attendance", value: "94%", target: "≥85%" },
        { metric: "Policy Compliance Rate", value: "100%", target: "100%" },
        { metric: "Audit Findings Resolution", value: "98%", target: "≥95%" },
        { metric: "Shareholder Engagement Score", value: "4.2/5", target: "≥4.0" },
        { metric: "Regulatory Compliance Score", value: "100%", target: "100%" }
      ]
    }
  };
});

// Fetch data when component mounts
onMounted(() => {
  if (investorRelations.value.length === 0) {
    fetchInvestorRelations();
  }
});
</script>

<template>
  <div class="governance-detail-page-shell">
    <!-- Navigation Header -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-20 z-30">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <RouterLink 
            to="/investor-relations" 
            class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeft class="w-5 h-5 mr-2" />
            Back to Investor Relations
          </RouterLink>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm section-title">Corporate Governance</span>
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
        to="/investor-relations"
        class="mt-4 inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Investor Relations
      </RouterLink>
    </div>

    <!-- Governance Detail Content -->
    <div v-else class="py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <!-- Hero Section -->
        <div class="relative bg-section-bg rounded-3xl p-12 mb-12 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 2px 2px, rgba(34,197,94,0.3) 1px, transparent 0); background-size: 60px 60px;"></div>
          </div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <Shield class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold section-title mb-6">
              {{ governanceData.overview.title }}
            </h1>
            <p class="text-xl section-title mb-8 max-w-4xl mx-auto leading-relaxed">
              {{ governanceData.overview.description }}
            </p>
            <div class="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center">
                <Calendar class="w-4 h-4 mr-1" />
                Last Updated: {{ governanceData.overview.lastUpdated }}
              </span>
              <span class="flex items-center">
                <Globe class="w-4 h-4 mr-1" />
                International Standards
              </span>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="space-y-12">
          <!-- Board of Directors -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users class="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
              {{ governanceData.boardOfDirectors.title }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-8 text-lg">{{ governanceData.boardOfDirectors.description }}</p>
            
            <!-- Board Composition Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ governanceData.boardOfDirectors.composition.totalMembers }}</div>
                <div class="text-sm text-blue-800 dark:text-blue-200">Total Members</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900 rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ governanceData.boardOfDirectors.composition.independentDirectors }}</div>
                <div class="text-sm text-green-800 dark:text-green-200">Independent Directors</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900 rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ governanceData.boardOfDirectors.composition.committees }}</div>
                <div class="text-sm text-purple-800 dark:text-purple-200">Board Committees</div>
              </div>
              <div class="bg-orange-50 dark:bg-orange-900 rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">96%</div>
                <div class="text-sm text-orange-800 dark:text-orange-200">Meeting Attendance</div>
              </div>
            </div>

            <!-- Board Members -->
            <div class="grid md:grid-cols-2 gap-6">
              <div 
                v-for="member in governanceData.boardOfDirectors.members" 
                :key="member.name"
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
              >
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ member.name }}</h3>
                <p class="text-blue-600 dark:text-blue-400 font-semibold mb-4">{{ member.position }}</p>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                    <span class="text-gray-600 dark:text-gray-400 ml-2">{{ member.experience }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Expertise:</span>
                    <span class="text-gray-600 dark:text-gray-400 ml-2">{{ member.expertise }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Education:</span>
                    <span class="text-gray-600 dark:text-gray-400 ml-2">{{ member.education }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Appointed:</span>
                    <span class="text-gray-600 dark:text-gray-400 ml-2">{{ member.appointmentDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Board Committees -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Gavel class="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
              {{ governanceData.committees.title }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-8 text-lg">{{ governanceData.committees.description }}</p>
            
            <div class="space-y-6">
              <div 
                v-for="committee in governanceData.committees.committees" 
                :key="committee.name"
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ committee.name }}</h3>
                  <div class="text-right text-sm text-gray-600 dark:text-gray-400">
                    <div>Meetings: {{ committee.meetingsLastYear }}/year</div>
                    <div>Attendance: {{ committee.attendance }}</div>
                  </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Chairman</h4>
                    <p class="text-gray-700 dark:text-gray-300">{{ committee.chairman }}</p>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Members</h4>
                    <ul class="text-gray-700 dark:text-gray-300">
                      <li v-for="member in committee.members" :key="member">{{ member }}</li>
                    </ul>
                  </div>
                </div>
                <div class="mt-4">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Key Responsibilities</h4>
                  <ul class="text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li v-for="responsibility in committee.responsibilities" :key="responsibility">{{ responsibility }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Corporate Policies -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <FileText class="w-8 h-8 mr-3 text-purple-600 dark:text-purple-400" />
              {{ governanceData.policies.title }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-8 text-lg">{{ governanceData.policies.description }}</p>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="policy in governanceData.policies.policies" 
                :key="policy.name"
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
              >
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ policy.name }}</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm">{{ policy.description }}</p>
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span class="text-gray-900 dark:text-white">{{ policy.lastUpdated }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Compliance:</span>
                    <span class="text-green-600 dark:text-green-400">{{ policy.compliance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <BarChart3 class="w-8 h-8 mr-3 text-orange-600 dark:text-orange-400" />
              {{ governanceData.performance.title }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-8 text-lg">{{ governanceData.performance.description }}</p>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="metric in governanceData.performance.metrics" 
                :key="metric.metric"
                class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-6"
              >
                <div class="text-center">
                  <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ metric.value }}</div>
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ metric.metric }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Target: {{ metric.target }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-16 text-center">
          <div class="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 rounded-3xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4">Questions About Our Governance?</h3>
            <p class="text-green-100 mb-6 max-w-2xl mx-auto">
              Our investor relations team is available to discuss our governance framework, policies, and practices.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink 
                to="/contact" 
                class="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <Phone class="w-5 h-5 mr-2" />
                Contact IR Team
              </RouterLink>
              <button class="inline-flex items-center px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300">
                <Mail class="w-5 h-5 mr-2" />
                Investor Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.governance-detail-page-shell {
  background-color: var(--section-bg);
  color: var(--section-title-color);
  min-height: 100vh;
}

.animation-delay-150 {
  animation-delay: 150ms;
}
</style>

