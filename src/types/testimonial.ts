import type { ModelCan } from "./abilities";

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar_url: string | null;
    avatar_thumbnail_url: string | null;
    rating: number; // 1 to 5
    text: string;
    type: 'customer' | 'employee';
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}

export interface TestimonialFormData {
    name: string;
    role: string;
    rating: number;
    text: string;
    type: 'customer' | 'employee';
    is_featured: boolean;
    avatar: File | null;
    avatar_url?: string | null;
}