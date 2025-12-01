<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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
    RouteIcon,
    AlertTriangleIcon,
    InfoIcon,
    ArrowLeftIcon
} from "lucide-vue-next";
    
import { 
    EditButton, 
    DeleteModel 
} from "@/components/button";
import LoadingState from '@/components/card/LoadingState.vue';

const route = useRoute();
const router = useRouter();
const { error: notifyError } = useNotifier();

const notification = ref<SystemNotification | null>(null);
const isLoading = ref(true);
const notificationId = route.params.id as string;

const fetchNotificationDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse>(
            `/settings/system-notifications/${notificationId}`
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
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
};

const getTypeDetails = (type: string) => {
    switch (type) {
        case 'success': return { icon: CheckCircleIcon, class: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20', label: 'Success' };
        case 'warning': return { icon: AlertTriangleIcon, class: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20', label: 'Warning' };
        case 'error': return { icon: XCircleIcon, class: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20', label: 'Error' };
        default: return { icon: InfoIcon, class: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20', label: 'Info' };
    }
};

const handleDeleted = () => {
    router.push({ name: 'settings.system-notifications.index' });
};
</script>

<template>
    <div class="p-6 md:p-8 font-sans section-bg section-title">
        
        <LoadingState v-if="isLoading" message="Loading notification details..." />
        
        <div v-else-if="!notification" class="flex flex-col items-center justify-center h-64 text-center">
            <BellIcon class="size-16 mb-4 opacity-50" />
            <h3 class="text-xl font-bold section-title">Notification Not Found</h3>
            <p class="text-muted mt-2">The system notification you requested does not exist.</p>
            <RouterLink :to="{ name: 'settings.system-notifications.index' }" class="btn btn-primary mt-6">
                Back to Notifications
            </RouterLink>
        </div>

        <div v-else class="max-w-5xl mx-auto space-y-8">
            
            <!-- Header Card -->
            <div class="card-backdrop p-6 md:p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div class="flex items-start gap-5 w-full">
                        <div class="flex-shrink-0 grid place-content-center size-16 rounded-2xl section-bg shadow-sm border border-muted text-primary-500">
                            <BellIcon class="size-8" />
                        </div>
                        <div class="space-y-1 flex-1">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h1 class="text-2xl font-bold section-title">System Notification</h1>
                                <span 
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border border-transparent"
                                    :class="getTypeDetails(notification.type).class"
                                >
                                    <component :is="getTypeDetails(notification.type).icon" class="size-3.5" />
                                    {{ getTypeDetails(notification.type).label }}
                                </span>
                            </div>
                            <p class="text-sm font-mono">ID: #{{ notification.id }}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                        <RouterLink :to="{ name: 'settings.system-notifications.index' }" class="btn btn-primary">
                            <ArrowLeftIcon class="size-4 mr-2" /> Back
                        </RouterLink>
                        
                        <EditButton 
                            v-if="notification.can?.update"
                            :to="{ name: 'settings.system-notifications.edit', params: { id: notification.id } }"
                            label="Edit"
                        />
                        
                        <DeleteModel
                            v-if="notification.can?.delete"
                            :item-id="notification.id"
                            item-name="this notification"
                            delete-url="/settings/system-notifications/"
                            label="Delete"
                            @deleted="handleDeleted"
                        />
                    </div>
                </div>

                <!-- Notification Message Banner -->
                <div class="mt-6 p-5 rounded section-bg border border-muted relative">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-xl"></div>
                    <h3 class="text-xs font-bold uppercase tracking-wider mb-2">Message Content</h3>
                    <p class="text-lg text-section-title leading-relaxed font-medium">
                        {{ notification.text }}
                    </p>
                </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Configuration Card -->
                <div class="lg:col-span-2 flex flex-col rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden h-full">
                    <header class="p-5 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20">
                        <h2 class="font-bold section-title">Configuration</h2>
                    </header>
                    <div class="p-6 space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                    <CheckCircleIcon class="size-3.5" /> Visibility Status
                                </h3>
                                <div v-if="notification.is_visible" class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 w-fit">
                                    <CheckCircleIcon class="size-5" /> Visible to Users
                                </div>
                                <div v-else class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
                                    <XCircleIcon class="size-5" /> Hidden
                                </div>
                            </div>

                            <div>
                                <h3 class="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                    <ClockIcon class="size-3.5" /> Expiration
                                </h3>
                                <p class="text-section-title font-mono text-sm px-3 py-2 rounded-lg border border-muted inline-block">
                                    {{ notification.expires_at ? formatDate(notification.expires_at) : 'Never Expires' }}
                                </p>
                            </div>
                        </div>

                        <div class="border-t border-dashed border-muted pt-4 grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-xs font-bold uppercase mb-1.5 flex items-center gap-2">
                                    <RouteIcon class="size-3.5" /> Internal Route
                                </h3>
                                <code class="text-sm text-primary-600 dark:text-primary-400 font-mono block truncate" :title="notification.route">
                                    {{ notification.route || 'Not configured' }}
                                </code>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold uppercase mb-1.5 flex items-center gap-2">
                                    <LinkIcon class="size-3.5" /> External Link
                                </h3>
                                <a v-if="notification.link" :href="notification.link" target="_blank" class="text-sm text-blue-600 hover:underline truncate block" :title="notification.link">
                                    {{ notification.link }}
                                </a>
                                <span v-else class="text-sm italic">Not configured</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Audit Card -->
                <div class="flex flex-col rounded-2xl border border-muted bg-card-bg shadow-sm overflow-hidden h-full">
                    <header class="p-5 border-b border-muted bg-gray-50/50 dark:bg-gray-900/20">
                        <h2 class="font-bold section-title">Audit Log</h2>
                    </header>
                    <div class="p-6 space-y-6">
                        <div>
                            <h3 class="text-xs font-bold uppercase mb-1">Created At</h3>
                            <div class="flex items-center gap-2 text-sm text-section-title">
                                <CalendarIcon class="size-4" />
                                {{ formatDate(notification.created_at) }}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs font-bold uppercase mb-1">Last Updated</h3>
                            <div class="flex items-center gap-2 text-sm text-section-title">
                                <ClockIcon class="size-4" />
                                {{ formatDate(notification.updated_at) }}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
</style>