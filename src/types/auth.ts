import type { ApiError } from "./api";
import type { Role } from "./access-control";
import type { NotificationQType } from "./notification";

// The User object from your Laravel API
export interface User {
    id: number;
    username: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    avatar_url?: string;
    avatar_thumbnail_url?: string;

    // Role Permission
    effective_permissions?: string[];
    roles?: Pick<
        Role,
        "id" | "key" | "name" | "level" | "color_light" | "color_dark"
    >[];
    is_super_user?: boolean;
}

// Credentials for different auth actions
export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    used_referral_code: string;
    terms_accepted: boolean;
    remember?: boolean;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// The response from Laravel after a successful login/register
// export interface AuthResponse {
//     message: string;
//     data: {
//         user: User
//         access_token: string
//     };
// }
export interface AuthResponse {
    data?: {
        user: User;
        access_token?: string;
    };
    user?: User;
    access_token?: string;
    message?: string;
    notification?: NotificationQType;
}

// export interface AuthResponse {
//     user: User;
//     token: string;
// }

// The state for Pinia auth store
export type AuthStatus = "idle" | "loading" | "success" | "error" | "pending";

export interface AuthStoreState {
    user: User | null;
    token: string | null;
    status: AuthStatus;
    error: ApiError | null;
    returnUrl: string | null; // Add this line
}

export interface Profile {
    first_name: string;
    last_name: string;
    gender: string;
    mobile_number: string;
    date_of_birth: string;
    bio: string;
    timezone: string; // You might want to auto-detect or provide a list
    language_preference: string | "en"; // Default value
}

export interface Address {
    id?: number;
    user_id: number;
    full_name: string;
    email: string;
    phone: string;
    type: string;
    province_id?: number;
    district_id?: number;
    municipality_id?: number;
    state?: string;
    city?: string;
    ward_number?: number;
    address_line_1: string;
    address_line_2?: string;
    street_address: string;
    postal_code: string;
    country_id: number;
    geo_location?: string;
    is_primary: boolean;
}

export interface Settings {
    id?: number;
    user_id: number;
    email_notifications: boolean;
    sms_notifications: boolean;
    preferences?: string | null;
}
