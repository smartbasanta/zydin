<script setup lang="ts">
defineProps<{
    label: string;
    value?: string | number | null;
}>();
</script>

<template>
    <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-gray-50">{{ value || 'N/A' }}</dd>
    </div>
</template>