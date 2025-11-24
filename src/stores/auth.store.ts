import { defineStore } from 'pinia';
import { apiService } from '@/services/api.service';
import type { User, AuthStoreState, AuthResponse, LoginCredentials } from '@/types/auth';
import type { NotificationQType } from '@/types/notification';
import type { ApiError } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';

export const useAuthStore = defineStore('auth', {
    
    // STATE: The reactive data
    state: (): AuthStoreState => ({
        user: null,
        token: localStorage.getItem('access_token') || null,
        status: 'pending',
        error: null,
        returnUrl: null as string | null, // Add this line
    }),

    // GETTERS: Computed properties from state
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        isLoading: (state) => state.status === 'loading',
        currentUser: (state) => state.user,
        isAuthReady: (state) => state.status !== 'pending',
        userRoles: (state) => state.user?.roles || [],
		userPermissions: (state) => state.user?.effective_permissions || [],

        /**
		 * Checks if the currently authenticated user has a specific permission.
		 * @param permissionKey The key of the permission to check (e.g., 'edit_user').
		 * @returns True if the user has the permission, false otherwise.
		 */
		hasPermission:
			(state) => (permissionKey: string | { [key: string]: string }) => {
				let actualKey: string;

				if (
					typeof permissionKey === "object" &&
					permissionKey !== null
				) {
					actualKey = Object.values(permissionKey)[0];
				} else {
					actualKey = permissionKey;
				}

				const permissions = state.user?.effective_permissions ?? [];

				// console.log(
				// 	"Checking permission:",
				// 	actualKey,
				// 	permissions.includes(actualKey)
				// );

				if (permissions.includes("system.super_user")) return true;

				return permissions.includes(actualKey);
			},

		hasRole: (state) => (roleKey: string) => {
			if (
				state.user?.effective_permissions?.includes("system.super_user")
			) {
				// Check for super_user first
				return true;
			}
			return (
				state.user?.roles?.some((role) => role.key === roleKey) ?? false
			);
		},
    },

    // ACTIONS: Methods to change the state
    actions: {
        _handleAuthSuccess(response: AuthResponse) {

            const user = response.data?.user ?? response.user;
			const token = response.data?.access_token ?? response.access_token;

			if (!user || !token) {
				throw new Error("Invalid auth response: missing user or token");
			}

			this.user = user;
			this.token = token;
			this.status = "success";
			this.error = null;
			apiService.setToken(token);
            // const data = response.data;
            // this.user = data.user;
            // this.token = data.access_token;
            // this.status = 'success';
            // this.error = null;
            // apiService.setToken(data.access_token);
        },

        async fetchUser() {
            // No token, nothing to fetch
            if (!this.token) {
                this.status = 'idle';
                return;
            }

            // this.status = 'loading';

            // Token exists, let's see if it's valid by fetching the user
            // Assuming the user endpoint returns { data: User }
            try {
				const response = await apiService.get<{ data: User }>("/me");
				this.user = response.data;
				this.status = "success";
			} catch (error) {
				// Token is invalid or expired
				console.error(
					"Failed to fetch user, token might be invalid.",
					error
				);
				this.user = null;
				this.token = null;
				this.status = "error";
				apiService.setToken(null);
			}
        },

        // --- Public API Actions ---
        async login(credentials: LoginCredentials) {
            this.status = 'loading';
            this.error = null;

            const { notify, error: notifyError } = useNotifier('bottom-right');

            try {
                const response = await apiService.post<AuthResponse & { notification: NotificationQType }>('/login', credentials);
                // console.log(response);
                this._handleAuthSuccess(response);
                notify(response);

            } catch (err) {
                this.error = err as ApiError;
                this.status = 'error';

                notifyError(this.error);

                throw this.error; // Let the component know it failed
            } 
        },

        async logout() {
            this.status = 'loading';
            try {
                // Tell the server to invalidate the token
                await apiService.post('/logout', {});
            } catch (error) {
                // console.error("Server logout failed, clearing client state anyway.", error);
            } finally {
                this.user = null;
                this.token = null;
                this.status = 'idle';
                this.error = null;
                apiService.setToken(null);

                // force a full page reload and clear all state
                window.location.href = '/login';
            }
        },
        setReturnUrl(url: string | null) {
            this.returnUrl = url;
        },

        /**
         * Updates the current user's data in the store.
         * This ensures reactivity is triggered correctly.
         * @param userData - A partial User object with the fields to update.
         */
        updateUser(userData: Partial<User>) {
            if (this.user) {
                // Use Object.assign or spread syntax to merge the new data
                // This creates a new object reference for the nested property,
                // which is more robust for reactivity.
                this.user = { ...this.user, ...userData };
            }
        },
        // Utility to clear errors, useful on component mount/unmount
        clearError() {
            this.error = null;
            if (this.status === 'error') {
                this.status = 'idle';
            }
        }
    },
});