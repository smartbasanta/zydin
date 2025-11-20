import { useNotifyQStore, type NotifyQPosition } from '@/stores/notify.q.store';
import type { NotificationQType } from '@/types/notification';

// can pass a full object like a Laravel-style API response or just a string message.
type NotifySource =
    | {
        notification?: NotificationQType;
        message?: string;
        }
    | string
    | null
    | undefined;

export function useNotifier(position: NotifyQPosition = 'bottom-right') {
    const notifyQStore = useNotifyQStore();

    const notify = (source?: NotifySource) => {
        if (!source) return;

        // If it's just a string, treat as info
        if (typeof source === 'string') {
            notifyQStore.setPosition(position).info(source, 'Notice');
            return;
        }

        const { notification, message } = source;

        // Prefer the notification object
        if (
            notification &&
            notification.type &&
            typeof notifyQStore[notification.type] === 'function'
        ) {
            notifyQStore
                .setPosition(position)
                [notification.type](notification.message, notification.title ?? 'Notice');
            return;
        }

        // Fallback to message as info
        if (message) {
            notifyQStore.setPosition(position).info(message, 'Notice');
        }
    };

    const error = (source?: NotifySource, fallbackTitle = 'Error') => {
        if (!source) return;

        if (typeof source === 'string') {
            notifyQStore.setPosition(position).error(source, fallbackTitle);
            return;
        }

        const { notification, message } = source;

        // Prefer error notification from backend
        if (
            notification &&
            notification.type &&
            typeof notifyQStore[notification.type] === 'function'
        ) {
            notifyQStore
                .setPosition(position)
                [notification.type](notification.message, notification.title ?? fallbackTitle);
            return;
        }

        // Fallback to message or default
        notifyQStore
            .setPosition(position)
            .error(message ?? 'Something went wrong.', fallbackTitle);
    };

    return {
        notify,
        error,
    };
}
