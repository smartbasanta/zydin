import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'new_feature';

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    timestamp: Date;
    link?: string; // Optional link for "Read More"
}

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([]);
    const isPanelOpen = ref(false);

    // --- Actions ---

    function addNotification(notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) {
        notifications.value.unshift({
            ...notification,
            id: Date.now() + Math.random(),
            read: false,
            timestamp: new Date(),
        });
    }

    function removeNotification(id: number) {
        notifications.value = notifications.value.filter(n => n.id !== id);
    }

    function markAsRead(id: number) {
        const notification = notifications.value.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
    }
    
    function markAllAsRead() {
        notifications.value.forEach(n => n.read = true);
    }

    function clearAll() {
        notifications.value = [];
    }
    
    function openPanel() {
        isPanelOpen.value = true;
    }
    
    function closePanel() {
        isPanelOpen.value = false;
    }
    
    function togglePanel() {
        isPanelOpen.value = !isPanelOpen.value;
    }
    
    // --- Getters ---
    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

    return { 
        notifications, 
        isPanelOpen,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        openPanel,
        closePanel,
        togglePanel
    };
});