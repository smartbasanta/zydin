<script setup lang="ts">
import { ZapIcon, PlusIcon, ShieldIcon, ChevronRightIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import type { Role } from "@/types/access-control";

const router = useRouter();

defineProps<{
    can: {
        createRole?: boolean
    } | undefined;
    defaultRoles: Role[];
}>();

const navigateTo = (routeName: string) => {
    router.push({ name: routeName });
};
</script>

<template>
    <div v-if="can" class="quick-actions-card">
        <!-- Header -->
        <div class="card-header">
            <div class="icon-wrapper">
                <ZapIcon class="size-5" />
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold section-title">Quick Actions</h3>
                <p class="text-xs section-title">Common tasks and system defaults</p>
            </div>
        </div>

        <!-- Content -->
        <div class="card-body section-bg">
            <!-- Primary Action -->
            <button v-if="can.createRole" @click="navigateTo('access-control.roles.create')"
                class="btn btn-primary w-full justify-center py-3 shadow-lg shadow-primary-500/20 mb-6">
                <PlusIcon class="size-5" />
                Create New Role
            </button>
            
            <!-- Default Roles Section -->
            <div v-if="defaultRoles.length" class="border-t border-dashed border-muted pt-4">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-xs font-bold uppercase tracking-wider text-muted">
                        Default System Roles
                    </p>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-muted">
                        Auto-assigned
                    </span>
                </div>

                <div class="space-y-2">
                    <router-link 
                        v-for="role in defaultRoles" 
                        :key="role.id" 
                        :to="{ name: 'access-control.roles.show', params: { id: role.id } }"
                        class="role-item group"
                    >
                        <div class="flex items-center gap-3">
                            <div class="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-primary-500 transition-colors">
                                <ShieldIcon class="size-4" />
                            </div>
                            <div class="flex flex-col">
                                <span class="text-sm font-semibold section-title group-hover:text-primary-600 transition-colors">
                                    {{ role.name }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded border border-muted text-muted">
                                Lvl {{ role.level }}
                            </span>
                            <ChevronRightIcon class="size-4 text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.quick-actions-card {
    @apply flex flex-col rounded-2xl border overflow-hidden transition-all duration-300;
    background-color: var(--card-bg);
    border-color: var(--card-border);
    box-shadow: var(--shadow-md);
}

.card-header {
    @apply flex items-center gap-3 p-5 border-b border-muted section-bg;
}

.icon-wrapper {
    @apply flex items-center justify-center w-10 h-10 rounded-xl;
    /* Primary color theme for general actions */
    background-color: color-mix(in srgb, var(--color-primary-500) 15%, transparent);
    color: var(--color-primary-500);
}

.card-body {
    @apply p-5 flex-1;
}

.role-item {
    @apply flex items-center justify-between p-2.5 rounded-xl border border-transparent transition-all duration-200;
    background-color: var(--section-bg);
}

.role-item:hover {
    border-color: var(--color-primary-300);
    background-color: color-mix(in srgb, var(--color-primary-500) 5%, transparent);
    transform: translateX(2px);
}
:global(.dark) .role-item:hover {
    border-color: var(--color-primary-700);
}
</style>