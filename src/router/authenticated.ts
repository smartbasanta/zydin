import type { RouteRecordRaw } from 'vue-router';

import AuthLayout from "@/layouts/AuthLayout.vue";
import { PERMISSIONS } from '@/constants/permission/permissions';

const authenticatedRoutes: RouteRecordRaw =
{
	path: "/",
	component: AuthLayout,
	redirect: { name: "dashboard" },
	meta: {
		requiresAuth: true,
	},
	children: [
		{
			path: "dashboard",
			meta: { title: "Dashboard" },
			children: [
				{
					path: "",
					name: "dashboard.index",
					meta: {
						title: "Dashboard",
						permission: PERMISSIONS.DASHBOARD,
						breadcrumb: [
							{ label: "Dashboard" }
						],
					},
					component: () => import("@/views/dashboard/Dashboard.vue"),
				},
				{
					path: 'register',
					name: 'register',
					meta: {
						title: "Dashboard",
						permission: PERMISSIONS.ACCESS_CONTROL.USER_ACCESS.REGISTER,
						breadcrumb: [
							{ label: "Dashboard" }
						],
					},
					component: () => import('@/views/auth/Register.vue'),
				},
				// {
				// 	path: "manage-page",
				// 	name: "dashboard.manage-page.index",
				// 	meta: {
				// 		title: "Page Management",
				// 		permission: PERMISSIONS.CONTENT.PAGE_CONTENT,
				// 		breadcrumb: [
				// 			{ label: "Pages", to: { name: "dashboard.manage-page.index" } }
				// 		],
				// 	},
				// 	component: () => import("@/views/backend/home_page/Index.vue"),
				// },

				{
					path: "content", // The base path for your content management hub
					name: "dashboard.content.index", // The route for the hub/index page
					meta: {
						title: "Page Management",
						permission: PERMISSIONS.CONTENT.PAGE_CONTENT.VIEW_ANY, // Use viewAny permission
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } }
						],
					},
					// This component is your hub page
					component: () => import("@/views/backend/content/Index.vue"), // Rename home_page -> content
				},
				{
					path: "content/:pageSlug", // The dynamic route for editing ANY page
					name: "dashboard.content.manage", // The route for the editor component
					meta: {
						title: "Manage Page Content", // We can make this dynamic later if needed
						permission: PERMISSIONS.CONTENT.PAGE_CONTENT.VIEW,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							// The final breadcrumb item will be dynamic based on the pageSlug
							{ label: "Edit" }
						],
					},
					// This is your generic editor component from the previous step
					component: () => import("@/views/backend/content/ManagePageContent.vue"),
				},
				//hero-slides
				{
					path: "hero-slides",
					name: "dashboard.hero-slides.index",
					meta: {
						title: "Hero Slide Management",
						permission: PERMISSIONS.CMS.HERO_SLIDES,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Hero", to: { name: "dashboard.hero-slides.index" } }
						],
					},
					component: () => import("@/views/backend/hero_section/Index.vue"),
				},
				{
					path: "hero-slides/create",
					name: "dashboard.hero-slides.create",
					meta: {
						title: "Create new Hero Slide",
						permission: PERMISSIONS.CMS.HERO_SLIDES.MANAGE,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Hero", to: { name: "dashboard.hero-slides.index" } },
							{ label: "create", to: { name: "dashboard.hero-slides.create" } }
						],
					},
					component: () => import("@/views/backend/hero_section/Create.vue"),
				},
				{
					path: "hero-slides/:id/show",
					name: "dashboard.hero-slides.show",
					meta: {
						title: "Hero Slide details",
						permission: PERMISSIONS.CMS.HERO_SLIDES.VIEW,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Hero", to: { name: "dashboard.hero-slides.index" } },
							{ label: "Show", to: { name: "dashboard.hero-slides.show" } }
						],
					},
					component: () => import("@/views/backend/hero_section/Show.vue"),
				},
				{
					path: "hero-slides/:id/edit",
					name: "dashboard.hero-slides.edit",
					meta: {
						title: "Edit Hero Slide",
						permission: PERMISSIONS.CMS.HERO_SLIDES.MANAGE,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Hero", to: { name: "dashboard.hero-slides.index" } },
							{ label: "Edit", to: { name: "dashboard.hero-slides.edit" } }
						],
					},
					component: () => import("@/views/backend/hero_section/Edit.vue"),
				},
				//about-us
				// {
				// 	path: "about-us/show",
				// 	name: "dashboard.about-us.show",
				// 	meta: {
				// 		title: "About Company Management",
				// 		permission: PERMISSIONS.CONTENT.PAGE_CONTENT.VIEW,
				// 		breadcrumb: [
				// 			{ label: "about-us", to: { name: "dashboard.about-us.show" } }
				// 		],
				// 	},
				// 	component: () => import("@/views/backend/about_us/ManagePageContent.vue"),
				// },

				//gallery-images
				{
					path: "gallery",
					name: "dashboard.gallery.index",
					meta: {
						title: "Gallery Management",
						permission: PERMISSIONS.CMS.GALLERY_IMAGES,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Gallery", to: { name: "dashboard.gallery.index" } }
						],
					},
					component: () => import("@/views/backend/gallery_section/Index.vue"),
				},
				{
					path: "gallery/create",
					name: "dashboard.gallery.create",
					meta: {
						title: "Create new Gallery Item",
						permission: PERMISSIONS.CMS.GALLERY_IMAGES.MANAGE,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Gallery", to: { name: "dashboard.gallery.index" } },
							{ label: "create", to: { name: "dashboard.gallery.create" } }
						],
					},
					component: () => import("@/views/backend/gallery_section/Create.vue"),
				},
				{
					path: "gallery/:id/show",
					name: "dashboard.gallery.show",
					meta: {
						title: "Gallery Item details",
						permission: PERMISSIONS.CMS.GALLERY_IMAGES.VIEW,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Gallery", to: { name: "dashboard.gallery.index" } },
							{ label: "Show", to: { name: "dashboard.gallery.show" } }
						],
					},
					component: () => import("@/views/backend/gallery_section/Show.vue"),
				},
				{
					path: "gallery/:id/edit",
					name: "dashboard.gallery.edit",
					meta: {
						title: "Edit Gallery Item",
						permission: PERMISSIONS.CMS.GALLERY_IMAGES.MANAGE,
						breadcrumb: [
							{ label: "Content Management", to: { name: "dashboard.content.index" } },
							{ label: "Gallery", to: { name: "dashboard.gallery.index" } },
							{ label: "Edit", to: { name: "dashboard.gallery.edit" } }
						],
					},
					component: () => import("@/views/backend/gallery_section/Edit.vue"),
				},

				//product related routes
				{
					path: "products",
					name: "dashboard.products.index",
					meta: {
						title: "Products",
						permission: PERMISSIONS.PRODUCTS.PRODUCTS,
						breadcrumb: [
							{ label: "Products", to: { name: "dashboard.products.index" } }
						],
					},
					component: () => import("@/views/backend/products_and_brands/products/Index.vue"),
				},
				{
					path: "products/create",
					name: "dashboard.products.create",
					meta: {
						title: "Create Product",
						permission: PERMISSIONS.PRODUCTS.PRODUCTS.CREATE,
						breadcrumb: [
							{ label: "Products", to: { name: "dashboard.products.index" } },
							{ label: "Create", to: { name: "dashboard.products.create" } }
						],
					},
					component: () => import("@/views/backend/products_and_brands/products/Create.vue"),
				},
				{
					path: "products/:id/show",
					name: "dashboard.products.show",
					meta: {
						title: "Show Product",
						permission: PERMISSIONS.PRODUCTS.PRODUCTS.VIEW,
						breadcrumb: [
							{ label: "Products", to: { name: "dashboard.products.index" } },
							{ label: "Show", to: { name: "dashboard.products.show" } }
						],
					},
					component: () => import("@/views/backend/products_and_brands/products/Show.vue"),
				},
				{
					path: "products/:id/edit",
					name: "dashboard.products.edit",
					meta: {
						title: "Edit Product",
						permission: PERMISSIONS.PRODUCTS.PRODUCTS.UPDATE,
						breadcrumb: [
							{ label: "Products", to: { name: "dashboard.products.index" } },
							{ label: "Edit", to: { name: "dashboard.products.edit" } }
						],
					},
					component: () => import("@/views/backend/products_and_brands/products/Edit.vue"),
				},

				//Brands related
				{
					path: "brands",
					name: "dashboard.brands.index",
					meta: {
						title: "Brands",
						permission: PERMISSIONS.PRODUCTS.BRANDS,
						breadcrumb: [
							{ label: "Brands", to: { name: "dashboard.brands.index" } },
						]
					},
					component: () => import("@/views/backend/products_and_brands/brands/Index.vue"),
				},
				{
					path: "brands/create",
					name: "dashboard.brands.create",
					meta: {
						title: "Create Brand",
						permission: PERMISSIONS.PRODUCTS.BRANDS.CREATE,
						breadcrumb: [
							{ label: "Brands", to: { name: "dashboard.brands.index" } },
							{ label: "Create", to: { name: "dashboard.brands.create" } }
						]
					},
					component: () => import("@/views/backend/products_and_brands/brands/Create.vue"),
				},
				{
					path: "brands/:id/show",
					name: "dashboard.brands.show",
					meta: {
						title: "Brand Details",
						permission: PERMISSIONS.PRODUCTS.BRANDS.VIEW,
						breadcrumb: [
							{ label: "Brands", to: { name: "dashboard.brands.index" } },
							{ label: "Show", to: { name: "dashboard.brands.show" } }
						]
					},
					component: () => import("@/views/backend/products_and_brands/brands/Show.vue"),
				},
				{
					path: "brands/:id/edit",
					name: "dashboard.brands.edit",
					meta: {
						title: "Edit Brand",
						permission: PERMISSIONS.PRODUCTS.BRANDS.UPDATE,
						breadcrumb: [
							{ label: "Brands", to: { name: "dashboard.brands.index" } },
							{ label: "Edit", to: { name: "dashboard.brands.edit" } }
						]
					},
					component: () => import("@/views/backend/products_and_brands/brands/Edit.vue"),
				},

				//leaders related
				{
					path: "leaders",
					name: "dashboard.leaders.index",
					meta: {
						title: "Leaders",
						permission: PERMISSIONS.CMS.LEADERS,
						breadcrumb: [
							{ label: "Leaders", to: { name: "dashboard.leaders.index" } },
						]
					},
					component: () => import("@/views/backend/leaders/Index.vue"),
				},
				{
					path: "leaders/create",
					name: "dashboard.leaders.create",
					meta: {
						title: "Create Leader",
						permission: PERMISSIONS.CMS.LEADERS.CREATE,
						breadcrumb: [
							{ label: "Leaders", to: { name: "dashboard.leaders.index" } },
							{ label: "Create", to: { name: "dashboard.leaders.create" } }
						]
					},
					component: () => import("@/views/backend/leaders/Create.vue"),
				},
				{
					path: "leaders/:id/show",
					name: "dashboard.leaders.show",
					meta: {
						title: "Show Leader",
						permission: PERMISSIONS.CMS.LEADERS.VIEW,
						breadcrumb: [
							{ label: "Leaders", to: { name: "dashboard.leaders.index" } },
							{ label: "Show", to: { name: "dashboard.leaders.show" } }
						]
					},
					component: () => import("@/views/backend/leaders/Show.vue"),
				},
				{
					path: "leaders/:id/edit",
					name: "dashboard.leaders.edit",
					meta: {
						title: "Edit Leader",
						permission: PERMISSIONS.CMS.LEADERS.UPDATE,
						breadcrumb: [
							{ label: "Leaders", to: { name: "dashboard.leaders.index" } },
							{ label: "Edit", to: { name: "dashboard.leaders.edit" } }
						]
					},
					component: () => import("@/views/backend/leaders/Edit.vue"),
				},

				//certifications related
				{
					path: "certifications",
					name: "dashboard.certifications.index",
					meta: {
						title: "Certifications",
						permission: PERMISSIONS.CMS.CERTIFICATIONS,
						breadcrumb: [
							{ label: "Certifications", to: { name: "dashboard.certifications.index" } },
						]
					},
					component: () => import("@/views/backend/certifications/Index.vue"),
				},
				{
					path: "certifications/create",
					name: "dashboard.certifications.create",
					meta: {
						title: "Add Certificate",
						permission: PERMISSIONS.CMS.CERTIFICATIONS.CREATE,
						breadcrumb: [
							{ label: "Certifications", to: { name: "dashboard.certifications.index" } },
							{ label: "Create", to: { name: "dashboard.certifications.create" } }
						]
					},
					component: () => import("@/views/backend/certifications/Create.vue"),
				},
				{
					path: "certifications/:id/show",
					name: "dashboard.certifications.show",
					meta: {
						title: "Show Certificate",
						permission: PERMISSIONS.CMS.CERTIFICATIONS.VIEW,
						breadcrumb: [
							{ label: "Certifications", to: { name: "dashboard.certifications.index" } },
							{ label: "Show", to: { name: "dashboard.certifications.show" } }
						]
					},
					component: () => import("@/views/backend/certifications/Show.vue"),
				},
				{
					path: "certifications/:id/edit",
					name: "dashboard.certifications.edit",
					meta: {
						title: "Edit Certificate",
						permission: PERMISSIONS.CMS.CERTIFICATIONS.UPDATE,
						breadcrumb: [
							{ label: "Certifications", to: { name: "dashboard.certifications.index" } },
							{ label: "Edit", to: { name: "dashboard.certifications.edit" } }
						]
					},
					component: () => import("@/views/backend/certifications/Edit.vue"),
				},

				//articles related
				{
					path: "articles",
					name: "dashboard.articles.index",
					meta: {
						title: "Articles",
						permission: PERMISSIONS.CONTENT.ARTICLES,
						breadcrumb: [
							{ label: "Articles", to: { name: "dashboard.articles.index" } },
						]
					},
					component: () => import("@/views/backend/articles_and_news/articles/Index.vue"),
				},
				{
					path: "articles/create",
					name: "dashboard.articles.create",
					meta: {
						title: "Create Article",
						permission: PERMISSIONS.CONTENT.ARTICLES.CREATE,
						breadcrumb: [
							{ label: "Articles", to: { name: "dashboard.articles.index" } },
							{ label: "Create", to: { name: "dashboard.articles.create" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/articles/Create.vue"),
				},
				{
					path: "articles/:id/show",
					name: "dashboard.articles.show",
					meta: {
						title: "Show Article",
						permission: PERMISSIONS.CONTENT.ARTICLES.VIEW,
						breadcrumb: [
							{ label: "Articles", to: { name: "dashboard.articles.index" } },
							{ label: "Show", to: { name: "dashboard.articles.show" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/articles/Show.vue"),
				},
				{
					path: "articles/:id/edit",
					name: "dashboard.articles.edit",
					meta: {
						title: "Edit Article",
						permission: PERMISSIONS.CONTENT.ARTICLES.UPDATE,
						breadcrumb: [
							{ label: "Articles", to: { name: "dashboard.articles.index" } },
							{ label: "Edit", to: { name: "dashboard.articles.edit" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/articles/Edit.vue"),
				},

				//news related
				{
					path: "news",
					name: "dashboard.news.index",
					meta: {
						title: "News",
						permission: PERMISSIONS.CONTENT.NEWS_UPDATES,
						breadcrumb: [
							{ label: "News", to: { name: "dashboard.news.index" } },
						]
					},
					component: () => import("@/views/backend/articles_and_news/news/Index.vue"),
				},
				{
					path: "news/create",
					name: "dashboard.news.create",
					meta: {
						title: "Create News",
						permission: PERMISSIONS.CONTENT.NEWS_UPDATES.CREATE,
						breadcrumb: [
							{ label: "News", to: { name: "dashboard.news.index" } },
							{ label: "Create", to: { name: "dashboard.news.create" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/news/Create.vue"),
				},
				{
					path: "news/:id/show",
					name: "dashboard.news.show",
					meta: {
						title: "Show News",
						permission: PERMISSIONS.CONTENT.NEWS_UPDATES.VIEW,
						breadcrumb: [
							{ label: "News", to: { name: "dashboard.news.index" } },
							{ label: "Show", to: { name: "dashboard.news.show" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/news/Show.vue"),
				},
				{
					path: "news/:id/edit",
					name: "dashboard.news.edit",
					meta: {
						title: "Edit News",
						permission: PERMISSIONS.CONTENT.NEWS_UPDATES.UPDATE,
						breadcrumb: [
							{ label: "News", to: { name: "dashboard.news.index" } },
							{ label: "Edit", to: { name: "dashboard.news.edit" } }
						]
					},
					component: () => import("@/views/backend/articles_and_news/news/Edit.vue"),
				},

				//jobs related
				{
					path: "jobs",
					name: "dashboard.jobs.index",
					meta: {
						title: "Jobs",
						permission: PERMISSIONS.CAREERS.JOB_OPENINGS,
						breadcrumb: [
							{ label: "Jobs", to: { name: "dashboard.jobs.index" } },
						]
					},
					component: () => import("@/views/backend/jobs/Index.vue"),
				},
				{
					path: "jobs/create",
					name: "dashboard.jobs.create",
					meta: {
						title: "Create Job",
						permission: PERMISSIONS.CAREERS.JOB_OPENINGS.CREATE,
						breadcrumb: [
							{ label: "Jobs", to: { name: "dashboard.jobs.index" } },
							{ label: "Create", to: { name: "dashboard.jobs.create" } }
						]
					},
					component: () => import("@/views/backend/jobs/Create.vue"),
				},
				{
					path: "jobs/:id/show",
					name: "dashboard.jobs.show",
					meta: {
						title: "Show Job",
						permission: PERMISSIONS.CAREERS.JOB_OPENINGS.VIEW,
						breadcrumb: [
							{ label: "Jobs", to: { name: "dashboard.jobs.index" } },
							{ label: "Show", to: { name: "dashboard.jobs.show" } }
						]
					},
					component: () => import("@/views/backend/jobs/Show.vue"),
				},
				{
					path: "jobs/:id/edit",
					name: "dashboard.jobs.edit",
					meta: {
						title: "Edit Job",
						permission: PERMISSIONS.CAREERS.JOB_OPENINGS.UPDATE,
						breadcrumb: [
							{ label: "Jobs", to: { name: "dashboard.jobs.index" } },
							{ label: "Edit", to: { name: "dashboard.jobs.edit" } }
						]
					},
					component: () => import("@/views/backend/jobs/Edit.vue"),
				},

				//testimonials related
				{
					path: "testimonials",
					name: "dashboard.testimonials.index",
					meta: {
						title: "Testimonials",
						permission: PERMISSIONS.CMS.TESTIMONIALS,
						breadcrumb: [
							{ label: "Testimonials", to: { name: "dashboard.testimonials.index" } },
						]
					},
					component: () => import("@/views/backend/testimonials/Index.vue"),
				},
				{
					path: "testimonials/create",
					name: "dashboard.testimonials.create",
					meta: {
						title: "Add Testimonial",
						permission: PERMISSIONS.CMS.TESTIMONIALS.CREATE,
						breadcrumb: [
							{ label: "Testimonials", to: { name: "dashboard.testimonials.index" } },
							{ label: "Create", to: { name: "dashboard.testimonials.create" } }
						]
					},
					component: () => import("@/views/backend/testimonials/Create.vue"),
				},
				{
					path: "testimonials/:id/show",
					name: "dashboard.testimonials.show",
					meta: {
						title: "View Testimonials",
						permission: PERMISSIONS.CMS.TESTIMONIALS.VIEW,
						breadcrumb: [
							{ label: "Testimonials", to: { name: "dashboard.testimonials.index" } },
							{ label: "Show", to: { name: "dashboard.testimonials.show" } }
						]
					},
					component: () => import("@/views/backend/testimonials/Show.vue"),
				},
				{
					path: "testimonials/:id/edit",
					name: "dashboard.testimonials.edit",
					meta: {
						title: "Edit Testimonials",
						permission: PERMISSIONS.CMS.TESTIMONIALS.UPDATE,
						breadcrumb: [
							{ label: "Testimonials", to: { name: "dashboard.testimonials.index" } },
							{ label: "Edit", to: { name: "dashboard.testimonials.edit" } }
						]
					},
					component: () => import("@/views/backend/testimonials/Edit.vue"),
				},

				//Contact Queries related
				{
					path: "contact-submissions",
					name: "dashboard.contact-submissions.index",
					meta: {
						title: "Contact Queries",
						permission: PERMISSIONS.CMS.CONTACT_SUBMISSIONS,
						breadcrumb: [
							{ label: "Contact Queries", to: { name: "dashboard.contact-submissions.index" } },
						]
					},
					component: () => import("@/views/backend/contacts/Index.vue"),
				},
				{
					path: "contact-submissions/:id/show",
					name: "dashboard.contact-submissions.show",
					meta: {
						title: "View Contact Query",
						permission: PERMISSIONS.CMS.CONTACT_SUBMISSIONS.VIEW,
						breadcrumb: [
							{ label: "Contact Queries", to: { name: "dashboard.contact-submissions.index" } },
							{ label: "Show", to: { name: "dashboard.contact-submissions.show" } }
						]
					},
					component: () => import("@/views/backend/contacts/Show.vue"),
				},

				//Job applications related
				{
					path: "job-applications",
					name: "dashboard.job-applications.index",
					meta: {
						title: "Job Applications",
						permission: PERMISSIONS.CAREERS.JOB_APPLICATIONS,
						breadcrumb: [
							{ label: "Job Applications", to: { name: "dashboard.job-applications.index" } },
						]
					},
					component: () => import("@/views/backend/job_applications/Index.vue"),
				},
				{
					path: "job-applications/:id/show",
					name: "dashboard.job-applications.show",
					meta: {
						title: "View Job Application",
						permission: PERMISSIONS.CAREERS.JOB_APPLICATIONS.VIEW,
						breadcrumb: [
							{ label: "Job Applications", to: { name: "dashboard.job-applications.index" } },
							{ label: "Show", to: { name: "dashboard.job-applications.show" } }
						]
					},
					component: () => import("@/views/backend/job_applications/Show.vue"),
				},
			]
		},
		{
			path: "unauthorized",
			name: "unauthorized",
			meta: { title: "403 - Forbidden" },
			component: () => import("@/views/errors/Unauthorized.vue"),
		},
	],
};

export default authenticatedRoutes;