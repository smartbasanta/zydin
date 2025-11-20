<script setup lang="ts">
    import { PlusIcon } from 'lucide-vue-next';

    interface Props {
        to: string | object;
        title?: string;
    }
    const props = withDefaults(defineProps<Props>(), {
        title: 'Add New Item'
    });
</script>

<template>
    <router-link :to="props.to" class="btn btn-primary" :title="props.title">
        <PlusIcon class="size-5" />
        <span class="sr-only sm:not-sr-only sm:ml-1">Add New</span>
    </router-link>
</template>