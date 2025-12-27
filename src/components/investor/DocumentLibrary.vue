
<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  Presentation,
  Image,
  X,
  ChevronDown
} from 'lucide-vue-next';

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

interface Props {
  documents: Document[];
  title?: string;
  showSearch?: boolean;
  showFilters?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Document Library',
  showSearch: true,
  showFilters: true
});

const emit = defineEmits<{
  'download': [document: Document];
  'filter': [category: string];
}>();

const searchQuery = ref('');
const selectedCategory = ref('all');
const isFilterOpen = ref(false);

// Get unique categories
const categories = computed(() => {
  const uniqueCategories = [...new Set(props.documents.map(doc => doc.category))];
  return ['all', ...uniqueCategories];
});

// Filter documents based on search and category
const filteredDocuments = computed(() => {
  let filtered = props.documents;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(doc => doc.category === selectedCategory.value);
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Get file icon based on type
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'excel':
      return FileSpreadsheet;
    case 'powerpoint':
      return Presentation;
    case 'image':
      return Image;
    default:
      return FileText;
  }
};

// Get file type color
const getFileTypeColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-red-600 dark:text-red-400';
    case 'excel':
      return 'text-green-600 dark:text-green-400';
    case 'powerpoint':
      return 'text-orange-600 dark:text-orange-400';
    case 'image':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Format file size
const formatFileSize = (size: string) => {
  return size;
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Handle document download
const handleDownload = (document: Document) => {
  emit('download', document);
  // In a real application, this would trigger the actual download
  console.log('Downloading:', document.title);
};

// Handle category filter
const handleCategoryFilter = (category: string) => {
  selectedCategory.value = category;
  emit('filter', category);
};
</script>

<template>
  <div class="document-library bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <FileText class="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
        {{ title }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Access financial reports, governance documents, and investor presentations
      </p>
    </div>
    
    <!-- Search and Filters -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div v-if="showSearch" class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search documents..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <!-- Category Filter -->
        <div v-if="showFilters" class="relative">
          <button 
            @click="isFilterOpen = !isFilterOpen"
            class="inline-flex items-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <Filter class="w-4 h-4 mr-2" />
            {{ selectedCategory === 'all' ? 'All Categories' : selectedCategory.replace('-', ' ').toUpperCase() }}
            <ChevronDown class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isFilterOpen }" />
          </button>
          
          <!-- Filter Dropdown -->
          <div 
            v-if="isFilterOpen"
            class="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 z-50 overflow-hidden"
          >
            <div class="py-2">
              <button
                v-for="category in categories"
                :key="category"
                @click="handleCategoryFilter(category); isFilterOpen = false"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                :class="{ 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300': selectedCategory === category }"
              >
                {{ category === 'all' ? 'All Categories' : category.replace('-', ' ').toUpperCase() }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Documents List -->
    <div class="p-6">
      <div v-if="filteredDocuments.length === 0" class="text-center py-12">
        <FileText class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
        <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="document in filteredDocuments"
          :key="document.id"
          class="group bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- File Icon -->
              <div class="flex-shrink-0">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <component 
                    :is="getFileIcon(document.type)"
                    class="w-6 h-6"
                    :class="getFileTypeColor(document.type)"
                  />
                </div>
              </div>
              
              <!-- Document Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                    {{ document.title }}
                  </h3>
                  <span 
                    v-if="document.isNew"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  >
                    New
                  </span>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                  {{ document.description }}
                </p>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center space-x-1">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDate(document.date) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <FileText class="w-4 h-4" />
                    <span>{{ formatFileSize(document.size) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Download Button -->
            <div class="flex-shrink-0 ml-4">
              <button 
                @click="handleDownload(document)"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                <Download class="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Click outside to close filter -->
    <div 
      v-if="isFilterOpen"
      @click="isFilterOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

