import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStateStore = defineStore('globalState', {
    state: () => ({
        activeRequests: 0, // Track ongoing API calls
        isUnauthorized: false, // Track 403 errors
        componentLoadingMap: {} as Record<string, boolean>
    }),
    actions: {
        incrementLoading() { // global
            this.activeRequests += 1;
        },
        decrementLoading() {
            this.activeRequests = Math.max(0, this.activeRequests - 1);
        },

        setComponentLoading(name: string, value: boolean) { // component level
            this.componentLoadingMap[name] = value;
        },
       
        setUnauthorized(value: boolean) {
            this.isUnauthorized = value;
        },
        resetState() {
            this.activeRequests = 0;
            this.isUnauthorized = false;
            // this.componentLoadingMap = {};
        }
    },
    getters: {
        isLoading: (state) => state.activeRequests > 0,
        isComponentLoading: (state) => (name: string) => {
            return !!state.componentLoadingMap[name];
        }
    },
});