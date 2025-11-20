import type { ModelCan } from "./abilities";

export interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_featured: boolean;
    image_url?: string | null;
    image_thumbnail_url?: string | null;
    products?: Product[];
    created_at: string | null;
    updated_at: string | null;
    can?: ModelCan;
}

export interface BrandFormData {
    name: string;
    slug: string;
    description: string | null;
    is_featured: boolean;
    image?: File | null;
    image_url?: string | null;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    type: 'api' | 'ff';
    description: string | null;
    is_featured: boolean;
    brand_id?: number | null;
    prescribtion?: string[] | null;
    safety_precaution?: string[] | null;
    image_url?: string | null;
    brand?: Brand | null; // For eager-loaded relationships
    category?: string | null;

    // FF (Finished Formulation) Specific Fields
    generic_name?: string | null;
    therapeutic_area?: string | null;
    dosage_form?: string | null;
    strength?: string | null;
    pharmacology?: string | null;
    indications?: string | null;

    // API (Active Pharmaceutical Ingredient) Specific Fields
    cas_number?: string | null;
    molecular_formula?: string | null;
    molecular_weight?: string | null;

    created_at: string | null;
    updated_at: string | null;
    can?: ModelCan;
}

// Type for the form state, omitting read-only fields like 'id' and 'slug'
export interface ProductFormData {
    name: string;
    slug: string;
    type: 'api' | 'ff';
    description: string | null;
    is_featured: boolean;
    brand_id: number | null;
    image_url?: string | null;
    image?: File | null; 
    prescribtion: string[] | null;
    safety_precaution: string[] | null;
    
    // All of these MUST allow null
    generic_name: string | null;
    therapeutic_area: string | null;
    dosage_form: string | null;
    strength: string | null;
    pharmacology: string | null;
    indications: string | null;

    cas_number: string | null;
    category: string | null;
    molecular_formula: string | null;
    molecular_weight: string | null;
}