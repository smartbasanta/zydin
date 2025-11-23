<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types';
import { ArrowUpRightIcon, BeakerIcon, DropletsIcon, DnaIcon, FlaskConicalIcon, MicroscopeIcon, PillIcon, RulerIcon, WeightIcon } from 'lucide-vue-next';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProductAPIImage, defaultProductFFImage } = useDefaultImages();
const props = defineProps<{
    product: Product;
    type?: 'mini' |'expanded'
}>();

const isFinishedFormulation = computed(() => props.product.type === 'ff');

const mediaImage = computed(() =>
    props.product.image_url ??
    (isFinishedFormulation.value ? defaultProductFFImage : defaultProductAPIImage)
);

const productTitle = computed(() =>
    isFinishedFormulation.value
        ? props.product.brand?.name ?? props.product.name
        : props.product.name
);

const subtitleText = computed(() => {
    if (isFinishedFormulation.value) {
        return props.product.generic_name ?? 'Specialty formulation';
    }
    if (props.product.cas_number) {
        return `CAS · ${props.product.cas_number}`;
    }
    return props.product.category ?? 'Advanced ingredient';
});

const badgeLabel = computed(
    () =>
        (isFinishedFormulation.value ? props.product.therapeutic_area : props.product.category) ??
        'Biotech'
);

const secondaryMeta = computed(() => {
    if (isFinishedFormulation.value) {
        return props.product.dosage_form ? `Dosage · ${props.product.dosage_form}` : null;
    }
    if (props.product.molecular_formula) {
        return `Formula · ${props.product.molecular_formula}`;
    }
    if (props.product.molecular_weight) {
        return `Weight · ${props.product.molecular_weight}`;
    }
    return null;
});

const typeMeta = computed(() =>
    isFinishedFormulation.value
        ? { label: 'Finished Formulation', icon: FlaskConicalIcon }
        : { label: 'Active Ingredient', icon: BeakerIcon }
);

type FeatureItem = {
    label: string;
    value: string;
    icon: typeof BeakerIcon;
};

const featureItems = computed<FeatureItem[]>(() => {
    if (isFinishedFormulation.value) {
        return [
            props.product.generic_name && {
                label: 'Generic Name',
                value: props.product.generic_name,
                icon: PillIcon
            },
            props.product.dosage_form && {
                label: 'Dosage Form',
                value: props.product.dosage_form,
                icon: DropletsIcon
            },
            props.product.strength && {
                label: 'Strength',
                value: props.product.strength,
                icon: RulerIcon
            }
        ].filter(Boolean) as FeatureItem[];
    }

    return [
        props.product.cas_number && {
            label: 'CAS Number',
            value: props.product.cas_number,
            icon: MicroscopeIcon
        },
        props.product.molecular_formula && {
            label: 'Molecular Formula',
            value: props.product.molecular_formula,
            icon: DnaIcon
        },
        props.product.molecular_weight && {
            label: 'Molecular Weight',
            value: props.product.molecular_weight,
            icon: WeightIcon
        }
    ].filter(Boolean) as FeatureItem[];
});

const conciseFeatures = computed(() => featureItems.value.slice(0, 2));
</script>

<template>
    <RouterLink :to="`/products/${product.slug}`" class="product-card group">
        <div class="product-card__media">
            <img
                :src="mediaImage"
                :alt="productTitle"
                class="product-card__image"
                loading="lazy"
            />
            <span class="product-card__chip">
                <component :is="typeMeta.icon" class="w-4 h-4" />
                <span>{{ typeMeta.label }}</span>
            </span>
        </div>

        <div class="product-card__content">
            <div class="product-card__header">
                <span class="product-card__badge">{{ badgeLabel }}</span>
                <p class="product-card__eyebrow">{{ subtitleText }}</p>
                <h3 class="product-card__title">{{ productTitle }}</h3>
                <p v-if="secondaryMeta" class="product-card__meta">{{ secondaryMeta }}</p>
            </div>

            <div v-if="conciseFeatures.length && (type === 'expanded')" class="product-card__stats">
                <div v-for="feature in conciseFeatures" :key="feature.label" class="product-card__stat">
                    <component :is="feature.icon" class="w-4 h-4" />
                    <div>
                        <p class="product-card__stat-label">{{ feature.label }}</p>
                        <p class="product-card__stat-value">{{ feature.value }}</p>
                    </div>
                </div>
            </div>

            <span class="product-card__cta">
                View details
                <ArrowUpRightIcon class="w-4 h-4" />
            </span>
        </div>
    </RouterLink>
</template>