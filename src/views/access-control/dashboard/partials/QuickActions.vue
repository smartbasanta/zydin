<script setup lang="ts">
import { ZapIcon, PlusIcon } from "lucide-vue-next";
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
    <div v-if="can"
        class="bg-white dark:bg-gray-1100 p-6 rounded-lg border border-gray-200 dark:border-gray-900 shadow-xl shadow-black/10 dark:shadow-black/25">
        <div class="flex items-center gap-3 mb-5">
            <ZapIcon class="size-7 text-blue-600 dark:text-blue-400" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
        </div>
        <div class="space-y-4">
            <button v-if="can.createRole" @click="navigateTo('access-control.roles.create')"
                class="btn btn-primary w-full text-base py-3 bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-blue-400">
                <PlusIcon class="size-5" /> Create New Role
            </button>
            
            <div v-if="defaultRoles.length" class="pt-2">
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    Default Roles on User Creation:
                </p>
                <div class="space-y-2">
                    <router-link v-for="role in defaultRoles" :key="role.id" :to="{ name: 'access-control.roles.show', params: { id: role.id } }"
                        class="group p-3 rounded-md bg-gray-50 dark:bg-gray-1000/70 hover:bg-gray-100 dark:hover:bg-gray-950/80 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-200 block">
                        <div class="flex items-center justify-between">
                            <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 text-sm">{{ role.name }}</span>
                            <span class="px-2 py-0.5 rounded-full text-[0.7rem] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                Lvl: {{ role.level }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>