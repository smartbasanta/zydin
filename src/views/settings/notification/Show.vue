<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiService } from "@/services/api.service";
import type { ApiResponse } from "@/types/api";
import { useNotifier } from "@/composables/useNotifier";
import type { SystemNotification } from "@/types/notification"; 
import {
    CheckCircleIcon,
    XCircleIcon,
    BellIcon,
    LinkIcon,
    CalendarIcon,
    ClockIcon,
} from "lucide-vue-next";
    
import { 
    BackButton, 
    EditButton, 
    DeleteButton,
} from "@/components/button";

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const notification = ref<SystemNotification | null>(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const notificationId = route.params.id as string;

// The controller's show method should return the notification with its 'can' abilities.
const fetchNotificationDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(
            `/settings/system-notifications/${notificationId}` // Make sure your API endpoint is correct
        );
        notification.value = response.data.notification;
    } catch (err) {
        notifyError(err as any, "Failed to load notification details");
        router.push({ name: "settings.system-notifications.index" });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchNotificationDetails);

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const handleDelete = async () => {
    if (!notification.value?.can?.delete) return;

    isDeleting.value = true;
    try {
        const response = await apiService.delete(`/settings/system-notifications/${notification.value.id}`);
        // Consider adding a success notification before redirecting
        router.push({ name: 'settings.system-notifications.index' });
    } catch (err) {
        notifyError(err as any, `Failed to delete notification`);
    } finally {
        isDeleting.value = false;
    }
};
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-6 bg-gray-0 dark:bg-gray-1250 min-h-screen font-poppins transition-colors duration-300">
		<div v-if="isLoading" class="text-center py-12 text-gray-700 dark:text-gray-600 text-lg animate-pulse">
			Loading notification details...
		</div>
		<div v-else-if="!notification" class="text-center py-12 text-gray-700 dark:text-gray-400 text-lg">
			Notification not found.
		</div>
		<div v-else class="container mx-auto space-y-6">
			<!-- Header Card -->
			<div class="bg-white dark:bg-gray-1200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-150 dark:border-gray-1000">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div class="flex items-center gap-4">
                        <BellIcon class="size-8 text-sky-500 dark:text-sky-400" />
						<div class="space-y-1">
							<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 font-grotesk leading-tight">
								System Notification
							</h1>
							<p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
								ID: {{ notification.id }}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
                        <BackButton :to="{ name: 'settings.system-notifications.index' }" />
                        <EditButton v-if="notification.can?.update"
                            :to="{
								name: 'settings.system-notifications.edit',
								params: { id: notification.id },
							}"
                        />
                        <DeleteButton
                            v-if="notification.can?.delete"
                            :loading="isDeleting"
                            @confirm="handleDelete"
                        />
					</div>
				</div>
                <p class="mt-4 text-gray-700 dark:text-gray-200 text-base leading-relaxed bg-gray-50 dark:bg-gray-1100 p-4 rounded-lg">
					{{ notification.text }}
				</p>
			</div>

			<!-- Metadata Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Status
					</h3>
                    <div class="flex items-center gap-2">
                        <CheckCircleIcon v-if="notification.is_visible" class="w-5 h-5 text-green-500 dark:text-green-400" />
                        <XCircleIcon v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span class="text-gray-900 dark:text-gray-100 font-medium">
                            {{ notification.is_visible ? 'Visible' : 'Hidden' }}
                        </span>
                    </div>
				</div>
                <div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Route
					</h3>
                    <div class="flex items-center gap-2">
                        <LinkIcon class="size-4 text-gray-500" />
                        <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">
                            {{ notification.route || 'N/A' }}
                        </p>
                    </div>
				</div>
                <div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Link
					</h3>
                    <div class="flex items-center gap-2">
                        <LinkIcon class="size-4 text-gray-500" />
                        <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">
                            {{ notification.link || 'N/A' }}
                        </p>
                    </div>
				</div>
                <div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Expires At
					</h3>
                    <div class="flex items-center gap-2">
                        <CalendarIcon class="size-4 text-gray-500" />
                        <p class="text-gray-900 dark:text-gray-100 font-medium text-sm" >
                            {{ formatDate(notification.expires_at) }}
                        </p>
                    </div>
				</div>
                <div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Created At
					</h3>
                    <div class="flex items-center gap-2">
                        <ClockIcon class="size-4 text-gray-500" />
                        <p class="text-gray-900 dark:text-gray-100 font-medium text-sm" :title="notification.created_at">
                            {{ formatDate(notification.created_at) }}
                        </p>
                    </div>
				</div>
				<div class="bg-white dark:bg-gray-1200 rounded-xl p-4 border border-gray-150 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1150 transition-colors duration-200">
					<h3 class="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 mb-2 font-grotesk">
						Last Updated
					</h3>
                    <div class="flex items-center gap-2">
                        <ClockIcon class="size-4 text-gray-500" />
                        <p class="text-gray-900 dark:text-gray-100 font-medium text-sm" :title="notification.updated_at">
                            {{ formatDate(notification.updated_at) }}
                        </p>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>