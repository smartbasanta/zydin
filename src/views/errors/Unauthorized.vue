<script setup lang="ts">
    import ErrorUnauthorized from "@/components/errors/ErrorUnauthorized.vue";
</script>

<template>
    <ErrorUnauthorized :can-retry="false" />
</template>