import { useAuthStore } from '@/stores/auth.store';
import { computed } from 'vue';

export function usePermissions() {
    const authStore = useAuthStore();

    const hasPermission = (permissionKey: string): boolean => {
        return authStore.hasPermission(permissionKey);
    };

    const hasRole = (roleKey: string): boolean => {
        return authStore.hasRole(roleKey);
    };
    
    // Computed property for convenience in templates
    const can = (permissionKey: string) => computed(() => hasPermission(permissionKey));
    const is = (roleKey: string) => computed(() => hasRole(roleKey));

    return {
        hasPermission,
        hasRole,
        can,
        is,
        // Expose all permissions/roles if needed for debugging or complex logic
        allUserPermissions: computed(() => authStore.userPermissions),
        allUserRoles: computed(() => authStore.userRoles),
        isAuthenticated: computed(() => authStore.isAuthenticated),
    };
}