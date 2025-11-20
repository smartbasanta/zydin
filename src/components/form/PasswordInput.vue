<script setup lang="ts">
    import { ref, onMounted, computed, useAttrs } from 'vue';
    import InputError from '@/components/form/InputError.vue';
    import { Eye, EyeClosed } from 'lucide-vue-next';

    const props = defineProps<{
        label?: string;
        hint?: string;
        error?: string | string[] | null;
        maxLength?: number;
        containerClass?: string;
        required?: boolean;
    }>();

    const model = defineModel<string>();

    const open = ref(false);

    const inputRef = ref<HTMLInputElement | null>(null);

    onMounted(() => {
        if (inputRef.value?.hasAttribute('autofocus')) {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    inputRef.value?.focus();
                }
            }, 100);
        }
    });

    defineExpose({
        focus: () => {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    inputRef.value?.focus();
                }
            }, 100);
        }
    });

    const attrs = useAttrs();

    const capitalize = (str: string): string =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    const computedLabel = computed(() => {
        if (props.label) return props.label;
        const nameAttr = attrs['name'] as string | undefined;
        return nameAttr ? capitalize(nameAttr.replace('_', ' ')) : '';
    });

    const maxLengthError = computed(() => {
        if (props.maxLength && String(model.value).length > props.maxLength) {
            return `Max length of ${props.maxLength} characters exceeded.`;
        }
        return '';
    });

    const typedCharCount = computed(() => String(model.value).length);

    const inputId = computed(() => (attrs.id as string) ?? 'input-' + Math.random().toString(36).substr(2, 9));

    defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <div class="flex gap-2 items-start">
            <slot name="before-label" />
            <label v-if="computedLabel" :for="inputId" class="label">
                {{ computedLabel }}
                <span v-if="props.required" class="text-red-500 dark:text-red-400 ml-0.5">*</span>
            </label>
            <slot name="after-label" />
        </div>

        <div class="relative">
            <div class="flex relative">
                <input
                    :type="open ? 'text' : 'password'"
                    class="input"
                    :class="{ 'invalid-input': error || maxLengthError }"
                    v-bind="$attrs"
                    v-model="model"
                    ref="inputRef"
                    :maxlength="props.maxLength"
                />
                <button
                    type="button"
                    class="absolute right-0 top-0 h-full px-2 outline-none rounded-r-md transition duration-200 link cursor-pointer focus-visible:ring-2 dark:focus-visible:ring-gray-700"
                    @click="open = !open"
                >
                    <Eye v-show="open" />
                    <EyeClosed v-show="!open" />
                </button>
            </div>

            <div v-if="props.maxLength" class="absolute -bottom-[19px] right-0 text-xs font-medium text-gray-500">
                {{ typedCharCount }}/{{ props.maxLength }}
            </div>
        </div>

        <slot />
        <p v-if="hint" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" />
        <InputError v-if="maxLengthError" :error="maxLengthError" />
    </div>
</template>
