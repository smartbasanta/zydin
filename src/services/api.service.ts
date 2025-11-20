import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Base URL for API requests.
 * This uses Vite's environment variable, or falls back to localhost.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// const API_BASE_URL =  'https://api.zydin.bsg.com.np/api';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zydin.bsg.com.np/api';

/**
 * Extends AxiosRequestConfig to include a custom flag for getting the full response.
 */
export interface CustomRequestConfig extends AxiosRequestConfig {
    getFullResponse?: boolean;
}


/**
 * A reusable API service powered by Axios to handle HTTP requests, 
 * authentication tokens, and structured error handling for a Vue.js 
 * frontend application.
 */
class ApiService {
    /**
     * The Axios instance with pre-configured settings.
     */
    private axiosInstance: AxiosInstance;

    /**
     * Stores the current authentication token.
     * Initially loaded from localStorage if available.
     */
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('access_token');

        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            // Add timeout to prevent hanging requests
            timeout: 10000,
        });

        // Initialize interceptors
        this._initializeInterceptors();
    }

    /**
     * Sets the authentication token.
     * Also stores or removes it from localStorage.
     * * @param token - A token string or null to clear it.
     */
    public setToken(token: string | null): void {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    /**
     * Retrieves the authentication token.
     * Ensures the latest value is fetched from localStorage if not in memory.
     * * @returns The current token or null if not set.
     */
    public getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('access_token');
        }
        return this.token;
    }

    /**
     * Sets up Axios interceptors for handling authentication and errors globally.
     */
    private _initializeInterceptors(): void {
        // Request Interceptor: Injects the auth token into every request.
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor: Handles API errors in a structured way.
        this.axiosInstance.interceptors.response.use(
            // Any status code that lie within the range of 2xx cause this function to trigger
            (response) => {
                // Handle 204 No Content responses
                if (response.status === 204 || !response.data) {
                    return response;
                }
                return response;
            },
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            (error: any) => {
                let customError: any;

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // const responseData = error.response.data as any;
                    const res = error.response.data as ApiError;
                    customError = {
                        data: res.data || {},
                        message: res.message || 'An API error occurred',
                        errors: res.errors || {},
                        status: res.status,
                        notification: res.notification || {}
                    };
                } else if (error.request) {
                    // The request was made but no response was received (e.g., network error)
                    customError = {
                        message: 'Network error. Please check your internet connection.',
                        errors: {},
                        status: 0, // Indicates a client-side or network error
                    };
                } else {
                    // Something happened in setting up the request that triggered an Error
                    customError = {
                        message: error.message || 'An unexpected error occurred.',
                        errors: {},
                        status: -1, // Indicates a request setup error
                    };
                }
                
                // We throw the custom, structured error so it can be caught by the calling code.
                return Promise.reject(customError);
            }
        );
    }
    
    /**
     * Makes a GET request.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param params - The URL parameters to be sent with the request.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    /**
     * Overload 1: For file downloads or when full response is needed.
     * If `getFullResponse` is true, it returns the entire AxiosResponse object.
     */
    public get<T = any>(endpoint: string, config: CustomRequestConfig & { getFullResponse: true }): Promise<AxiosResponse<T>>;
    /**
     * Overload 2: The default behavior for standard API calls.
     * Returns only the data property of the response.
     */
    public get<T = any>(endpoint: string, config?: CustomRequestConfig): Promise<T>;
    /**
     * Implementation of the GET method.
     */
    public async get<T = any>(endpoint: string, config?: CustomRequestConfig): Promise<T | AxiosResponse<T>> {
        const response = await this.axiosInstance.get<T>(endpoint, config);

        // If `getFullResponse` is true, return the whole response object.
        if (config?.getFullResponse) {
            return response;
        }

        // Otherwise, return just the data.
        return response.data;
    }

    /**
     * Makes a POST request.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param data - The data to send in the request body.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    public async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(endpoint, data, config);
        return response.data || (null as T);
    }

    /**
     * Makes a PUT request.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param data - The data to send in the request body.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    public async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(endpoint, data, config);
        return response.data || (null as T);
    }

    /**
     * Makes a PATCH request.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param data - The data to send in the request body.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    public async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(endpoint, data, config);
        return response.data || (null as T);
    }

    /**
     * Makes a DELETE request.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(endpoint, config);
        return response.data || (null as T);
    }

    /**
     * Makes a POST request with multipart/form-data, suitable for file uploads.
     * This method automatically handles method spoofing for PUT requests as required by Laravel.
     * @typeParam T - Expected response data type.
     * @param endpoint - The API endpoint to call.
     * @param data - A plain JavaScript object containing form data. File objects are handled automatically.
     * @param config - Optional Axios request configuration.
     * @returns The response data.
     */
    public async postWithFiles<T>(endpoint: string, data: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
        const formData = new FormData();

        for (const key in data) {
            const value = data[key];

            // If the key is '_method', we append it for Laravel's method spoofing.
            if (key === '_method' && (value === 'PUT' || value === 'PATCH')) {
                formData.append(key, value);
                continue;
            }

            if (value === null || value === undefined) {
                // Append empty string for null/undefined to signify an empty field to Laravel.
                formData.append(key, '');
            } else if (Array.isArray(value)) {
                // Handle arrays correctly for Laravel validation (e.g., 'responsibilities[]').
                value.forEach(item => {
                    formData.append(`${key}[]`, item);
                });
            } else {
                // Handles strings, numbers, booleans, and File objects.
                formData.append(key, value);
            }
        }
        
        // When using FormData, we MUST NOT set the Content-Type header ourselves.
        // The browser will set it to 'multipart/form-data' and include the necessary boundary.
        const response = await this.axiosInstance.post<T>(endpoint, formData, {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
}

/**
 * Singleton instance of ApiService.
 * Import this only, to be used throughout the app.
 */
export const apiService = new ApiService();