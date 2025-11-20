import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { PERMISSIONS } from "@/constants/permission/permissions";

const accessControlRoutes: RouteRecordRaw = {
	path: "/access-control/",
	name: 'access-control',
    component: AuthLayout,
    meta: { requiresAuth: true },
	children: [
		// Dashboard
		{
			path: "dashboard",
			name: "access-control.dashboard",
			component: () => import("@/views/access-control/dashboard/AccessControlDashboard.vue"),
			meta: {
				title: "Access Control Dashboard",
                permission: PERMISSIONS.ACCESS_CONTROL.DASHBOARD,
                breadcrumb: [
                    { label: "Access Control", to: "/access-control/dashboard" }
                ],
			},
		},

		// Roles
		{
			path: "roles",
			name: "access-control.roles.index",
			component: () =>
				import("@/views/access-control/roles/Index.vue"),
			meta: {
				title: "Roles",
                permission: PERMISSIONS.ACCESS_CONTROL.ROLES.VIEW,
                breadcrumb: [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Roles", to: "/access-control/roles" },
                ],
			},
		},
		{
			path: "roles/create",
			name: "access-control.roles.create",
			component: () =>
				import("@/views/access-control/roles/Create.vue"),
			meta: {
				title: "Create Role",
                permission: PERMISSIONS.ACCESS_CONTROL.ROLES.CREATE,
                breadcrumb: [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Roles", to: "/access-control/roles" },
                    { label: "Create Role" },
                ],
			},
		},
		{
			path: "roles/:id",
			name: "access-control.roles.show",
			component: () =>
				import("@/views/access-control/roles/Show.vue"),
			meta: {
				title: "Role Details",
                permission: PERMISSIONS.ACCESS_CONTROL.ROLES.VIEW,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Roles", to: "/access-control/roles" },
                    { label: `Role ID: ${route.params.id}` },
                ],
			},
		},
		{
			path: "roles/:id/edit",
			name: "access-control.roles.edit",
			component: () =>
				import("@/views/access-control/roles/Edit.vue"),
			meta: {
				title: "Edit Role",
                permission: PERMISSIONS.ACCESS_CONTROL.ROLES.UPDATE,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Roles", to: "/access-control/roles" },
                    { label: `Edit Role: ${route.params.id}` },
                ],
			},
		},

		// Permissions
		{
			path: "permissions",
			name: "access-control.permissions.index",
			component: () =>
				import("@/views/access-control/permissions/Index.vue"),
				// import("@/views/access-control/permissions/PermissionList.vue"),
			meta: {
				title: "Permissions",
                permission: PERMISSIONS.ACCESS_CONTROL.PERMISSIONS.VIEW,
                breadcrumb: [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Permissions", to: "/access-control/permissions" },
                ],
			},
		},
		{
			path: "permissions/:id",
			name: "access-control.permissions.show",
			component: () =>
				import("@/views/access-control/permissions/Show.vue"),
			meta: {
				title: "Permission Details",
                permission: PERMISSIONS.ACCESS_CONTROL.PERMISSIONS.VIEW,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Permissions", to: "/access-control/permissions" },
                    { label: `Show Permission: ${route.params.id}` },
                ],
			},
		},
		{
			path: "permissions/:id/edit",
			name: "access-control.permissions.edit",
			component: () =>
				import("@/views/access-control/permissions/Edit.vue"),
			meta: {
				title: "Edit Permission",
                permission: PERMISSIONS.ACCESS_CONTROL.PERMISSIONS.CREATE,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "Permissions", to: "/access-control/permissions" },
                    { label: `Edit Permission: ${route.params.id}` },
                ],
			},
		},

		// Role-Permission Mapping
		{
			path: "role-permission",
			name: "access-control.role-permission.index",
			component: () =>
				import(
					"@/views/access-control/role-permission/RolePermissionMatrix.vue"
				),
			meta: {
				title: "Role Permissions",
                permission: PERMISSIONS.ACCESS_CONTROL.ROLE_PERMISSIONS.VIEW,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => {
                    const crumbs = [
                        { label: "Access Control", to: "/access-control/dashboard" },
                        { label: "Role Permissions", to: "/access-control/role-permission" },
                    ];
                    if (route.query.selected_role_id) {
                        crumbs.push({
                            label: `Manage: Role ${route.query.selected_role_id}`,
                            to: `/access-control/role-permission?selected_role_id=${route.query.selected_role_id}`,
                        });
                    }
                    return crumbs;
                },
			},
		},

		// User Access
		{
			path: "user-access",
			name: "access-control.user-access.index",
			component: () =>
				import("@/views/access-control/user-access/UserAccessList.vue"),
			meta: {
				title: "User Access",
                permission: PERMISSIONS.ACCESS_CONTROL.USER_ACCESS.VIEW,
                breadcrumb: [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "User Access", to: "/access-control/user-access" },
                ],
			},
		},
		{
			path: "user-access/:id/edit",
			name: "access-control.user-access.edit",
			component: () =>
				import("@/views/access-control/user-access/UserAccessEdit.vue"),
			meta: {
				title: "Manage User Access",
                permission: PERMISSIONS.ACCESS_CONTROL.USER_ACCESS.SYNC_PERMISSIONS,
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                    { label: "Access Control", to: "/access-control/dashboard" },
                    { label: "User Access", to: "/access-control/user-access" },
                    { label: `Manage: User ${route.params.id}` },
                ],
			},
		},
	],
};

export default accessControlRoutes;
