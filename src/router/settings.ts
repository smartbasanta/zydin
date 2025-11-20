import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { PERMISSIONS } from "@/constants/permission/permissions";

const settingsRoutes: RouteRecordRaw = {
    path: "/settings/",
    name: "settings",
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [
        // Dashboard
        {
            path: "dashboard",
            name: "settings.dashboard",
            component: () => import("@/views/settings/dashboard/Dashboard.vue"),
            meta: {
                title: "Settings Dashboard",
                permission: PERMISSIONS.SETTINGS.DASHBOARD,
                breadcrumb: [{ label: "Settings", to: "/settings/dashboard" }],
            },
        },
        // Notification
        {
            path: "system-notifications",
            name: "settings.system-notifications.index",
            component: () => import("@/views/settings/notification/Index.vue"),
            meta: {
                title: "System Notifications",
                permission: PERMISSIONS.SYSTEM.NOTIFICATIONS,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    {
                        label: "System Notification",
                        to: "/settings/notifications",
                    },
                ],
            },
        },

        {
            path: "system-notifications/create",
            name: "settings.system-notifications.create",
            component: () => import("@/views/settings/notification/Create.vue"),
            meta: {
                title: "Create Notification",
                permission: PERMISSIONS.SYSTEM.NOTIFICATIONS.CREATE,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    {
                        label: "System Notifications",
                        to: "/settings/system-notifications",
                    },
                    {
                        label: "Create Notification",
                        to: "/settings/system-notifications/create",
                    },
                ],
            },
        },
        {
            path: "system-notifications/show/:id",
            name: "settings.system-notifications.show",
            component: () => import("@/views/settings/notification/Show.vue"),
            meta: {
                title: "View Notification",
                permission: PERMISSIONS.SYSTEM.NOTIFICATIONS.VIEW,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    {
                        label: "System Notifications",
                        to: "/settings/system-notifications",
                    },
                    {
                        label: "View Notification",
                        to: "/settings/system-notifications/:id",
                    },
                ],
            },
        },
        {
            path: "system-notifications/edit/:id",
            name: "settings.system-notifications.edit",
            component: () => import("@/views/settings/notification/Edit.vue"),
            meta: {
                title: "Edit Notification",
                permission: PERMISSIONS.SYSTEM.NOTIFICATIONS.UPDATE,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    {
                        label: "System Notifications",
                        to: "/settings/system-notifications",
                    },
                    {
                        label: "View Notification",
                        to: "/settings/system-notifications/:id",
                    },
                ],
            },
        },

        // database
        {
            path: "database",
            name: "settings.database",
            component: () => import("@/views/settings/database/Index.vue"),
            meta: {
                title: "Database Maintenance",
                permission: PERMISSIONS.SETTINGS.DATABASE,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    { label: "Database", to: "/settings/database" },
                ],
            },
        },

        // cache
        {
            path: "cache",
            name: "settings.cache",
            component: () => import("@/views/settings/cache/Index.vue"),
            meta: {
                title: "Aplication Cache",
                permission: PERMISSIONS.SETTINGS.CACHE,
                breadcrumb: [
                    { label: "Settings", to: "/settings/dashboard" },
                    { label: "Cache", to: "/settings/cache" },
                ],
            },
        },
    ],
};

export default settingsRoutes;
