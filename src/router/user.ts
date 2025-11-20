import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import ProfileView from "@/views/account/ProfileView.vue";

const userRoutes: RouteRecordRaw = {
    path: "/user",
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [
        {
            path: "/account",
            name: "account",
            component: () => import("@/views/account/Index.vue"),
        },
        {
            path: "/me", // Changed from "/me" to be a nested route
            component: ProfileView,
            children: [
                // {
                //     path: "",
                //     redirect: "profile", // Redirect /me to /me/profile
                //     name: 'me-base'
                // },
                {
                    path: "",
                    name: "me-profile",
                    component: ()=> import("@/views/account/partials/Profile.vue"),
                },
                {
                    path: "address", // Corrected from "addresses" to match tab
                    name: "me-address",
                    component: () => import("@/views/account/partials/Address.vue"),
                },
                {
                    path: "settings",
                    name: "me-settings",
                    component: () => import("@/views/account/partials/Settings.vue"),
                },
            ],
        },
        // {
        //     path: "/me",
        //     name: "me",
        //     component: () => import("@/views/account/ProfileView.vue"),
        // },
        {
            path: ":user_id",
            name: "user",
            component: () => import("@/views/account/partials/Profile.vue"),
        },
    ],
};

export default userRoutes;
