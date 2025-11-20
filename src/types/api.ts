import type { NotificationQType } from "./notification";

export interface ApiError {
    data?: any;
    message: string;
    errors?: Record<string, [string]>; // For Laravel validation errors
    status?: number;
    notification: NotificationQType;
}


export interface ApiResponse<D = any> { // D is the type of the 'data' payload
    data: D;
    message?: string;
    meta?: Record<string, any>;
    notification?: NotificationQType; 
}
