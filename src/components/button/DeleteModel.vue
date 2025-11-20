<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { Trash2Icon, Loader2Icon } from "lucide-vue-next";
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiResponse } from "@/types/api";

const props = defineProps<{
    itemId: number | string;
    itemName?: string;
    deleteUrl: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    confirmMessage?: string;
}>();

const emit = defineEmits(["deleted"]);

const { notify, error: notifyError } = useNotifier();

// --- Internal State ---
const showConfirm = ref(false);
const isLoading = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

// NEW: Refs to store the calculated position for the teleported popover
const popoverTop = ref(0);
const popoverRight = ref(0);

// --- Computed Properties ---
const computedConfirmMessage = computed(() => {
    if (props.confirmMessage) return props.confirmMessage;
    if (props.itemName) return `Are you sure you want to delete "${props.itemName}"?`;
    return "Are you sure you want to delete this item?";
});

const sizeClasses = {
    sm: 'p-2',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-sm',
};

const iconSizeClasses = {
    sm: 'size-4',
    md: 'size-4',
    lg: 'size-5',
};

// --- Logic ---
async function openConfirm() {
    if (isLoading.value || props.disabled) return;
    showConfirm.value = true;
    
    // NEW: Calculate position after the popover is about to be rendered
    await nextTick(); // Wait for the DOM to update
    if (buttonRef.value && popoverRef.value) {
        const buttonRect = buttonRef.value.getBoundingClientRect();
        popoverTop.value = buttonRect.bottom + 8; // Position 8px below the button
        popoverRight.value = window.innerWidth - buttonRect.right;
    }
}

function cancelDelete() {
    showConfirm.value = false;
}

async function confirmDelete() {
    showConfirm.value = false;
    isLoading.value = true;
    try {
        const finalUrl = props.deleteUrl.endsWith('/') 
            ? `${props.deleteUrl}${props.itemId}`
            : `${props.deleteUrl}/${props.itemId}`;
            console.log(finalUrl)
        const response: ApiResponse = await apiService.delete(finalUrl);
        notify(response);
        emit("deleted", props.itemId);
    } catch (err) {
        notifyError(err as any, 'Failed to delete item');
    } finally {
        isLoading.value = false;
    }
}

// --- Click Outside Handler ---
function handleClickOutside(event: MouseEvent) {
    if (
        showConfirm.value &&
        buttonRef.value && !buttonRef.value.contains(event.target as Node) &&
        popoverRef.value && !popoverRef.value.contains(event.target as Node)
    ) {
        cancelDelete();
    }
}

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
    <div class="relative inline-block">
        <!-- The Main Delete Button -->
        <button
            ref="buttonRef"
            @click="openConfirm"
            :disabled="isLoading || disabled"
            type="button"
            :class="['btn btn-danger', size ? sizeClasses[size] : sizeClasses.lg]"
            title="Delete"
        >
            <component
                :is="isLoading ? Loader2Icon : Trash2Icon"
                :class="[iconSizeClasses[size || 'lg'], { 'animate-spin': isLoading }]"
            />
            <span v-if="size !== 'sm'">
                {{ isLoading ? "Deleting..." : "Delete" }}
            </span>
        </button>

        <!-- NEW: Popover is now teleported to the body to escape parent containers -->
        <teleport to="body">
            <transition name="popover-fade">
                <div
                    v-if="showConfirm"
                    ref="popoverRef"
                    class="fixed z-[100] w-64"
                    :style="{ top: `${popoverTop}px`, right: `${popoverRight}px` }"
                >
                    <div class="relative space-y-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-4 text-center">
                        <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {{ computedConfirmMessage }}
                        </p>
                        <div class="flex justify-center gap-3">
                            <button @click="confirmDelete" class="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition">
                                Yes, Delete
                            </button>
                            <button @click="cancelDelete" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-xs font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<style scoped>
    /* NEW: Enhanced transition with scale for a "pop" effect */
    .popover-fade-enter-active,
    .popover-fade-leave-active {
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform-origin: top right;
    }
    .popover-fade-enter-from,
    .popover-fade-leave-to {
        opacity: 0;
        transform: scale(0.95);
    }
</style>