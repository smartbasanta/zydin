import type { ModelCan } from './abilities';
import type { User } from './auth';

// =================================================================
// │ CORE MODELS                                                   │
// =================================================================

export interface Role {
    id: number;
    key: string;
    name: string;
    description: string | null;
    level: number;
    is_default: boolean;
    color_light: string | null;
    color_dark: string | null;
    created_at: string;
    updated_at: string;
    users_count?: number; // Added via withCount
    is_system_role?: boolean; // Added for system checks
    permissions?: Permission[]; // For Role Show page
    users?: (User & { pivot?: { expires_at: string | null } })[]; // For Role Show page
    can?: ModelCan;
}

export interface Permission {
    id: number;
    key: string;
    name: string;
    group: string | null;
    module: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    is_system_permission?: boolean; // Added for system checks
    can_edit?: boolean; // From backend policy
    roles?: Role[];
    users?: (User & { pivot?: { expires_at: string | null } })[];
    revokedUsers?: (User & { pivot?: { reason: string | null } })[];
    can?: ModelCan;
}

// =================================================================
// │ FORM DATA                                                     │
// =================================================================

export interface RoleFormData {
    key: string;
    name: string;
    description: string | null;
    level: number;
    is_default: boolean;
    color_light: string | null;
    color_dark: string | null;
}

export interface PermissionFormData {
    group: string | null;
    module: string | null;
    description: string | null;
}


// =================================================================
// │ ACCESS CONTROL DASHBOARD                                      │
// =================================================================
// These types define the data structure for the main dashboard page.

/** Basic statistics displayed in the top nodes. */
export interface DashboardStat {
    total_roles: number;
    total_permissions: number;
    total_users: number;
    expiring_assignments_count: number;
}

/** An item (role or permission) that is expiring soon for a user. */
export interface DashboardExpiringItem {
    user_id: number;
    username: string;
    item_name: string;
    item_id: number;
    item_type: 'Role' | 'Direct Permission';
    expires_at: string | null; // ISO Date string
}

/** A user with the all-powerful Super User permission. */
export interface DashboardSuperUser {
    id: number;
    username: string;
    email: string;
}

/** A log of a recent access control change. */
export interface DashboardRecentActivityItem {
   subject_id: number;
    subject_name: string;
    object_id: number;
    object_name: string;
    granter_name: string;
    event_type: 'role_assigned' | 'permission_granted';
    created_at: string; // ISO Date string
}

/** A simplified user object for the "Users Without Roles" list. */
export interface DashboardUserWithoutRole {
    id: number;
    username: string;
    email: string;
}

/** A simplified permission object for the "Unused Permissions" list. */
export interface DashboardUnusedPermission {
    id: number;
    name: string;
    key: string;
}

/** Permissions flags for the dashboard, controlling what the user can see. */
export interface DashboardCanFlags {
    viewAccessControlDashboard: boolean;
    viewAnyRole: boolean;
    createRole: boolean;
    viewAnyPermission: boolean;
    viewRolePermissions: boolean;
    viewAnyAccess: boolean;
    viewExpiringAssignments: boolean;
    viewSuperUsers: boolean;
    viewRecentActivity: boolean;
}

/** The main data structure for the entire Access Control Dashboard. */
export interface AccessControlDashboardData {
    stats: DashboardStat;
    can: DashboardCanFlags;
    expiring_threshold_days: number;
    // Optional properties based on permissions
    top_roles?: Role[];
    default_roles?: Role[];
    unused_permissions?: Permission[];
    users_without_roles?: UserAccess[]; 
    role_level_distribution?: Record<number, number>;
    expiring_items?: DashboardExpiringItem[];
    super_users?: User[]; // NEW
    recent_activity?: DashboardRecentActivityItem[]; // NEW
}


// =================================================================
// │ USER ACCESS MANAGEMENT (EDIT PAGE)                             │
// =================================================================
// These types are for the page where you edit a specific user's access.

/** A user object with detailed pivot data for editing their access. */
export interface TargetUserForEdit extends User {
    roles: (Role & {
        pivot?: {
            expires_at: string | null,
            granted_by_username?: string | null
        }
    })[];
    permissions: (Permission & {
        pivot?: {
            expires_at: string | null,
            granted_by_username?: string | null
        }
    })[];
    revokedPermissions: (Permission & {
        pivot?: {
            reason: string | null
        }
    })[];
}

/** A role object with extra flags for the assignment list. */
export interface SystemRoleForAssignment extends Role {
    is_system_role: boolean;
}

/** A permission object with extra flags for the assignment list. */
export interface SystemPermissionForAssignment extends Permission {
    is_undelegatable_by_actor: boolean;
    is_super_user_permission_itself: boolean;
    effective_status_on_target: 'direct' | 'inherited' | 'revoked' | 'none';
}

/** A helper type for grouping permissions by group and module. */
export interface GroupedSystemPermissions {
     [groupName: string]: {
        [moduleName: string]: SystemPermissionForAssignment[];
    };
}

/** The complete data structure for the User Access Edit page. */
export interface UserAccessEditData {
    user: TargetUserForEdit;
    allRoles: SystemRoleForAssignment[];
    allPermissionsGrouped: GroupedSystemPermissions;
    can: {
        assignRoles: boolean;
        assignDirectPermissions: boolean;
        revokePermission: boolean;
        restorePermission: boolean;
        actingUserIsSuperUser: boolean;
        targetUserIsSelf: boolean;
        targetUserIsSuperUserViaPermission: boolean;
        targetUserHasCoreSystemRole: boolean;
    };
}

// =================================================================
// │ API PAYLOADS                                                  │
// =================================================================
// These define the shape of data sent TO the API.

export interface UserRoleAssignmentItem {
    id: number;
    expires_at: string | null;
}
export interface UserRolesUpdatePayload {
    role_assignments: UserRoleAssignmentItem[];
}

export interface UserDirectPermissionAssignmentItem {
    id: number;
    expires_at: string | null;
}
export interface UserDirectPermissionsUpdatePayload {
    direct_permission_assignments: UserDirectPermissionAssignmentItem[];
}

export interface UserRevokePermissionPayload {
    reason: string | null;
}

export interface RolePermissionSyncPayload {
    permission_ids: number[];
}


// =================================================================
// │ MISC & LIST VIEWS                                             │
// =================================================================

/** A generic user object for listing purposes. */
export interface UserAccess {
    id: number;
    username: string;
    email: string;
    created_at: string;
    roles?: Role[];
    permissions?: Permission[];
    revoked_permissions?: Permission[];
}