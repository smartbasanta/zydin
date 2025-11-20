<script setup lang="ts">
    import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
    import { ChevronDownIcon } from "lucide-vue-next";

    const props = defineProps<{
        expanded?: boolean;
        canExpand?: boolean;
    }>();

    const emit = defineEmits<{
        toggle: [expanded: boolean];
    }>();

    const isExpanded = ref(props.expanded ?? false);
    const contentRef = ref<HTMLElement>();
    const isTransitioning = ref(false);

    // Throttle utility
    const throttle = (func: Function, limit: number) => {
        let inThrottle: boolean;
        return function (this: any, ...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    watch(
        () => props.expanded,
        (newValue) => {
            if (newValue !== undefined) {
                isExpanded.value = newValue;
            }
        }
    );

    watch(isExpanded, (newValue) => {
        emit('toggle', newValue);
    });

    const updateHeight = async () => {
        if (!contentRef.value || !isExpanded.value) return;

        await nextTick();
        const element = contentRef.value;
        element.style.height = 'auto';
        const scrollHeight = element.scrollHeight;
        element.style.height = `${scrollHeight}px`;
    };

    const toggleExpansion = () => {
        if (props.canExpand !== false) {
            isExpanded.value = !isExpanded.value;
        }
    };

    const handleResize = throttle(() => {
        if (isExpanded.value && !isTransitioning.value) {
            updateHeight();
        }
    }, 100);

    const onEnter = (el: Element) => {
        const element = el as HTMLElement;
        isTransitioning.value = true;
        element.style.height = '0';
        element.style.opacity = '0';
        element.offsetHeight;
        requestAnimationFrame(() => {
            element.style.height = element.scrollHeight + 'px';
            element.style.opacity = '1';
        });
    };

    const onAfterEnter = (el: Element) => {
        isTransitioning.value = false;
        updateHeight();
    };

    const onLeave = (el: Element) => {
        const element = el as HTMLElement;
        isTransitioning.value = true;
        element.style.height = element.scrollHeight + 'px';
        element.style.opacity = '1';
        element.offsetHeight;
        requestAnimationFrame(() => {
            element.style.height = '0';
            element.style.opacity = '0';
        });
    };

    const onAfterLeave = (el: Element) => {
        const element = el as HTMLElement;
        isTransitioning.value = false;
        element.style.height = '';
        element.style.opacity = '';
    };

    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        window.addEventListener('resize', handleResize);

        if (contentRef.value && 'ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                if (isExpanded.value && !isTransitioning.value) {
                    updateHeight();
                }
            });
            resizeObserver.observe(contentRef.value);
            const contentElement = contentRef.value.querySelector('.expandable-content');
            if (contentElement) {
                resizeObserver.observe(contentElement);
            }
        }

        setTimeout(() => {
            if (isExpanded.value) {
                updateHeight();
            }
        }, 0);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });
</script>

<template>
    <div
        class="group border border-white/20 dark:border-white/10 rounded-2xl bg-white/60 dark:bg-white/5 shadow-lg dark:shadow-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/60"
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between p-4 transition-all duration-200"
            :class="[
                canExpand !== false ? 'cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 active:bg-white/60 dark:active:bg-white/10' : '',
                isExpanded ? 'border-b border-white/20 dark:border-white/10' : ''
            ]"
            @click="toggleExpansion"
            :aria-expanded="isExpanded"
            :aria-controls="canExpand !== false ? 'expandable-content' : undefined"
            :role="canExpand !== false ? 'button' : undefined"
            :tabindex="canExpand !== false ? '0' : undefined"
            @keydown.enter="toggleExpansion"
            @keydown.space.prevent="toggleExpansion"
        >
            <div class="font-semibold text-gray-900 dark:text-white flex-1 transition-colors duration-200">
                <slot name="header"></slot>
            </div>
            
            <button
                v-if="canExpand !== false"
                type="button"
                class="btn btn-icon !size-8 ml-2 hover:bg-white/30 dark:hover:bg-white/10 active:scale-95 transition-all duration-200 ease-out"
                :class="{ 'bg-white/20 dark:bg-white/5': isExpanded }"
                :aria-label="isExpanded ? 'Collapse' : 'Expand'"
            >
                <ChevronDownIcon
                    :class="{ 'rotate-180': isExpanded }"
                    class="size-5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                />
            </button>
        </div>

        <!-- Expandable Content -->
        <transition
            name="expand"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
        >
            <div
                v-show="isExpanded"
                ref="contentRef"
                class="overflow-hidden"
                id="expandable-content"
            >
                <div class="expandable-content p-4">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
    .expand-enter-active,
    .expand-leave-active {
        transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }

    .expand-enter-from,
    .expand-leave-to {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }

    /* Enhanced hover and focus effects */
    .group:hover {
        transform: translateY(-1px);
    }

    .group:hover .btn-icon {
        transform: scale(1.1);
    }

    .group div[role="button"]:focus {
        outline: 2px solid rgb(259 130 46 / 0.7);
        outline-offset: -2px;
        border-radius: inherit;
    }

    /* Smooth content fade */
    .expandable-content {
        animation: fadeInContent 0.4s ease-out;
        overflow: visible;
    }

    @keyframes fadeInContent {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Disable animation on reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
        .expand-enter-active,
        .expand-leave-active {
            transition-duration: 0.1s;
        }
        
        .expandable-content {
            animation: none;
        }
        
        .group:hover {
            transform: none;
        }
    }
</style>