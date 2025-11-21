<script setup lang="ts">
import { UserPlus2Icon } from 'lucide-vue-next';
</script>

<template>
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h1 class="text-3xl font-bold section-title">Admin Dashboard</h1>
            <p class="section-description">Welcome back, here's a real-time overview of Zydin Biotech's platform.</p>
        </div>
        <!-- Button now uses the consistent, theme-aware `btn` class -->
        <button class="btn btn-primary">
            <UserPlus2Icon class="w-4 h-4" />
            <span>Create New User</span>
        </button>
    </div>
</template>