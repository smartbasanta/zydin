<script setup lang="ts">
    import { computed } from 'vue';
    import { useNotifyQStore } from '@/stores/notify.q.store';
    import NotificationQ from './NotificationQ.vue';

    const store = useNotifyQStore();

    const positionClasses = computed(() => {
        switch (store.position) {
            case 'top-left':
                return 'items-start justify-start';
            case 'top-center':
                return 'items-center justify-start';
            case 'top-right':
                return 'items-end justify-start';
            case 'bottom-left':
                return 'items-start justify-end';
            case 'bottom-center':
                return 'items-center justify-end';
            case 'bottom-right':
            default:
                return 'items-end justify-end';
        }
    });
</script>

<template>
    <div
        aria-live="assertive"
        class="pointer-events-none fixed inset-0 flex flex-col p-4 space-y-4 z-[100]"
        :class="positionClasses"
    >
        <TransitionGroup
            name="notifyQ"
            tag="div"
            class="w-full max-w-sm space-y-4"
        >
            <NotificationQ
                v-for="notifyQ in store.notifyQ"
                :key="notifyQ.id"
                :notifyQ="notifyQ"
                class="pointer-events-auto"
            />
        </TransitionGroup>
    </div>
</template>

<style scoped>
    .notifyQ-enter-active,
    .notifyQ-leave-active {
        transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
    }
    .notifyQ-enter-from,
    .notifyQ-leave-to {
        opacity: 0;
        transform: translateY(100px) scale(0.8);
    }
    .notifyQ-move {
        transition: transform 0.3s ease;
    }

    .justify-start .notifyQ-enter-from,
    .justify-start .notifyQ-leave-to {
        /* Start from above for top positions */
        transform: translateY(-100px) scale(0.8);
    }
</style>