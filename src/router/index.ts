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
		const permissionKey = to.meta.permission as string;
		const userHasPermission = authStore.hasPermission(permissionKey);
		const isSuperUser = authStore.currentUser?.is_super_user;

		if (!userHasPermission && !isSuperUser) {
			return next({ name: "unauthorized" }); // Show custom 403 page
		} else {
			next();
		}
	} else {
		// The user is authorized for this route.
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