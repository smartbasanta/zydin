import type { ModelCan } from "./abilities";

export interface Certification {
    id: number;
    name: string;
    issuing_body: string;
    description: string | null;
    logo_url?: string | null;
    logo_thumbnail_url?: string | null;
    pdf_url?: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
}

export interface CertificationFormData {
    name: string;
    issuing_body: string;
    description: string | null;
    logo_image?: File | null;
    logo_url?: string | null; // For displaying current image
    pdf_file?: File | null;
    pdf_url?: string | null; // For displaying current PDF link
    is_featured: boolean;
}