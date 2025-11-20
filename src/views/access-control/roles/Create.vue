<script setup lang="ts">
    import RoleFormPartial from "./FormPartial.vue";
    import { useRoleFormAPI } from "@/composables/access-control/useRoleFormAPI";
    import { useRouter } from "vue-router";
    import ExpandableCard from "@/components/card/ExpandableCard.vue"; 
    
    import { onMounted, ref } from "vue";
    import { SaveButton, CancelButton } from "@/components/button";
    import CRUDCard from "@/components/card/CRUDCard.vue";

    const router = useRouter();
    const { form, errors, isLoading, submit, generateKey, isDirty, dirtyFields } = useRoleFormAPI(null);

    const handleKeyInput = () => {
        if (!form.key) {
            generateKey();
        }
    };

    const canTeleport = ref(false);

    onMounted(() => {
        canTeleport.value = !!document.querySelector('[data-slot=actions]');
    });
</script>

<template>
    <CRUDCard 
        title="Create New Role" 
        description="Fill in the details to create a new user role."
    >
        <form @submit.prevent="submit" class="space-y-6" id="roleForm">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <ExpandableCard :expanded="true" :can-expand="true">
                        <template #header>Core Information</template>
                        <RoleFormPartial
                            :form="form"
                            :errors="errors"
                            :is-edit="false"
                            :on-key-input="handleKeyInput"
                            :dirty-fields="dirtyFields"
                            section="core"
                            @update:form="Object.assign(form, $event)"
                        />
                    </ExpandableCard>
                </div>

                <div class="lg:col-span-1">
                    <div class="lg:col-span-2 space-y-6">
                        <ExpandableCard :expanded="true">
                            <template #header>Configuration</template>
                            <RoleFormPartial
                                :form="form"
                                :errors="errors"
                                :is-edit="false"
                                :dirty-fields="dirtyFields"
                                @update:form="Object.assign(form, $event)"
                                section="config"
                            />
                        </ExpandableCard>
                        <ExpandableCard :can-expand="true">
                            <template #header>Display Settings</template>
                            <RoleFormPartial
                                :form="form"
                                :errors="errors"
                                :is-edit="false"
                                :dirty-fields="dirtyFields"
                                @update:form="Object.assign(form, $event)"
                                section="display"
                            />
                        </ExpandableCard>
                    </div>
                </div>
            </div>
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="roleForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Creating..." : "Create Role" }}
                </SaveButton>

                <CancelButton @click="router.push({ name: 'access-control.roles.index' })">
                    Cancel
                </CancelButton>
            </div>
        </form>
        <Teleport v-if="canTeleport" to="[data-slot='actions']">
            <div class="flex justify-end items-center gap-4">
                <SaveButton form="roleForm" :is-loading="isLoading" :isDirty="isDirty">
                    {{ isLoading ? "Creating..." : "Create Role" }}
                </SaveButton>
                <CancelButton @click="router.push({ name: 'access-control.roles.index' })">
                    Cancel
                </CancelButton>
            </div>
        </Teleport>
    </CRUDCard>
</template>
