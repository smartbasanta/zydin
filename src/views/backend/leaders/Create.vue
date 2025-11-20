<script setup lang="ts">
import { useRouter } from "vue-router";
import { SaveButton, CancelButton } from "@/components/button";
import CRUDCard from "@/components/card/CRUDCard.vue";
import { useLeaderFormAPI } from "@/composables/form/leader/useLeaderFormAPI";
import LeaderFormPartial from "./partials/LeaderFormPartial.vue";

const router = useRouter();
const { form, errors, isLoading, submit, isDirty } = useLeaderFormAPI(null);
</script>

<template>
<CRUDCard
title="Create New Leader"
description="Fill in the details to add a new leader to the team."
>
<form @submit.prevent="submit" class="space-y-6" id="leaderForm">
<LeaderFormPartial
:form="form"
:errors="errors"
:is-edit="false"
/>
<div class="flex justify-end items-center gap-4">
<SaveButton form="leaderForm" :is-loading="isLoading" :isDirty="isDirty">
{{ isLoading ? "Creating..." : "Create Leader" }}
</SaveButton>
<CancelButton @click="router.push({ name: 'dashboard.leaders.index' })">
Cancel
</CancelButton>
</div>
</form>
</CRUDCard>
</template>