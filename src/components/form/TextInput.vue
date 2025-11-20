<script setup lang="ts">
    import { ref, onMounted, computed, useAttrs } from 'vue';
    import InputError from '@/components/form/InputError.vue';

    const props = defineProps<{
        // label?: string;
        type?: string;
        error?: string | string[] | null;
        hint?: string;
        showError?: boolean;
        maxLength?: string;
        min?: string;
        max?: string;
        step?: string;
        containerClass?: string | Record<string, boolean>;
        isDirty?: boolean;
        required?: boolean;
    }>();

    const model = defineModel<string | number | null>();

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
        },
    });

    const attrs = useAttrs();

    const capitalize = (str: string): string =>
        str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    const computedLabel = computed(() => {
        const lbl = attrs['label'] as string | undefined;
        if(lbl !== undefined) return lbl
        const nameAttr = attrs['name'] as string | undefined;
        return nameAttr ? capitalize(nameAttr) : '';
    });

    // const computedLabel = computed(() => {
    //     if (props.label) return props.label;
    //     const nameAttr = attrs['name'] as string | undefined;
    //     return nameAttr ? capitalize(nameAttr) : '';
    // });

    const maxLengthError = computed(() => {
        if(props.type === 'number') {
            const value = model.value?.toString() ?? '';
            if(props.min !== undefined && parseInt(value) < parseInt(props.min)){
                return `Minimum value is ${props.min}.`;
            }
            if((props.maxLength && (parseInt(value) > parseInt(props.maxLength))) || (props.max && (parseInt(value) > parseInt(props.max))) ) {
                return `Max allowed number is ${props.maxLength}.`;
            }
            return '';

        }else{
            const value = model.value ?? '';
            if (props.maxLength && String(value).length > parseInt(props.maxLength)) {
                return `Max length of ${props.maxLength} characters exceeded.`;
            }
            return '';
        }
    });

    const typedCharCount = computed(() => String(model.value ?? '').length);

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
            <input
            v-if="type !== 'number'"
                :id="inputId"
                :type="type ?? 'text'"
                class="input"
                :aria-invalid="!!(error || maxLengthError)"
                :class="{
                    'invalid-input': error || maxLengthError,
                    'dirty-input': isDirty
                }"
                v-bind="$attrs"
                v-model="model"
                ref="inputRef"
                :maxlength="props.maxLength"
            />
            <input v-else type="number"
                :id="inputId"
                class="input"
                :aria-invalid="!!(error || maxLengthError)"
                :class="{
                    'invalid-input': error || maxLengthError,
                    'dirty-input': isDirty
                }"
                v-bind="$attrs"
                v-model="model"
                ref="inputRef"
                :max="props.maxLength"
                :min="props.min">

            <div
                v-if="props.maxLength"
                class="absolute -bottom-[19px] right-0 text-xs font-medium text-gray-500"
            >
                {{ typedCharCount }}/{{ props.maxLength }}
            </div>
        </div>

        <slot />
        <p v-if="hint" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" />
        <InputError v-if="maxLengthError" :error="maxLengthError" />
    </div>
</template>
