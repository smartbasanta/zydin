<script setup lang="ts">
import { computed } from 'vue';
import { useSystemNotificationStore, type SystemNotification } from '@/stores/systemNotification.store';
import { AlertTriangle, Check, CheckCircle2, Info, Trash2, Undo2, XCircle } from 'lucide-vue-next';

const props = defineProps<{
    notification: SystemNotification;
    isCleared: boolean;
}>();

const store = useSystemNotificationStore();

// Determines if the notification has been marked as seen.
const isSeen = computed(() => !!props.notification.tracking[0]?.seen_at);

/**
 * Provides dynamic styling based on the notification type.
 * Includes classes for text, hover effects, and the unread indicator dot.
 */
const typeDetails = computed(() => {
    switch (props.notification.type) {
        case 'success':
            return {
                icon: CheckCircle2,
                textClass: 'text-[var(--color-success)]',
                hoverBgClass: 'hover:bg-[color-mix(in srgb, var(--color-success) 10%, transparent)]',
                borderClass: 'hover:border-[color-mix(in srgb, var(--color-success) 20%, transparent)]',
                dotClass: 'bg-[var(--color-success)]',
            };
        case 'warning':
            return {
                icon: AlertTriangle,
                textClass: 'text-[var(--color-warning)]',
                hoverBgClass: 'hover:bg-[color-mix(in srgb, var(--color-warning) 10%, transparent)]',
                borderClass: 'hover:border-[color-mix(in srgb, var(--color-warning) 20%, transparent)]',
                dotClass: 'bg-[var(--color-warning)]',
            };
        case 'error':
            return {
                icon: XCircle,
                textClass: 'text-[var(--color-error)]',
                hoverBgClass: 'hover:bg-[color-mix(in srgb, var(--color-error) 10%, transparent)]',
                borderClass: 'hover:border-[color-mix(in srgb, var(--color-error) 20%, transparent)]',
                dotClass: 'bg-[var(--color-error)]',
            };
        default: // 'info'
            return {
                icon: Info,
                textClass: 'text-[var(--color-info)]',
                hoverBgClass: 'hover:bg-[color-mix(in srgb, var(--color-info) 10%, transparent)]',
                borderClass: 'hover:border-[color-mix(in srgb, var(--color-info) 20%, transparent)]',
                dotClass: 'bg-[var(--color-info)]',
            };
    }
});

// Formats the creation date into a human-readable "time ago" string.
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};
</script>

<template>
    <div
        class=" group flex w-full cursor-pointer items-start gap-4 rounded-lg border border-transparent p-3 transition-all duration-200"
        :class="[
            // Apply hover and border classes only if not cleared
            !isCleared ? [typeDetails.hoverBgClass, typeDetails.borderClass] : '',
            // Apply styles for the cleared state
            { 'opacity-75': isCleared }
        ]"
    >
        <!-- Icon -->
        <div class="flex-shrink-0 pt-0.5">
            <component :is="typeDetails.icon" class="h-6 w-6" :class="typeDetails.textClass" />
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
            <div
                class="prose prose-sm prose-p:my-0 dark:prose-invert"
                :class="typeDetails.textClass"
                v-html="notification.text"
            ></div>
            <p class="mt-1 text-xs text-muted">
                {{ timeAgo(notification.created_at) }}
            </p>
        </div>

        <!-- Right Section: Vertically aligned indicator and actions -->
        <div class="flex-shrink-0">
            <!-- Container for active (uncleared) notifications -->
            <div class="flex h-full flex-col items-end justify-between">
                <!-- Top: Unread Indicator Dot -->
                <div
                    v-if="!isSeen"
                    class="h-2.5 w-2.5 rounded-full"
                    :class="typeDetails.dotClass"
                    title="Unread"
                ></div>

                <!-- Spacer: This is crucial to keep the actions at the bottom when the dot isn't visible -->
                <div v-else class="h-2.5 w-2.5"></div>

                <!-- Bottom: Action Buttons (appear on hover) -->
                 <span v-if="store.isAuthenticated">
                     <div v-if="!isCleared" class="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                             v-if="!isSeen"
                             @click.stop="store.markAsSeen(notification.id)"
                             title="Mark as read"
                             class="rounded-full p-1.5 text-muted hover:bg-[color-mix(in srgb, var(--color-gray-200) 80%, transparent)] hover:text-[var(--color-info)]"
                         >
                             <Check class="h-4 w-4" />
                         </button>
                         <button
                             @click.stop="store.clearNotification(notification.id)"
                             title="Clear notification"
                             class="rounded-full p-1.5 text-muted hover:bg-[color-mix(in srgb, var(--color-gray-200) 80%, transparent)] hover:text-[var(--color-error)]"
                         >
                             <Trash2 class="h-4 w-4" />
                         </button>
                     </div>
                     <!-- Container for cleared notifications -->
                     <div v-else class="flex h-full items-center justify-center">
                          <button
                             @click.stop="store.restoreNotification(notification.id)"
                             title="Restore notification"
                             class="rounded-full p-1.5 text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                         >
                             <Undo2 class="h-4 w-4" />
                         </button>
                     </div>
                 </span>
            </div>

        </div>
    </div>
</template>