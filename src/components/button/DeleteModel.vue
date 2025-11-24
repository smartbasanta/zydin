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
    confirmMessage?: string;
    // New props for visual control
    iconOnly?: boolean;
    label?: string;
}>();

const emit = defineEmits(["deleted"]);
const { notify, error: notifyError } = useNotifier();

// --- Internal State ---
const showConfirm = ref(false);
const isLoading = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const popoverTop = ref(0);
const popoverRight = ref(0);

// --- Computed ---
const computedLabel = computed(() => props.label || "Delete");

const computedConfirmMessage = computed(() => {
    if (props.confirmMessage) return props.confirmMessage;
    if (props.itemName) return `Are you sure you want to delete "${props.itemName}"?`;
    return "Are you sure you want to delete this item?";
});

// --- Logic ---
async function openConfirm() {
    if (isLoading.value || props.disabled) return;
    showConfirm.value = true;
    
    await nextTick();
    if (buttonRef.value && popoverRef.value) {
        const buttonRect = buttonRef.value.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Calculate position (bottom-end alignment)
        popoverTop.value = buttonRect.bottom + scrollY + 8;
        popoverRight.value = document.documentElement.clientWidth - buttonRect.right;
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
        
        const response: ApiResponse = await apiService.delete(finalUrl);
        notify(response);
        emit("deleted", props.itemId);
    } catch (err) {
        notifyError(err as any, 'Failed to delete item');
    } finally {
        isLoading.value = false;
    }
}

function handleClickOutside(event: MouseEvent) {
    if (
        showConfirm.value &&
        buttonRef.value && !buttonRef.value.contains(event.target as Node) &&
        popoverRef.value && !popoverRef.value.contains(event.target as Node)
    ) {
        cancelDelete();
    }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", handleClickOutside));
</script>

<template>
    <div class="relative inline-block">
        <!-- Redesigned Delete Button -->
        <button
            ref="buttonRef"
            @click="openConfirm"
            :disabled="isLoading || disabled"
            type="button"
            class="group relative inline-flex items-center justify-center rounded-2xl bg-white/60 dark:bg-white/5 border border-red-200/60 dark:border-red-900/60 backdrop-blur-md shadow-lg hover:shadow-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm font-poppins transition-all duration-300 hover:scale-[1.03]"
            :class="[ 
                iconOnly ? 'p-3' : 'px-5 py-3 gap-2' 
            ]"
            :title="computedLabel"
        >
            <!-- Hover Gradient Effect -->
            <span class="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-red-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm z-0"></span>
            
            <!-- Loading or Trash Icon -->
            <component
                :is="isLoading ? Loader2Icon : Trash2Icon"
                class="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:rotate-[10deg] group-hover:scale-110"
                :class="{ 'animate-spin': isLoading }"
            />
            
            <!-- Text Label -->
            <span v-if="!iconOnly" class="relative z-20">{{ isLoading ? 'Deleting...' : computedLabel }}</span>
        </button>

        <!-- Teleported Confirmation Popover -->
        <teleport to="body">
            <transition name="popover-fade">
                <div
                    v-if="showConfirm"
                    ref="popoverRef"
                    class="absolute z-[9999] w-72"
                    :style="{ top: `${popoverTop}px`, right: `${popoverRight}px` }"
                >
                    <div class="relative space-y-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 text-center ring-1 ring-black/5">
                        <!-- Warning Icon -->
                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <Trash2Icon class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                        </div>
                        
                        <div class="space-y-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete Item</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ computedConfirmMessage }}
                            </p>
                        </div>

                        <div class="flex justify-center gap-3 mt-4">
                            <button 
                                @click="cancelDelete" 
                                class="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                @click="confirmDelete" 
                                class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<style scoped>
    .popover-fade-enter-active,
    .popover-fade-leave-active {
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        transform-origin: top right;
    }
    .popover-fade-enter-from,
    .popover-fade-leave-to {
        opacity: 0;
        transform: scale(0.95) translateY(-5px);
    }
</style>