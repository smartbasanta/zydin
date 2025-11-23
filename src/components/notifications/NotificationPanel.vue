<script setup lang="ts">
import { useSystemNotificationStore } from '@/stores/systemNotification.store';
import NotificationItem from './NotificationItem.vue';

import { X, Check, Trash2, History, RefreshCw } from 'lucide-vue-next';
import LoadingState from '../loading/LoadingState.vue';

const store = useSystemNotificationStore();
</script>

<template>
    <div class="relative z-50 pointer-events-none " :class="{ '!pointer-events-auto': store.isPanelOpen }"
        aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <!-- Panel -->
        <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
                <!-- Overlay -->
                <Transition enter-active-class="ease-in-out duration-500" enter-from-class="opacity-0"
                    enter-to-class="opacity-100" leave-active-class="ease-in-out duration-500"
                    leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-show="store.isPanelOpen" @click="() => { store.closePanel(); }"
                        class="fixed inset-0 backdrop-blur-sm transition-opacity"></div>
                </Transition>
                <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                        enter-from-class="translate-x-full" enter-to-class="translate-x-0"
                        leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                        leave-from-class="translate-x-0" leave-to-class="translate-x-full">
                        <div v-show="store.isPanelOpen" class="w-screen max-w-sm">
                            <div
                                class="pointer-events-auto flex h-full flex-col overflow-y-auto bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-l-lg">
                                <!-- Header -->
                                <div
                                    class="px-4 py-4 sm:px-6 border-b border-muted">
                                    <div class="flex items-start justify-between">
                                        <h2 class="text-lg font-semibold section-title"
                                            id="slide-over-title">
                                            Notifications
                                        </h2>
                                        <div class="ml-3 flex gap-4 h-7 items-center">
                                            <button @click="store.refreshNotifications()" type="button"
                                                class="text-muted hover:text-secondary hover:scale-105 active:scale-95" title="Refresh Notifications">
                                                <RefreshCw class="h-5 w-5"
                                                    :class="{ 'animate-spin': store.isLoading }" />
                                            </button>
                                            <button @click="store.closePanel()" type="button"
                                                class="text-muted hover:text-secondary hover:scale-105 active:scale-95">
                                                <X class="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="store.currentView === 'active'  && store.isAuthenticated"
                                        class="mt-2 flex items-center justify-between section-description">
                                        <p class="text-sm text-muted">{{ store.unreadCount }} unseen</p>
                                        <div class="flex items-center gap-2">
                                            <button @click="store.markAllAsSeen()" :disabled="store.unreadCount === 0"
                                                class="btn btn-ghost !px-2 !py-1 text-xs">
                                                <Check class="w-4 h-4" /> Mark all as seen
                                            </button>
                                            <button @click="store.clearAll()"
                                                :disabled="store.activeNotifications.length === 0"
                                                class="btn btn-ghost !px-2 !py-1 text-xs">
                                                <Trash2 class="w-4 h-4" /> Clear all
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tabs -->
                                <div class="border-b border-muted bg-[var(--section-bg)]">
                                    <nav class="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                                        <button @click="store.setCurrentView('active')"
                                            :class="['shrink-0 border-b-2 px-1 py-3 text-sm font-medium', store.currentView === 'active' ? 'border-[var(--color-primary-600)] text-primary' : 'border-transparent text-muted hover:border-muted hover:text-secondary']">
                                            UnSeen
                                        </button>
                                        <button v-if="store.isAuthenticated" @click="store.setCurrentView('cleared')"
                                            :class="['shrink-0 border-b-2 px-1 py-3 text-sm font-medium', store.currentView === 'cleared' ? 'border-[var(--color-primary-600)] text-primary' : 'border-transparent text-muted hover:border-muted hover:text-secondary']">
                                            History
                                        </button>
                                    </nav>
                                </div>

                                <!-- Notification List -->
                                <div class="relative flex-1 overflow-y-auto p-2 sm:p-4">
                                    <LoadingState v-if="store.isLoading" class="absolute inset-0 m-auto" />

                                    <div v-if="store.displayedNotifications.length > 0" class="space-y-3">
                                        <NotificationItem v-for="notification in store.displayedNotifications"
                                            :key="notification.id" :notification="notification"
                                            :is-cleared="store.currentView === 'cleared'" class="group" />
                                    </div>

                                    <!-- Empty States -->
                                    <div v-else
                                        class="flex flex-col items-center justify-center h-full text-center text-muted">
                                        <template v-if="store.currentView === 'active'">
                                            <h3 class="text-lg font-semibold text-secondary">All
                                                caught up!</h3>
                                            <p class="mt-1 text-sm">You have no new notifications.</p>
                                        </template>
                                        <template v-else>
                                            <History class="w-16 h-16 mb-4 text-muted" />
                                            <h3 class="text-lg font-semibold text-secondary">No
                                                History</h3>
                                            <p class="mt-1 text-sm">Your cleared notifications will appear here.</p>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>