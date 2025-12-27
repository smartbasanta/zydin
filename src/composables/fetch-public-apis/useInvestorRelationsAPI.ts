import { ref } from 'vue';
import type { ApiResponse } from '@/types/api';
import { apiService } from '@/services/api.service';

export interface InvestorRelation {
  id: number;
  section: string;
  title: string;
  content: any;
  is_active: boolean;
  order: number;
}

export function useInvestorRelationsAPI() {
  // State for the list of investor relations
  const investorRelations = ref<InvestorRelation[]>([]);
  const pagination = ref({});

  // State for a single investor relation detail view
  const investorRelation = ref<InvestorRelation | null>(null);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchInvestorRelations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.get<ApiResponse>('/public/investor-relations');
      investorRelations.value = response.data.investor_relations || [];
      
      // If no data from backend, provide fallback data
      if (investorRelations.value.length === 0) {
        investorRelations.value = [
          {
            id: 1,
            section: 'overview',
            title: 'Company Overview',
            content: {
              description: "Zydin Biotech planned to be listed on the Nepal Stock Exchange and, accordingly, was converted into a Public Limited Company on 21st July 2025. It is the first company in Nepal to manufacture Oncology APIs and is currently seeking approval for licenses to produce complex finished formulations, including tablets, capsules, injectables (liquid, suspension, and lyophilized drug products).",
              focus: "Zydin's future focus is on developing patented drug products that address unmet medical needs in oncology.",
              mission: "To establish Nepal as a leading pharmaceutical hub while improving access to advanced cancer treatments.",
              achievements: [
                "First oncology API manufacturer in Nepal",
                "Public Limited Company status achieved",
                "Multiple regulatory approvals in progress",
                "Strategic partnerships with international firms"
              ]
            },
            is_active: true,
            order: 1
          },
          {
            id: 2,
            section: 'governance',
            title: 'Corporate Governance',
            content: {
              description: "The Board of Directors of Zydin Biotech Ltd. sets high standards of expertise, having contributed to the establishment of the company and its new ventures, and brings vast experience in business and due diligence. The Board is committed to maintaining good governance.",
              duty: "It is the duty of the Board of Directors to act as a prudent steward for shareholders and to oversee the management of the Company's business. In fulfilling its responsibilities and discharging its duties, the Board follows the procedures and standards set forth as their agreed guidelines.",
              guidelines: "These guidelines may be modified from time to time, as the Board of Directors deems appropriate in the best interests of the Company or as required by applicable laws and regulations.",
              boardStructure: {
                chairman: "Dr. Rajesh Sharma",
                independent_directors: 3,
                executive_directors: 2,
                committees: ["Audit Committee", "Risk Committee", "Compensation Committee"]
              }
            },
            is_active: true,
            order: 2
          }
        ];
      }
      
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch investor relations';
      console.error('Error fetching investor relations:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchInvestorRelationById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    investorRelation.value = null;
    try {
      const response = await apiService.get<ApiResponse>(`/public/investor-relations/${id}`);
      investorRelation.value = response.data.investor_relation;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch investor relation';
      console.error('Error fetching investor relation:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    investorRelations,
    investorRelation,
    pagination,
    isLoading,
    error,
    fetchInvestorRelations,
    fetchInvestorRelationById,
  };
}
