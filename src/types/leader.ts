import type { ModelCan } from "./abilities";

export interface Socials {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
}

export interface Leader {
    id: number;
    name: string;
    position: string;
    title?: string | null;
    quote?: string | null;
    bio?: string | null;
    message?: string | null;
    education?: Record<string, any> | null;
    career_highlights?: Record<string, any> | null;
    socials?: Socials;
    image_url?: string | null;
    image_thumbnail_url?: string | null;
    created_at: string | null;
    updated_at: string | null;
    can?: ModelCan;
}

export interface LeaderFormData {
    name: string;
    position: string;
    title: string | null;
    quote: string | null;
    bio: string | null;
    message: string | null;
    education: Record<string, any> | null; // Use string for JSON input
    career_highlights: Record<string, any> | null; // Use string for JSON input
    socials: Socials | null; // Use string for JSON input
    image?: File | null;
    image_url?: string | null;
}