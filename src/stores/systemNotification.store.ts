import { defineStore } from 'pinia';
import { apiService } from '@/services/api.service';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export interface NotificationTracking {
    seen_at: string | null;
    cleared_at: string | null;
}

export interface SystemNotification {
    id: number;
    text: string;
    route: string | null;
    created_at: string;
    is_visible: boolean;
    type: string;
    tracking: NotificationTracking[];
}

interface SystemNotificationState {
    globalNotifications: SystemNotification[]; // For global (route: null)
    routeNotifications: SystemNotification[]; // For route-specific
    clearedNotifications: SystemNotification[];
    isPanelOpen: boolean;
    isLoading: boolean;
    hasFetchedGlobal: boolean; // Prevent re-fetching global notifications
    hasFetchedCleared: boolean;
    currentView: 'active' | 'cleared';
    currentRoute: string | null; // To track the current route for refresh
}

export const useSystemNotificationStore = defineStore('systemNotification', {
    state: (): SystemNotificationState => ({
        globalNotifications: [],
        routeNotifications: [],
        clearedNotifications: [],
        isPanelOpen: false,
        isLoading: false,
        hasFetchedGlobal: false,
        hasFetchedCleared: false,
        currentView: 'active',
        currentRoute: null,
    }),

    getters: {
        isAuthenticated: () => {
            const authStore = useAuthStore();
            return authStore.isAuthenticated; // Or however your auth store exposes this
        },

        /**
         * Combines global and route-specific notifications for the active view.
         */
        activeNotifications: (state): SystemNotification[] => {
            // Use a Map to prevent duplicates if the API were to send them
            const all = new Map<number, SystemNotification>();
            state.globalNotifications.forEach(n => all.set(n.id, n));
            state.routeNotifications.forEach(n => all.set(n.id, n));
            return Array.from(all.values());
        },

        displayedNotifications: (state): SystemNotification[] => {
            const notifications = state.currentView === 'active'
                // Now uses the 'activeNotifications' getter
                ? ((state.globalNotifications || []).concat(state.routeNotifications || []))
                : state.clearedNotifications;
            return [...notifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },

        unreadCount: (state): number => {
            // Counts from the combined active notifications
            const allActive = (state.globalNotifications || []).concat(state.routeNotifications || []);
            return allActive.filter(n => !n.tracking[0]?.seen_at).length;
        },
    },

    actions: {
        // --- Panel visibility & View Management ---
        openPanel() {
            this.isPanelOpen = true;
            this.setCurrentView('active');
        },

        closePanel() {
            this.isPanelOpen = false;
        },

        togglePanel() {
            this.isPanelOpen ? this.closePanel() : this.openPanel();
        },

        setCurrentView(view: 'active' | 'cleared') {
            this.currentView = view;
            if (view === 'cleared' && !this.hasFetchedCleared) {
                this.fetchClearedNotifications();
            }
        },

        // --- API interactions ---

        /**
         * 1. Fetches only GLOBAL notifications.
         * Should be called once on app load.
         */
        async fetchGlobalNotifications() {
            if (this.hasFetchedGlobal) return;
            this.isLoading = true;
            try {
                // Choose the endpoint based on authentication status
                const endpoint = this.isAuthenticated ? '/notifications' : '/public-notifications';
                const response = await apiService.get<{ data: SystemNotification[] }>(endpoint);
                this.globalNotifications = response.data || [];
                this.hasFetchedGlobal = true;
            } catch (error) {
                console.error('Error fetching global notifications:', error);
                this.globalNotifications = [];
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * 2. Fetches only ROUTE-SPECIFIC notifications.
         */
        async fetchRouteNotifications(routeName: string) {
            this.currentRoute = routeName;
            this.isLoading = true;
            try {
                const endpoint = this.isAuthenticated
                    ? `/notifications?currentRoute=${routeName}`
                    : `/public-notifications?currentRoute=${routeName}`;
                const response = await apiService.get<{ data: SystemNotification[] }>(endpoint);
                this.routeNotifications = (response.data || []).filter(notification => notification.route !== null);
            } catch (error) {
                console.error(`Error fetching notifications for route ${routeName}:`, error);
                this.routeNotifications = [];
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Fetches CLEARED notifications.
         */
        async fetchClearedNotifications() {
            if (!this.isAuthenticated) return; // Guests can't see history
            this.isLoading = true;
            try {
                // ASSUMPTION: You will create this new endpoint to get user's cleared notifications
                const response = await apiService.get<{ data: SystemNotification[] }>(`/notifications/history`);
                this.clearedNotifications = response.data;
                this.hasFetchedCleared = true;
            } catch (error) {
                console.error('Error fetching cleared notifications:', error);
                // this.hasFetchedCleared = false;
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * 3. Refreshes notifications based on the current view.
         */
        async refreshNotifications() {
            if (!this.isAuthenticated) return;
            this.isLoading = true;
            if (this.currentView === 'active') {
                // Re-fetch both global and route-specific notifications
                this.hasFetchedGlobal = false; // Allow global to be fetched again
                await this.fetchGlobalNotifications();
                if (this.currentRoute) {
                    await this.fetchRouteNotifications(this.currentRoute);
                }
            }
            else {
                this.hasFetchedCleared = false;
                await this.fetchClearedNotifications();
            }
            this.isLoading = false;
        },

        /**
         * Marks a single notification as seen.
         */
        async markAsSeen(notificationId: number) {
            if (!this.isAuthenticated) return;
            // Find in either global or route-specific arrays
            let notification = this.globalNotifications.find(n => n.id === notificationId) || this.routeNotifications.find(n => n.id === notificationId);
            if (notification && !notification.tracking[0]?.seen_at) {
                try {
                    await apiService.post(`/notifications/${notificationId}/mark-as-seen`);
                    // Optimistically update the UI
                    if (notification.tracking.length > 0) {
                        notification.tracking[0].seen_at = new Date().toISOString();
                    } else {
                        notification.tracking.push({ seen_at: new Date().toISOString(), cleared_at: null });
                    }
                } catch (error) {
                    console.error('Error marking notification as seen:', error);
                }
            }
        },

        /**
         * Marks all active notifications as seen.
         */
        async markAllAsSeen() {
            if (!this.isAuthenticated) return;
            try {
                await apiService.post('/notifications/mark-all-as-seen');
                const allActive = this.globalNotifications.concat(this.routeNotifications);
                allActive.forEach(n => {
                    if (!n.tracking[0]?.seen_at) {
                        if (n.tracking.length > 0) {
                            n.tracking[0].seen_at = new Date().toISOString();
                        } else {
                            n.tracking.push({ seen_at: new Date().toISOString(), cleared_at: null });
                        }
                    }
                });
            } catch (error) {
                console.error('Error marking all as seen:', error);
            }
        },

        /**
         * LOGICAL IMPROVEMENT: This function now provides an "optimistic" UI update.
         * It immediately moves the notification to the cleared list for a snappy UX,
         * and will revert the change if the API call fails.
         */
        async clearNotification(notificationId: number) {
            if (!this.isAuthenticated) return;
            let clearedItem: SystemNotification | undefined;
            let sourceArray: 'global' | 'route' | null = null;
            let originalIndex = -1;

            // 1. Find the notification and its original location
            originalIndex = this.globalNotifications.findIndex(n => n.id === notificationId);
            if (originalIndex > -1) {
                sourceArray = 'global';
                clearedItem = this.globalNotifications[originalIndex];
            } else {
                originalIndex = this.routeNotifications.findIndex(n => n.id === notificationId);
                if (originalIndex > -1) {
                    sourceArray = 'route';
                    clearedItem = this.routeNotifications[originalIndex];
                }
            }

            if (!clearedItem || !sourceArray) return; // Notification not found

            // 2. Optimistic UI Update: Immediately move the notification
            if (sourceArray === 'global') {
                this.globalNotifications.splice(originalIndex, 1);
            } else {
                this.routeNotifications.splice(originalIndex, 1);
            }
            this.clearedNotifications.unshift(clearedItem);

            // 3. Make the API call
            try {
                await apiService.delete(`/notifications/${notificationId}/clear`);
                this.hasFetchedCleared = false; // Mark cleared as stale to be re-fetched next time
            } catch (error) {
                console.error('Error clearing notification, reverting UI change:', error);

                // 4. On API failure, revert the change
                // Remove from cleared list
                const revertIndex = this.clearedNotifications.findIndex(n => n.id === notificationId);
                if (revertIndex > -1) {
                    this.clearedNotifications.splice(revertIndex, 1);
                }

                // Add it back to its original position
                if (sourceArray === 'global') {
                    this.globalNotifications.splice(originalIndex, 0, clearedItem);
                } else {
                    this.routeNotifications.splice(originalIndex, 0, clearedItem);
                }
            }
        },

        async clearAll() {
            if (!this.isAuthenticated) return;
            try {
                await apiService.delete('/notifications/clear-all');
                this.clearedNotifications.unshift(...this.activeNotifications);
                this.globalNotifications = [];
                this.routeNotifications = [];
                this.hasFetchedCleared = false;
            } catch (error) {
                console.error('Error clearing all notifications:', error);
            }
        },

        /**
         * LOGICAL IMPROVEMENT: Implements the same optimistic UI pattern for restoring.
         */
        async restoreNotification(notificationId: number) {
            if (!this.isAuthenticated) return;
            const index = this.clearedNotifications.findIndex(n => n.id === notificationId);
            if (index === -1) return;

            const [restoredItem] = this.clearedNotifications.splice(index, 1);

            // Optimistically add it back to the correct active list
            if (restoredItem.route) {
                this.routeNotifications.unshift(restoredItem);
            } else {
                this.globalNotifications.unshift(restoredItem);
            }

            try {
                await apiService.post(`/notifications/${notificationId}/restore`);
            } catch (error) {
                console.error('Error restoring notification, reverting:', error);
                // On failure, put it back into the cleared list
                this.clearedNotifications.splice(index, 0, restoredItem);
                // And remove it from where we optimistically put it
                if (restoredItem.route) {
                    const revertIndex = this.routeNotifications.findIndex(n => n.id === notificationId);
                    if (revertIndex > -1) this.routeNotifications.splice(revertIndex, 1);
                } else {
                    const revertIndex = this.globalNotifications.findIndex(n => n.id === notificationId);
                    if (revertIndex > -1) this.globalNotifications.splice(revertIndex, 1);
                }
            }
        },

    },
});