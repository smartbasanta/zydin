import type { ModelCan } from "./abilities";
import type { User } from "./auth";

export interface Article {
    id: number;
    title: string;
    slug: string;
    author: string | null;
    created_by: number;
    author_title: string | null;
    publish_date: string | null; // Format: 'YYYY-MM-DD'
    category: 'Industry Insights' | 'Research & Development' | 'Company Culture' | string;
    image_url?: string | null;
    excerpt: string | null;
    content: string | null; // HTML content
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
    creator? : User;
}

export interface ArticleFormData {
    title: string;
    slug: string;
    author: string | null;
    author_title: string | null;
    publish_date: string | null;
    category: 'Industry Insights' | 'Research & Development' | 'Company Culture';
    image: File | null; // For the file upload
    image_url?: string | null;
    excerpt: string | null;
    content: string | null;
    is_featured: boolean
}

export interface NewsUpdate {
    id: number;
    title: string;
    slug: string;
    publish_date: string; // Format: 'YYYY-MM-DD'
    created_by: number;
    source: string | null;
    excerpt: string | null;
    full_content: string | null; // Can be HTML
    link: string | null;
    is_featured: boolean;
    image_url?: string | null;
    image_thumbnail_url?: string | null;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
    creator?: User;
}

export interface NewsUpdateFormData {
    title: string;
    slug: string;
    publish_date: string;
    source: string | null;
    excerpt: string | null;
    full_content: string | null;
    link: string | null;
    is_featured: boolean;
    image: File | null;
    image_url?: string | null;
}