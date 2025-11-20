import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const publicRoutes: RouteRecordRaw = {
    path: '/',
    component: AppLayout,
    children: [
        {
            path: '',
            name: 'home',
            component: () => import('@/views/homepage/Homepage.vue'),
        },
        {
            path: 'about',
            children: [
                { path: '', name: 'about', component: () => import('@/views/aboutpage/index.vue') },
                { path: 'leadership', name: 'about.leadership-team', component: () => import('@/views/aboutpage/leadershipTeam.vue') },
                { path: 'leader/:id', name: 'about.leader-detail', component: () => import('@/views/aboutpage/LeaderDetail.vue') },
                { path: 'certifications', name: 'about.certifications', component: () => import('@/views/aboutpage/certifications.vue') }
            ],
        },
        {
            path: 'products',
            children: [
                { path: '', name: 'products', component: () => import('@/views/productspage/ProductsOverview.vue') },
                { path: '/products/brands', name: 'products.by-brand', component: () => import('@/views/productspage/ProductsByBrandView.vue') },
                { path: '/products/categories', name: 'products.by-category', component: () => import('@/views/productspage/ProductsByCategoryView.vue') },
                { path: '/products/:slug', name: 'products.detail', component: () => import('@/views/productspage/ProductDetailView.vue') },
            ],
        },
        {
            path: '/media',
            children: [
                {
                    path: '',
                    redirect: 'media/news',
                },
                {
                    path: 'news',
                    children: [
                        {
                            path: '',
                            name: 'media.news',
                            component: () => import('@/views/newsAndUpdatespage/NewsAndUpdates.vue')
                        },
                        {
                            path: ':slug',
                            name: 'media.news-detail',
                            component: () => import('@/views/newsAndUpdatespage/NewsAndUpdatesDetails.vue')
                        },
                    ],
                },
                {
                    path: 'articles',
                    children: [
                        {
                            path: '',
                            name: 'media.articles',
                            component: () => import('@/views/articlesAndBlogspage/ArticlesAndBlogs.vue')
                        },
                        {
                            // Corrected the name to be more consistent
                            path: ':slug',
                            name: 'media.articles-detail',
                            component: () => import('@/views/articlesAndBlogspage/ArticlesAndBlogsDetails.vue')
                        },
                    ],
                },
            ],
        },
        {
            path: '/career',
            name: 'career',
            component: () => import('@/views/career/CareerPage.vue')
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('@/views/contact/ContactUsPage.vue')
        },
        {
            path: 'verify-email/:id/:hash',
            name: 'verify-email',
            component: () => import('@/views/auth/EmailVerifying.vue'),
            props: route => ({ id: route.query.id, hash: route.query.hash })
        },
    ],
};

export default publicRoutes;