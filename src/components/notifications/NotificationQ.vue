<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { useNotifyQStore, type NotifyQ } from '@/stores/notify.q.store';
    import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-vue-next';

    const props = defineProps<{
        notifyQ: NotifyQ;
    }>();

    const store = useNotifyQStore();
    // const emit = defineEmits(['close']);

    const typeDetails = computed(() => {
        switch (props.notifyQ.type) {
            case 'success':
                return { icon: CheckCircle2, class: 'rounded-lg shadow-lg shadow-black/40 border bg-white text-green-800 border-green-200 bg-gradient-to-br from-green-50 to-green-100' };
            case 'warning':
                return { icon: AlertTriangle, class: 'rounded-lg shadow-lg shadow-black/40 border bg-white text-amber-800 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100' };
            case 'error':
                return { icon: XCircle, class: 'rounded-lg shadow-lg shadow-black/40 border bg-white text-red-800 border-red-200 bg-gradient-to-br from-red-50 to-red-100' };
            default: // 'info'
                return { icon: Info, class: 'rounded-lg shadow-lg shadow-black/40 border bg-white text-blue-800 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100' };
        }
    });

    // --- Timer and Progress Bar Logic ---
    const duration = props.notifyQ.duration ?? 5000;
    const progress = ref(100);
    let startTime: number;
    let animationFrameId: number;
    let remainingTime = duration;

    const startTimer = () => {
        startTime = performance.now();
        
        const animate = (timestamp: number) => {
            const elapsedTime = timestamp - startTime;
            const newProgress = (remainingTime - elapsedTime) / duration * 100;
            
            if (newProgress <= 0) {
                progress.value = 0;
                store.removeNotification(props.notifyQ.id);
            } else {
                progress.value = newProgress;
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        animationFrameId = requestAnimationFrame(animate);
    };

    const pauseTimer = () => {
        cancelAnimationFrame(animationFrameId);
        const elapsedTime = performance.now() - startTime;
        remainingTime -= elapsedTime;
    };

    const resumeTimer = () => {
        startTimer();
    };

    onMounted(() => {
        startTimer();
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationFrameId);
    });
</script>

<template>
    <div
        class="relative w-full max-w-sm rounded-lg shadow-lg shadow-black/40 border text-white overflow-hidden"
        :class="typeDetails.class"
        role="alert"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
    >
        <div class="flex">
            <div class="flex-shrink-0 p-4 rounded-l-lg max-w-min">
                <component :is="typeDetails.icon" class="w-6 h-6" />
            </div>

            <div class="flex-1 p-4 pr-10">
                <p v-if="notifyQ.title" class="text-sm font-semibold">{{ notifyQ.title }}</p>
                <p class="text-sm" :class="{ 'mt-1': notifyQ.title }">
                    {{ notifyQ.message }}
                </p>
            </div>
        </div>

        <button
            @click="store.removeNotification(notifyQ.id)"
            class="absolute top-2 right-2 cursor-pointer text-current opacity-70 hover:opacity-100 transition-opacity z-10 p-1 -m-1"
            aria-label="Close"
        >
            <X class="size-6" />
        </button>
        
        <div class="absolute bottom-0 left-0 h-1 bg-white/50" :style="{ width: `${progress}%` }"></div>
    </div>
</template>