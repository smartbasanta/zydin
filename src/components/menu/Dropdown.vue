<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue';

type Placement = 'bottom-start' | 'bottom-end' | 'bottom-center' | 'top-start' | 'top-end' | 'top-center';

const props = withDefaults(defineProps<{
    placement?: Placement;
    menuClass?: string;
    gap?: number;
}>(), {
    placement: 'bottom-start',
    menuClass: '',
    gap: 6
});

defineSlots<{
    trigger: (props: { toggle: () => void; isOpen: boolean }) => any;
    menu: (props: { close: (focus?: boolean) => void; isOpen: boolean }) => any;
}>();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const menuStyle = ref<Record<string, string>>({
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    opacity: '0',
    zIndex: '9999',
});

// Helper to find all scrollable parents
const getScrollParents = (node: HTMLElement): HTMLElement[] => {
    const scrollParents: HTMLElement[] = [];
    let parent = node.parentElement;
    while (parent) {
        const style = window.getComputedStyle(parent);
        if (/(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)) {
            scrollParents.push(parent);
        }
        parent = parent.parentElement;
    }
    return scrollParents;
};

const calculatePosition = async () => {
    await nextTick(); await nextTick(); // Double tick for safety
    if (!triggerRef.value || !dropdownRef.value) return;

    const trigger = triggerRef.value.getBoundingClientRect();
    const menu = dropdownRef.value.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    // Vertical
    if (props.placement.startsWith('top')) {
        top = trigger.top + scrollY - menu.height - props.gap;
    } else {
        top = trigger.bottom + scrollY + props.gap;
    }

    // Horizontal
    if (props.placement.includes('start')) {
        left = trigger.left + scrollX;
    } else if (props.placement.includes('end')) {
        left = (trigger.right + scrollX) - menu.width;
    } else { 
        // Center
        const triggerCenter = trigger.left + (trigger.width / 2);
        left = (triggerCenter + scrollX) - (menu.width / 2);
    }

    // Edge Detection
    const padding = 10;
    const docWidth = document.documentElement.clientWidth;

    if (left + menu.width > docWidth + scrollX) {
        left = (trigger.right + scrollX) - menu.width; // Flip to end
        if (left + menu.width > docWidth + scrollX) { // Still too big?
             left = (docWidth + scrollX) - menu.width - padding;
        }
    }
    if (left < padding + scrollX) {
        left = padding + scrollX;
    }

    menuStyle.value = {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        right: 'auto',
        bottom: 'auto',
        zIndex: '9999',
        opacity: '1',
        minWidth: 'max-content',
    };
};

const toggle = () => { isOpen.value = !isOpen.value; };

const close = (focusTrigger = false) => {
    isOpen.value = false;
    menuStyle.value = { ...menuStyle.value, opacity: '0', top: '-9999px' };
    if (focusTrigger && triggerRef.value) triggerRef.value.focus();
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const isClickOnTrigger = triggerRef.value?.contains(target);
    const isClickOnDropdown = dropdownRef.value?.contains(target);
    if (!isClickOnTrigger && !isClickOnDropdown) close();
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close(true);
};

// Re-calculate on scroll or resize
const handleUpdate = () => {
    if (isOpen.value) calculatePosition();
};

let scrollParents: HTMLElement[] = [];

watch(isOpen, (val) => {
    if (val) {
        calculatePosition();
        // Add listeners to window
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleKeydown);
            window.addEventListener('resize', handleUpdate);
            window.addEventListener('scroll', handleUpdate, true); // Capture global scroll
            
            // Add listeners to specific scrollable parents (like the table container)
            if (triggerRef.value) {
                scrollParents = getScrollParents(triggerRef.value);
                scrollParents.forEach(p => p.addEventListener('scroll', handleUpdate));
            }
        }, 0);
    } else {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
        // Remove parent scroll listeners
        scrollParents.forEach(p => p.removeEventListener('scroll', handleUpdate));
        scrollParents = [];
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', handleUpdate);
    window.removeEventListener('scroll', handleUpdate, true);
    scrollParents.forEach(p => p.removeEventListener('scroll', handleUpdate));
});

defineExpose({ isOpen, toggle, close });
</script>

<template>
    <div class="relative inline-block" ref="triggerRef">
        <slot name="trigger" :toggle="toggle" :isOpen="isOpen"></slot>

        <Teleport to="body">
            <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div
                    v-if="isOpen"
                    ref="dropdownRef"
                    :style="menuStyle"
                    class="outline-none"
                    role="menu"
                    tabindex="-1"
                >
                    <div :class="menuClass">
                        <slot name="menu" :close="close" :isOpen="isOpen"></slot>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>