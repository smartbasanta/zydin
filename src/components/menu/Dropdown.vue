<script setup lang="ts">
    import { useDropdown, type UseDropdown } from '@/composables/useDropdown';
    const {
        isOpen,
        toggle,
        close,
        dropdownRef,
        triggerRef,
        onKeyDown,
    } = useDropdown();

    defineExpose({ isOpen, toggle, close }); 

    defineProps<{
        
    }>()

    defineSlots<{
        trigger: (props: { toggle: UseDropdown['toggle'], isOpen: UseDropdown['isOpen']['value'] }) => any;
        menu: (props: { close: UseDropdown['close'], isOpen: UseDropdown['isOpen']['value'] }) => any;
    }>();
</script>

<template>
    <div class="relative" @keydown="onKeyDown">
        <div ref="triggerRef">
            <slot name="trigger" :toggle="toggle" :isOpen="isOpen"></slot>
        </div>
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
                class="absolute z-10 mt-1 origin-top-right right-0 "
                role="menu"
                tabindex="-1"
            >
                <div class="menu-dropdown-panel">
                    <slot name="menu" :close="close" :isOpen="isOpen"></slot>
                </div>
            </div>
        </Transition>
    </div>
</template>