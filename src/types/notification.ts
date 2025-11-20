import type { ModelCan } from "./abilities";

export interface NotificationQListType
{
    type: 'info' | 'success' | 'warning' | 'error',
    title?: string,
    message: string,
    duration?: number,
    persistent?: boolean,
}

// export interface NotificationQType
// {
//     notification: NotificationQListType
// }
export interface SystemNotification {
    id: number;
    text: string;
    route: string;
    link: string;
    type: "info" | "success" | "warning" | "error";
    expires_at: string | null;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}

export type NotificationQType = NotificationQListType;


export interface SystemNotificationFormData {
    text: string;
    route: string | null;
    link: string | null;
    type: "info" | "success" | "warning" | "error";
    expires_at: string | null;
    is_visible: boolean;
}
