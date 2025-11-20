import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        isDesktopOpen: localStorage.getItem('sidebar_desktop_open') !== null
            ? localStorage.getItem('sidebar_desktop_open') === 'true'
            : true,
        isMobileOpen: false,
    }),
    actions: {
        toggleDesktop() {
            this.isDesktopOpen = !this.isDesktopOpen;
            localStorage.setItem('sidebar_desktop_open', String(this.isDesktopOpen));
        },
        toggleMobile() {
            this.isMobileOpen = !this.isMobileOpen;
        },
        closeMobile() {
            this.isMobileOpen = false;
        }
    }
});