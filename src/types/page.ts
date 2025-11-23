import type { ModelCan } from "./abilities";
import type { Leader } from "./leader";
import type { Testimonial } from "./testimonial";

export interface TimelineEvent {
    year: string;
    event_title: string;
    event_description: string;
}
export interface CoreValue {
    title: string;
    description: string;
}
interface TextContent {
    value: string;
}

export interface AboutPageContent {
    summary: { content: TextContent };
    mission_statement: { content: TextContent };
    company_vision: { content: TextContent };
    core_values: { content: CoreValue[] }; // This will be an array of CoreValue objects
    timeline: { content: TimelineEvent[] }; // This will be an array of TimelineEvent objects
}
// This is the main, top-level type for the entire API response for the About Us page.
export interface AboutPageData {
    content: AboutPageContent;
    employeeTestimonials: Testimonial[];
    leaders: Leader[];
}

export interface RepeaterItem {
    [key: string]: any;
}

export interface RepeaterField {
    label: string;
    type: 'text' | 'textarea'; // The types supported inside a repeater
    placeholder?: string;
}

export interface PageContentBlock {
    key: string;
    label: string;
    // 1. Added 'repeater' to the list of possible types.
    type: 'text' | 'textarea' | 'richtext' | 'repeater'; 
    value: string | null;
    placeholder: string;
    // 2. Added an optional 'fields' property for repeaters.
    fields?: Record<string, RepeaterField>; 
}

export interface HeroSlide {
    id: number;
    title: string;
    description: string | null;
    link_text: string | null;
    link_url: string | null;
    order_column: number;
    is_active: boolean;
    image_url: string | null;
    image_thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}

export interface HeroSlideFormData {
    title: string;
    description: string | null;
    link_text: string | null;
    link_url: string | null;
    order_column: number;
    is_active: boolean;
    image: File | null;
    image_url?: string | null;
}

export interface GalleryImage {
    id: number;
    caption: string | null;
    alt_text: string | null;
    gallery_group: 'company_culture' | 'employee_life' | 'corporate_social_responsibility';
    order_column: number;
    image_url: string | null;
    image_thumbnail_url: string | null;
    is_featured:boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}

export interface GalleryImageFormData {
    caption: string | null;
    alt_text: string | null;
    gallery_group: 'company_culture' | 'employee_life' | 'corporate_social_responsibility';
    order_column: number;
    image: File | null;
    image_url?: string | null;
    is_featured:boolean;
}