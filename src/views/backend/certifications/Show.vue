<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { Certification } from "@/types";
import { AwardIcon, FileTextIcon } from "lucide-vue-next";
import { BackButton, EditButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const certification = ref<Certification | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const certificationId = route.params.id as string;

const fetchCertificationDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/certifications/${certificationId}`);
        certification.value = response.data.certification;
    } catch (err) {
        notifyError(err as any, "Failed to load certification details");
        router.push({ name: "dashboard.certifications.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCertificationDetails);

const handleDelete = async () => {
    if (!certification.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/certifications/${certification.value.id}`);
        router.push({ name: 'dashboard.certifications.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete certification`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-50 dark:bg-gray-1100 min-h-screen font-poppins">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading certification details...
		</div>
		<div v-else-if="!certification" class="text-center py-12 text-lg">
			Certification not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<!-- Header Card -->
			<header>
                <BackButton :to="{ name: 'dashboard.certifications.index' }" class="mb-4" />
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ certification.name }}</h1>
                        <p class="text-gray-500 dark:text-gray-400">Issued by: {{ certification.issuing_body }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <EditButton v-if="certification.can?.update" :to="{ name: 'dashboard.certifications.edit', params: { id: certification.id } }" />
                        <DeleteButton v-if="certification.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Content: PDF Viewer -->
                <main class="lg:col-span-2 space-y-8">
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                        <h2 class="text-lg font-bold mb-4 flex items-center gap-2"><FileTextIcon class="size-5" /> Document Viewer</h2>
                        <div v-if="certification.pdf_url" class="aspect-[4/5] border dark:border-gray-700 rounded">
                            <iframe :src="certification.pdf_url" class="w-full h-full" title="Certification PDF"></iframe>
                        </div>
                        <p v-else class="italic text-muted">No PDF document available.</p>
                    </div>
                </main>

                <!-- Sidebar -->
                <aside class="space-y-6">
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                        <h3 class="text-base font-bold mb-4">Logo</h3>
                        <img v-if="certification.logo_url" :src="certification.logo_url" class="max-w-full h-auto">
                        <p v-else class="italic text-muted">No logo.</p>
                    </div>
                    <div class="bg-white dark:bg-gray-1100 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                        <h3 class="text-base font-bold mb-4">Description</h3>
                        <p class="text-sm text-muted">{{ certification.description }}</p>
                    </div>
                </aside>
            </div>
		</div>
	</div>
</template>