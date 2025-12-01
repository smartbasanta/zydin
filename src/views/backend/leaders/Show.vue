<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Leader } from "@/types";
import BackButton from "@/components/button/BackButton.vue";
import EditButton from "@/components/button/EditButton.vue";
import DeleteModel from "@/components/button/DeleteModel.vue";
import {
    User,
    Briefcase,
    MessageSquare,
    Quote,
    GraduationCap,
    Award,
    Calendar,
    Clock,
    UserSquare,
    LinkedinIcon,
    TwitterIcon
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const leader = ref<Leader | null>(null);
const isLoading = ref(true);
const leaderId = route.params.id as string;

const fetchLeaderDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/leaders/${leaderId}`);
        leader.value = response.data.leader;
    } catch (err) {
        notifyError(err as any, "Failed to load leader details");
        router.push({ name: "dashboard.leaders.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchLeaderDetails);

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    });
};
</script>

<template>
    <div class="section-bg section-title">
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <p class="text-lg animate-pulse text-gray-600 dark:text-gray-400">Loading details...</p>
        </div>
        <div v-else-if="!leader" class="flex justify-center items-center h-screen">
            <p class="text-lg text-gray-700 dark:text-gray-300">Leader not found.</p>
        </div>
        <div v-else class="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            <!-- Header Section -->
            <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <BackButton :to="{ name: 'dashboard.leaders.index' }" class="mb-2" />
                    <h1 class="text-3xl font-bold">{{ leader.name }}</h1>
                    <p class="font-semibold">{{ leader.position }}</p>
                </div>
                <div class="flex items-center gap-2 self-start sm:self-center">
                    <EditButton v-if="leader.can?.update" :to="{ name: 'dashboard.leaders.edit', params: { id: leader.id } }" />
                    <DeleteModel v-if="leader.can?.delete" :item-id="leader.id" :item-name="leader.name" delete-url="/dashboard/leaders/" @deleted="router.push({ name: 'dashboard.leaders.index' })" />
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Sidebar Section -->
                <aside class="lg:col-span-1 space-y-6">
                    <!-- Profile Image -->
                    <div class="rounded-lg shadow-sm bg-gray-900 border border-gray-200 dark:border-gray-700 p-6">
                        <img v-if="leader.image_url" :src="leader.image_url" :alt="leader.name" class="w-full h-auto rounded-lg object-cover">
                        <div v-else class="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                           <UserSquare class="size-24" />
                        </div>
                    </div>

                    <!-- Key Information -->
                    <div class="bg-white dark:bg-gray-1000 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="card-header">Key Information</h3>
                        <div class="space-y-4">
                            <div v-if="leader.socials?.linkedin || leader.socials?.twitter" class="flex items-start gap-3">
                                <div class="flex items-center gap-3">
                                     <a v-if="leader.socials.linkedin" :href="leader.socials.linkedin" target="_blank" class="text-gray-400 hover:text-blue-600">
                                        <LinkedinIcon class="size-5" />
                                     </a>
                                     <a v-if="leader.socials.twitter" :href="leader.socials.twitter" target="_blank" class="text-gray-400 hover:text-sky-500">
                                        <TwitterIcon class="size-5" />
                                     </a>
                                </div>
                            </div>
                           <div class="flex items-start gap-3">
                                <Calendar class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="detail-label">Date Created</p>
                                    <p class="detail-value">{{ formatDate(leader.created_at) }}</p>
                                </div>
                           </div>
                           <div class="flex items-start gap-3">
                                <Clock class="size-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p class="detail-label">Last Updated</p>
                                    <p class="detail-value">{{ formatDate(leader.updated_at) }}</p>
                                </div>
                           </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content Section -->
                <main class="lg:col-span-2 space-y-8">
                    <!-- Quote -->
                     <div v-if="leader.quote" class="bg-white dark:bg-gray-1000 card-base">
                        <h3 class="card-header"><Quote class="card-header-icon" />Quote</h3>
                        <blockquote class="p-6 text-lg italic text-gray-600 dark:text-gray-300 border-l-4 border-gray-200 dark:border-gray-600">
                            {{ leader.quote }}
                        </blockquote>
                    </div>
                    
                    <!-- Bio -->
                    <div v-if="leader.bio" class="bg-white dark:bg-gray-1000 card-base">
                        <h3 class="card-header"><User class="card-header-icon" />Biography</h3>
                        <p class="p-6 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ leader.bio }}</p>
                    </div>

                    <!-- Message -->
                    <div v-if="leader.message" class="bg-white dark:bg-gray-1000 card-base">
                        <h3 class="card-header"><MessageSquare class="card-header-icon" />Message</h3>
                        <p class="p-6 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ leader.message }}</p>
                    </div>
                    
                    <!-- Education -->
                    <div v-if="leader.education && leader.education.length > 0" class="bg-white dark:bg-gray-1000 card-base">
                        <h3 class="card-header"><GraduationCap class="card-header-icon" />Education</h3>
                        <ul class="p-6 space-y-3">
                            <li v-for="(item, index) in leader.education" :key="index">
                                <p class="font-semibold text-gray-800 dark:text-gray-100">{{ item.degree }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.field }}, {{ item.institution }}</p>
                            </li>
                        </ul>
                    </div>

                    <!-- Career Highlights -->
                    <div v-if="leader.career_highlights && leader.career_highlights.length > 0" class="bg-white dark:bg-gray-1000 card-base">
                        <h3 class="card-header"><Award class="card-header-icon" />Career Highlights</h3>
                         <ul class="p-6 space-y-3">
                            <li v-for="(item, index) in leader.career_highlights" :key="index">
                                <p class="font-semibold text-gray-800 dark:text-gray-100">{{ item.role }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.company }} ({{ item.period }})</p>
                            </li>
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
.card-base {
    @apply rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}
.card-header {
    @apply text-lg font-bold text-gray-800 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2;
}
.card-header-icon {
    @apply size-5 text-gray-500 dark:text-gray-400;
}
.detail-label {
    @apply text-sm font-medium text-gray-500 dark:text-gray-400;
}
.detail-value {
    @apply text-sm text-gray-900 dark:text-gray-50 font-semibold;
}
</style>