import type { ModelCan } from "./abilities";

export interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}