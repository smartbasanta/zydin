import type { RouteRecordRaw } from 'vue-router';
import GuestLayout from '@/layouts/GuestLayout.vue';


const guestRoutes: RouteRecordRaw = {
    // Note: We use a placeholder path here. The final path will be defined
    // when we merge it into the main router, but this structure works well.
    path: '/', 
    component: GuestLayout,
    meta: { isGuest: true },
    children: [
        {
            path: 'login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue'),
        },
        {
            path: 'forgot-password',
            name: 'forgot-password',
            component: () => import('@/views/auth/ForgotPassword.vue'),
        },
        {
            path: 'reset-password',
            name: 'reset-password',
            component: () => import('@/views/auth/ResetPassword.vue'),
            props: route => ({ token: route.query.token, email: route.query.email })
        },
    ],
};

export default guestRoutes;