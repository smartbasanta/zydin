<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { ContactSubmission } from "@/types";
import { UserIcon, MailIcon, PhoneIcon, MessageCircle, CalendarIcon } from "lucide-vue-next";
import { BackButton, DeleteButton } from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError, notify } = useNotifier();

const submission = ref<ContactSubmission | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const submissionId = route.params.id as string;

const fetchSubmissionDetails = async () => {
    isLoading.value = true;
    // const submissionId = await route.params.id
    try {
        const response = await apiService.get<ApiResponse>(`/dashboard/contact-submissions/${submissionId}`);
        submission.value = response.data.submission;
    } catch (err) {
        notifyError(err as any, "Failed to load submission details");
        router.push({ name: "dashboard.contact-submissions.index" });
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateString: string | null) => new Date(dateString??'').toLocaleString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const handleDelete = async () => {
    if (!submission.value?.can?.delete) return;
    isDeleting.value = true;
    try {
        await apiService.delete(`/dashboard/contact-submissions/${submission.value.id}`);
        router.push({ name: 'dashboard.contact-submissions.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete submission`);
    } finally {
        isDeleting.value = false;
    }
};

const markAsRead = async ()=>{
    try {
        let response:ApiResponse;
        response = await apiService.patch(`/dashboard/contact-submissions/${submissionId}/mark-as-read`);
        fetchSubmissionDetails();
        notify(response)
    } catch (err) {
        notifyError(err as any, `Failed to delete submission`);
    } finally {
        isDeleting.value = false;
    }
}
onMounted(()=>{
    fetchSubmissionDetails();

});
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 section-bg section-title font-poppins">
		<div v-if="isLoading" class="text-center py-12 text-lg animate-pulse">
			Loading submission details...
		</div>
		<div v-else-if="!submission" class="text-center py-12 text-lg">
			Submission not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<div class="rounded-xl shadow-md p-6 border">
                <div class="flex justify-end gap-3 mb-4">
                    <BackButton :to="{ name: 'dashboard.contact-submissions.index' }" />
                    <button type="button" @click="markAsRead" class="btn btn-primary">Mark As {{ submission.is_read? 'Un-read':'Read' }}</button>
                    <DeleteButton v-if="submission.can?.delete" :loading="isDeleting" @confirm="handleDelete" />
                </div>

                <h1 class="text-3xl font-bold mt-2">
                    {{ submission.subject }}
                </h1>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm mt-4 border-t dark:border-gray-800 pt-4">
                    <div class="flex items-center gap-2">
                        <UserIcon class="size-4" />
                        <span>From: <strong>{{ submission.name }}</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <MailIcon class="size-4" />
                        <a :href="`mailto:${submission.email}`" class="link">{{ submission.email }}</a>
                    </div>
                    <div v-if="submission.phone" class="flex items-center gap-2">
                        <PhoneIcon class="size-4" />
                        <span>{{ submission.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CalendarIcon class="size-4" />
                        <span>Received: {{ formatDate(submission.created_at) }}</span>
                    </div>
                </div>
			</div>

            <div class="rounded-xl shadow-md p-6 border">
                <h2 class="font-bold text-xl mb-4 flex items-center gap-2"><MessageCircle class="size-5" /> Message</h2>
                <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">{{ submission.message }}</div>
            </div>
		</div>
	</div>
</template>