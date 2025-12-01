// src/types/dashboard.ts

export interface DashboardApplication {
    id: number;
    name: string;
    position: string;
    date: string;
}

export interface DashboardContact {
    id: number;
    name: string;
    subject: string;
    is_read: boolean;
    date: string;
}

// New Interface for Permissions
export interface DashboardPermissions {
    viewAnyProducts: boolean;
    createProduct: boolean;
    viewAnyJobApplications: boolean;
    viewAnyContactSubmissions: boolean;
    createJobOpening: boolean;
    viewAnyArticles: boolean;
    createArticle: boolean;
    createNewsUpdate: boolean;
    viewAnyBackup: boolean;
}

export interface DashboardSummary {
    total_products: number;
    products_api: number;
    products_ff: number;
    pending_applications: number;
    unread_contacts: number;
    total_articles: number;
    total_news: number;
    total_content: number;
    latest_applications: DashboardApplication[];
    latest_contacts: DashboardContact[];
    last_backup_date: string;
    can: DashboardPermissions; // Added here
}