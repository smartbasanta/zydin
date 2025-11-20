import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotifyQType = 'info' | 'success' | 'warning' | 'error';

export type NotifyQPosition = 
    | 'top-right' 
    | 'top-left' 
    | 'top-center' 
    | 'bottom-right' 
    | 'bottom-left' 
    | 'bottom-center';

export interface NotifyQ {
    id: number;
    type: NotifyQType;
    title?: string;
    message: string;
    duration?: number; // in ms
}

// Define the shape of the chainable object
interface ChainedNotifyQActions {
    success(message: string, title?: string, duration?: number): void;
    error(message: string, title?: string, duration?: number): void;
    info(message: string, title?: string, duration?: number): void;
    warning(message: string, title?: string, duration?: number): void;
}

export const useNotifyQStore = defineStore('notifyQ', () => {
    const notifyQ = ref<NotifyQ[]>([]);

    const position = ref<NotifyQPosition>('bottom-right');

    function addNotification(notification: Omit<NotifyQ, 'id'>) {
        const id = Date.now() + Math.random();
        notifyQ.value.unshift({
            id,
            ...notification,
        });
    }
    
    function removeNotification(id: number) {
        notifyQ.value = notifyQ.value.filter(t => t.id !== id);
    }

    const success = (message: string, title?: string, duration?: number) => addNotification(
        { type: 'success', message, title, duration }
    );
    const error = (message: string, title?: string, duration?: number) => addNotification(
        { type: 'error', message, title, duration }
    );
    const info = (message: string, title?: string, duration?: number) => addNotification(
        { type: 'info', message, title, duration }
    );
    const warning = (message: string, title?: string, duration?: number) => addNotification(
        { type: 'warning', message, title, duration }
    );

    function setPosition(newPosition: NotifyQPosition): ChainedNotifyQActions {
        position.value = newPosition;
        
        // Return an object containing all the toast-adding methods
        return {
            success,
            error,
            info,
            warning,
        };
    }

    return { 
        notifyQ,
        position,
        setPosition,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning
    };
});