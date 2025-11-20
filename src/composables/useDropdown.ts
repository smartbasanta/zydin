import { ref, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'

export interface UseDropdown {
    isOpen: Ref<boolean>
    toggle: (viaKeyboard?: boolean) => void 
    close: (forceFocusTrigger?: boolean) => void 
    dropdownRef: Ref<HTMLElement | null>
    triggerRef: Ref<HTMLElement | null>
    focusIndex: Ref<number>
    onKeyDown: (e: KeyboardEvent) => void
}

export function useDropdown(): UseDropdown {
    const isOpen = ref(false)
    const dropdownRef = ref<HTMLElement | null>(null)
    const triggerRef = ref<HTMLElement | null>(null)
    const focusIndex = ref(-1)
    const openedByKeyboard = ref(false)

    const focusTrigger = () => {
        if (!triggerRef.value) return;
        const focusable = triggerRef.value.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
            (focusable as HTMLElement).focus();
        }
    }

    const toggle = async (viaKeyboard = false) => {
        isOpen.value = !isOpen.value;
        openedByKeyboard.value = viaKeyboard;
        
        if (isOpen.value) {
            await nextTick();
            if (viaKeyboard) {
                focusIndex.value = 0;
                focusFirstItem();
            }
        } else {
            focusIndex.value = -1;
        }
    }

    const close = async (forceFocusTrigger = false) => {
        if (!isOpen.value) return;
        
        isOpen.value = false;
        focusIndex.value = -1;
        
        await nextTick();
        
        if (forceFocusTrigger || openedByKeyboard.value) {
            focusTrigger();
        }
    }

    const onClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && 
            !dropdownRef.value.contains(event.target as Node) &&
            !triggerRef.value?.contains(event.target as Node)) {
            close(false);
        }
    }

    const getFocusableItems = (): NodeListOf<HTMLElement> => {
        return dropdownRef.value?.querySelectorAll('[data-dropdown-item]') || 
            (document.createDocumentFragment().querySelectorAll('') as NodeListOf<HTMLElement>);
    }

    const focusFirstItem = () => {
        const items = getFocusableItems();
        if (items.length > 0) {
            focusIndex.value = 0;
            items[0].focus({ preventScroll: true });
        }
    }

    const focusItemAtIndex = (direction: 'next' | 'prev') => {
        const items = getFocusableItems();
        if (items.length === 0) return;
        
        let newIndex = focusIndex.value;
        
        if (direction === 'next') {
            newIndex = (newIndex + 1) % items.length;
        } else {
            newIndex = (newIndex - 1 + items.length) % items.length;
        }
        
        items[newIndex]?.focus({ preventScroll: true });
        focusIndex.value = newIndex;
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (!isOpen.value && 
            (e.key === 'Enter' || e.key === ' ') && 
            e.target === triggerRef.value) {
            e.preventDefault();
            toggle(true);
            return;
        }
        
        if (!isOpen.value) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusItemAtIndex('next');
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusItemAtIndex('prev');
                break;
            case 'Tab':
                e.preventDefault();
                if (e.shiftKey) {
                    focusItemAtIndex('prev');
                } else {
                    focusItemAtIndex('next');
                }
                break;
            case 'Enter':
            case ' ':
                if (focusIndex.value >= 0) {
                    e.preventDefault();
                    const items = getFocusableItems();
                    items[focusIndex.value]?.click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                close(true);
                break;
        }
    }

    onMounted(() => {
        document.addEventListener('click', onClickOutside);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', onClickOutside);
    });

    return {
        isOpen,
        toggle,
        close,
        dropdownRef,
        triggerRef,
        focusIndex,
        onKeyDown,
    }
}