<script setup lang="ts">
    import { usePermissionFormAPI } from '@/composables/access-control/usePermissionFormAPI';
    import { useRouter } from 'vue-router';
    import ExpandableCard from '@/components/card/ExpandableCard.vue';
    import { SaveButton, CancelButton } from '@/components/button';
    import CRUDCard from '@/components/card/CRUDCard.vue';
    import TextInput from '@/components/form/TextInput.vue';
    import TextareaInput from '@/components/form/TextareaInput.vue';
    import LoadingState from '@/components/card/LoadingState.vue';

    const router = useRouter();
    const {
        permissionData,
        form,
        errors,
        isLoading,
        isDirty,
        dirtyFields,
        submit,
    } = usePermissionFormAPI();
</script>

<template>
    <LoadingState v-if="isLoading && !permissionData" />
    <CRUDCard v-else-if="permissionData"
        :title="`Edit Permission: ${permissionData.name}`"
        :description="`Key: ${permissionData.key}`"
    >
        <p v-if="permissionData.is_system_permission" class="mb-4 text-sm text-yellow-600 dark:text-yellow-400 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700">
            This is a system permission. Its group, module, and description cannot be modified.
        </p>

        <form @submit.prevent="submit" id="permission-form" class="space-y-6">
            <ExpandableCard :expanded="true">
                <template #header>Permission Details</template>
                <div class="space-y-6">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                            label="Permission Group"
                            id="group"
                            v-model="form.group"
                            :error="errors.group?.[0]"
                            placeholder="e.g., User Management, Content"
                            :disabled="permissionData.is_system_permission"
                            autofocus
                            :is-dirty="dirtyFields.group"
                        />
                        <TextInput
                            label="Permission Module"
                            id="module"
                            v-model="form.module"
                            :error="errors.module?.[0]"
                            placeholder="e.g., Users, Posts, Comments"
                            :disabled="permissionData.is_system_permission"
                            :is-dirty="dirtyFields.module"
                        />
                    </div>
                    <TextareaInput
                        label="Description"
                        id="description"
                        v-model="form.description"
                        :error="errors.description?.[0]"
                        :rows="3"
                        placeholder="A clear description of what this permission allows."
                        :disabled="permissionData.is_system_permission"
                        :is-dirty="dirtyFields.description"
                    />
                </div>
            </ExpandableCard>

            <div class="flex justify-end items-center gap-4">
                <CancelButton @click="router.push({ name: 'access-control.permissions.index' })">Cancel</CancelButton>
                <SaveButton form="permission-form" :is-loading="isLoading" :isDirty="isDirty" :disabled="permissionData.is_system_permission">
                    {{ isLoading ? "Saving..." : "Update Permission" }}
                </SaveButton>
            </div>
        </form>
    </CRUDCard>
</template>