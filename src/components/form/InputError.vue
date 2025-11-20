<script setup lang="ts">
    defineProps<{
        error?: string | string[] | null;
    }>();
</script>

<template>
    <div v-if="error">
        <em v-if="typeof error === 'string'" class="text-red-600 dark:text-red-400 text-xs mt-1">
            {{ error }}
        </em>
        <div v-else-if="Array.isArray(error)">
            <ul>
                <li v-for="(err, index) in error" :key="index">
                    <em class="text-red-600 dark:text-red-400 text-xs mt-1">
                        {{ err }}
                    </em>
                </li>
            </ul>
        </div>
    </div>
</template>
