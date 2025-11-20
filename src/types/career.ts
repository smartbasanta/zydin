import type { ModelCan } from "./abilities";

export interface JobOpening {
    id: number;
    title: string;
    department: string;
    location: string | null;
    type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
    description: string | null;
    responsibilities: string[] | null;
    qualifications: string[] | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    can?: ModelCan;
}

export interface JobOpeningFormData {
    title: string;
    department: string;
    location: string | null;
    type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
    description: string | null;
    responsibilities: string[];
    qualifications: string[];
    is_active: boolean;
}


export interface JobApplication {
    id: number;
    job_opening_id: number;
    name: string;
    email: string;
    phone: string;
    cover_letter: string | null;
    resume_url: string | null;
    created_at: string;
    updated_at: string;
    can?: ModelCan;
    job_opening?: JobOpening; // Eager-loaded relationship
    job_title?: string; // Helper property from controller
}