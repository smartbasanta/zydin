export const PERMISSIONS = {
	SYSTEM: {
		SUPER_USER: 'system.super_user',
		NOTIFICATIONS: {
			VIEW_ANY: 'system.notification.viewAny',
			VIEW: 'system.notification.view',
			CREATE: 'system.notification.create',
			UPDATE: 'system.notification.update',
			DELETE: 'system.notification.delete',
			MANAGE: 'system.notification.manage',
		},
	},

	DASHBOARD: {
		VIEW: 'admin.dashboard.view',
	},

	ACCESS_CONTROL: {
		DASHBOARD: {
			VIEW: 'access_control.dashboard.view',
			VIEW_SUPER_USERS: 'access_control.super_users.view',
			VIEW_ACTIVITY: 'access_control.activity.view',
		},
		ROLES: {
			VIEW: 'access_control.roles.view',
			CREATE: 'access_control.roles.create',
			UPDATE: 'access_control.roles.update',
			DELETE: 'access_control.roles.delete',
		},
		ROLE_PERMISSIONS: {
			VIEW: 'access_control.roles.view_permissions',
			ASSIGN: 'access_control.roles.assign_permissions',
		},
		PERMISSIONS: {
			VIEW: 'access_control.permissions.view',
			CREATE: 'access_control.permissions.create',
			// UPDATE: 'access_control.permissions.update',
			// DELETE: 'access_control.permissions.delete',
		},
		USER_ACCESS: {
			REGISTER: 'access_control.user_access.register',
			VIEW: 'access_control.user_access.view',
			SELF_MANAGE: 'access_control.user_access.self_manage',
			SYNC_ROLES: 'access_control.user_access.sync_roles',
			SYNC_PERMISSIONS: 'access_control.user_access.sync_permissions',
			REVOKE_PERMISSION: 'access_control.user_access.revoke_permission',
			RESTORE_PERMISSION: 'access_control.user_access.restore_permission',
		},
	},

	SETTINGS: {
		DASHBOARD: {
			VIEW: 'settings.dashboard.view',
		},
		DATABASE: {
			VIEW: 'settings.database.backup.view',
			CREATE: 'settings.database.backup.create', // Note: Renamed from BACKUP for consistency
			DELETE: 'settings.database.backup.delete',
			MANAGE: 'settings.database.backup.manage',
			RESTORE: 'settings.database.restore',
		},
		CACHE: {
			VIEW: 'settings.cache.view', // Assuming a view permission for the page
			CLEAR: 'settings.database.cache.clear',
			MANAGE: 'settings.database.cache.manage',
			OPTIMIZE: 'settings.application.optimize',
			MANAGE_OPTIMIZATION: 'settings.application.optimization.manage', // Note: Renamed
			CLEAR_APPLICATION: 'settings.application.cache.clear',
			MANAGE_Application_CACHE: 'settings.application.cache.manage', // Corrected
		},
	},

	// --- CORE / GENERAL ADMIN ---
	CORE: {
		USERS: {
			VIEW_ANY: 'core.users.view_any',
			VIEW_SENSITIVE: 'core.users.view_sensitive',
			UPDATE_STATUS: 'core.users.update_status',
			UPDATE_PROFILE: 'core.users.update_profile',
			IMPERSONATE: 'core.users.impersonate',
			DELETE: 'core.users.delete',
			MANAGE_SESSIONS: 'core.users.manage_sessions',
		},
		REFERRALS: {
			VIEW: 'core.users.view_referrals',
			MANAGE: 'core.users.manage_referrals',
		},
		ACCOUNT_STATUSES: {
			VIEW: 'core.account_statuses.view',
			MANAGE: 'core.account_statuses.manage',
		},
		TABLE_PREFERENCES: {
			VIEW_ANY: 'core.table_preferences.view_any',
			RESET_ANY: 'core.table_preferences.reset_any',
			MANAGE_DEFAULTS: 'core.table_defaults.manage',
		},
	},

	// --- NEW: PRODUCTS MODULE ---
	PRODUCTS: {
		BRANDS: {
			VIEW_ANY: 'products.brands.viewAny',
			VIEW: 'products.brands.view',
			CREATE: 'products.brands.create',
			UPDATE: 'products.brands.update',
			DELETE: 'products.brands.delete',
		},
		PRODUCTS: {
			VIEW_ANY: 'products.products.viewAny',
			VIEW: 'products.products.view',
			CREATE: 'products.products.create',
			UPDATE: 'products.products.update',
			DELETE: 'products.products.delete',
		},
	},

	// --- NEW: CONTENT MODULE ---
	CONTENT: {
		ARTICLES: {
			VIEW_ANY: 'content.articles.viewAny',
			VIEW: 'content.articles.view',
			CREATE: 'content.articles.create',
			UPDATE: 'content.articles.update',
			DELETE: 'content.articles.delete',
		},
		NEWS_UPDATES: {
			VIEW_ANY: 'content.news_updates.viewAny',
			VIEW: 'content.news_updates.view',
			CREATE: 'content.news_updates.create',
			UPDATE: 'content.news_updates.update',
			DELETE: 'content.news_updates.delete',
		},
		PAGE_CONTENT: {
			VIEW_ANY: 'content.page_content.viewAny',
			// VIEWANY: 'content.page_content.viewAny',
			VIEW: 'content.page_content.view',
			UPDATE: 'content.page_content.update',
		},
	},

	// --- NEW: CAREERS MODULE ---
	CAREERS: {
		JOB_OPENINGS: {
			VIEW_ANY: 'careers.job_openings.viewAny',
			VIEW: 'careers.job_openings.view',
			CREATE: 'careers.job_openings.create',
			UPDATE: 'careers.job_openings.update',
			DELETE: 'careers.job_openings.delete',
		},
		JOB_APPLICATIONS: {
			VIEW_ANY: 'careers.job_applications.viewAny',
			VIEW: 'careers.job_applications.view',
			DELETE: 'careers.job_applications.delete',
		},
	},

	// --- NEW: CMS MODULE ---
	CMS: {
		LEADERS: {
			VIEW_ANY: 'cms.leaders.viewAny',
			VIEW: 'cms.leaders.view',
			CREATE: 'cms.leaders.create',
			UPDATE: 'cms.leaders.update',
			DELETE: 'cms.leaders.delete',
		},
		TESTIMONIALS: {
			VIEW_ANY: 'cms.testimonials.viewAny', 
			VIEW: 'cms.testimonials.view',
			CREATE: 'cms.testimonials.create',
			UPDATE: 'cms.testimonials.update',
			DELETE: 'cms.testimonials.delete',
		},
		CONTACT_SUBMISSIONS: {
			VIEW_ANY: 'cms.contact_submissions.viewAny', 
			VIEW: 'cms.contact_submissions.view',
			UPDATE: 'cms.contact_submissions.update',
			DELETE: 'cms.contact_submissions.delete',
		},
		CERTIFICATIONS: {
			VIEW_ANY: 'cms.certifications.viewAny', 
			VIEW: 'cms.certifications.view',
			CREATE: 'cms.certifications.create',
			UPDATE: 'cms.certifications.update',
			DELETE: 'cms.certifications.delete',
		},
		HERO_SLIDES: {
			VIEW_ANY: 'cms.hero_slides.viewAny', 
			VIEW: 'cms.hero_slides.view',
			MANAGE: 'cms.hero_slides.manage',
		},
		GALLERY_IMAGES: {
			VIEW_ANY: 'cms.gallery_images.viewAny', 
			VIEW: 'cms.gallery_images.view',
			MANAGE: 'cms.gallery_images.manage',
		},
	},

	// --- NEW: USER SELF-MANAGEMENT ---
	USER: {
		PROFILE: {
			VIEW_SELF: 'user.profile.view_self',
			UPDATE_SELF: 'user.profile.update_self',
			MANAGE_AVATAR: 'user.profile.manage_avatar',
		},
		ADDRESS: {
			VIEW_ANY_SELF: 'user.address.view_any_self',
			VIEW_SELF: 'user.address.view_self',
			CREATE_SELF: 'user.address.create_self',
			UPDATE_SELF: 'user.address.update_self',
			DELETE_SELF: 'user.address.delete_self',
		},
		SETTINGS: {
			VIEW_SELF: 'user.settings.view_self',
			MANAGE_PASSWORD: 'user.settings.manage_password',
			MANAGE_2FA: 'user.settings.manage_2fa',
			MANAGE_PRIVACY: 'user.settings.manage_privacy', 
			MANAGE_MOBILE_VERIFICATION: 'user.settings.manage_mobile_verification', 
			MANAGE_EMAIL_VERIFICATION: 'user.settings.manage_email_verification', 
			MANAGE_NOTIFICATION_PREFERENCES: 'user.settings.manage_notification_preferences', 
			MANAGE_ADS_PREFERENCE: 'user.settings.manage_ads_preference', 
			MANAGE_TERMS_ACCEPTANCE: 'user.settings.manage_terms_acceptance', 
			VIEW_LOGIN_HISTORY: 'user.settings.view_login_history', 
			CLOSE_ACCOUNT: 'user.settings.close_account',
		},
	},

	// --- USER MANAGEMENT (ADMIN) ---
	USER_MANAGEMENT: {
		PROFILE: {
			VIEW_ANY: 'user.profile.view_any', 
			MANAGE: 'user.profile.manage', 
		},
		ADDRESS: {
			VIEW_ANY: 'user.address.view_any', 
			MANAGE: 'user.address.manage', 
		},
		SETTINGS: {
			VIEW_ANY: 'user.settings.view_any', 
			MANAGE: 'user.settings.manage', 
		},
	},
} as const;