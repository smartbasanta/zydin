<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { EyeIcon } from 'lucide-vue-next';

withDefaults(
    defineProps<{
        to: RouteLocationRaw;
        size?: 'xs' | 'sm' | 'md' | 'lg';
    }>(),
    {
        size: 'md',
    }
);
</script>

<template>
    <RouterLink
        :to="to"
        class="btn btn-secondary rounded-3xl"
        :class="{
            'btn-xs': size === 'xs',
            'btn-sm': size === 'sm',
            'btn-lg': size === 'lg',
        }"
        title="View Details"
    >
        <EyeIcon class="size-4" /> View
    </RouterLink>
</template>