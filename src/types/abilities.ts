/**
 * Basic ability names.
 */
export type AbilityKey =
	| 'view'
	| 'create'
	| 'update'
	| 'delete'
	| 'assign'
	| 'approve'
	| 'archive'
	| 'restore'
	| 'bulk_delete';

/**
 * Reusable 'can' permission structure.
 * Used in Role, User, Post, etc.
 */
export interface ModelCan {
	viewAny?: boolean;
	view?: boolean;
	create?: boolean;
	update?: boolean;
	delete?: boolean;
	[key: string]: boolean | undefined; // Supports custom actions like 'assign', 'approve' if provided
}

/**
 * Full permission object.
 * Used when fetching or assigning permissions.
 */
export interface Permission {
	id: number;
	key: string; // e.g., "access_control.roles.update"
	name: string; // e.g., "Update Role"
	group: string;
	module: string;
	description?: string;
}

/**
 * Permission groupings.
 * Useful for organizing permissions in the UI.
 */
export interface RolePermissionBundle {
	group: string;
	module: string;
	permissions: Permission[];
}

/**
 * Optional: Sync this with Laravel SystemPermission enum
 * We will use this later.
 */
export const SystemPermissions = {
	SUPER_USER: 'system.super_user',
} as const;

export type SystemPermissionKey = keyof typeof SystemPermissions;
export type SystemPermissionValue = (typeof SystemPermissions)[SystemPermissionKey];

/**
 * Optional: Sync this with Laravel SystemRoles enum
 * We will use this later.
 */
export const SystemRoles = {
	SUPER_ADMIN: 'super_admin',
	DEVELOPER: 'developer',
	ADMIN: 'admin',
	MODERATOR: 'moderator',
	FILE_MANAGER: 'filemanager',
	EVENT_ORGANIZER: 'event_organizer',
	STREAMER: 'streamer',
	MERCHANT: 'merchant',
	EDITOR: 'editor',
	CREATOR: 'creator',
	PLAYER: 'player',
	COMMENTER: 'commenter',
	USER: 'user',
	GUEST: 'guest',
} as const;

export type SystemRoleKey = keyof typeof SystemRoles;
export type SystemRoleValue = (typeof SystemRoles)[SystemRoleKey];