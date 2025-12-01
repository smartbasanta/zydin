import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import publicRoutes from './public'
import guestRoutes from './guest'
import userRoutes from './user'
import authenticatedRoutes from './authenticated';
import accessControlRoutes from "./access-control";
import settingsRoutes from "./settings";

import { useGlobalStateStore } from "@/stores/global.state.store";

const NotFound = () => import('@/views/errors/404.vue')

const routes: Array<RouteRecordRaw> = [
    publicRoutes,
    guestRoutes,
    userRoutes,
    authenticatedRoutes,
    accessControlRoutes,
	settingsRoutes,

    // --- 404 Not Found ---
    // This should be last. It has no layout.
    { 
        path: '/:pathMatch(.*)*', 
        name: 'not-found', 
        component: NotFound 
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (authStore.token && !authStore.isAuthenticated) {
        await authStore.fetchUser();
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuest = to.matched.some(record => record.meta.isGuest);

    if (requiresAuth && !authStore.isAuthenticated) {
        // Store the intended path before redirecting to login
        authStore.setReturnUrl(to.fullPath);
        return next({
			name: "login",
			query: { redirect: to.fullPath },
		});
    } else if (isGuest && authStore.isAuthenticated) {
        return next({ name: 'dashboard.index' });
    } else if (to.meta.permission) {
		const rawPermissions = to.meta.permission;
        const isSuperUser = authStore.currentUser?.is_super_user;

        if (isSuperUser) return next();

        // --- Helper to extract strings from whatever is passed ---
        let permissionsToCheck: string[] = [];

        if (Array.isArray(rawPermissions)) {
            // Handle Array: can contain strings or objects
            rawPermissions.forEach(p => {
                if (typeof p === 'object' && p !== null) {
                    const values = Object.values(p) as string[];
                    permissionsToCheck.push(...values);
                } else {
                    permissionsToCheck.push(p as string);
                }
            });
        } else if (typeof rawPermissions === 'object' && rawPermissions !== null) {
            // Handle Single Object (e.g., PERMISSIONS.SYSTEM.NOTIFICATIONS)
            permissionsToCheck = Object.values(rawPermissions);
        } else {
            // Handle Single String
            permissionsToCheck = [rawPermissions as string];
        }
        // -------------------------------------------------------

        // Check if user has AT LEAST ONE of the permissions in the list
        const userHasPermission = permissionsToCheck.some(perm => 
            authStore.hasPermission(perm)
        );

        if (!userHasPermission) {
            return next({ name: "unauthorized" });
        } else {
            next();
        }
    } else {
        next();
    }
});
router.afterEach(() => {
	const store = useGlobalStateStore();
    // store.resetState();
	// Optional: delay to avoid flicker
	// setTimeout(() => {
	// store.setComponentLoading(false);
	// }, 200);
});

export default router;