<script setup lang="ts">
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { ChevronRight, ArrowLeftCircle } from "lucide-vue-next";
    import type { RouteLocationNormalizedLoaded } from "vue-router";

    const route = useRoute();

    type Crumb = {
        label: string;
        to?: string;
    };

    // The core logic remains the same as it is solid and follows best practices.
    const breadcrumbs = computed<Crumb[]>(() => {
        const meta = route.meta;
        if (typeof meta.breadcrumb === "function") {
            return meta.breadcrumb(route as RouteLocationNormalizedLoaded);
        }
        return meta.breadcrumb || [];
    });

    const backTarget = computed(() => {
        if (breadcrumbs.value.length < 2) return null;
        return breadcrumbs.value[breadcrumbs.value.length - 2].to || null;
    });
</script>

<template>
	<div class="flex items-center gap-2">
		<!-- Back Button: Now uses a theme-aware ghost button style for subtlety and consistency -->
		<RouterLink
			v-if="backTarget"
			:to="backTarget"
			class="btn btn-ghost"
		>
			<ArrowLeftCircle class="size-4" />
			<span>Back</span>
		</RouterLink>

        <!-- A divider to cleanly separate the back button from the breadcrumbs -->
        <div v-if="backTarget" class="h-4 w-px bg-muted"></div>

		<!-- Breadcrumb Trail: Now wrapped in a styled container for a more intentional look -->
		<nav
			v-if="breadcrumbs.length > 0"
			aria-label="breadcrumb"
			class="breadcrumb-trail"
		>
			<ol class="flex flex-wrap items-center gap-2">
				<template v-for="(item, index) in breadcrumbs" :key="index">
					<li class="inline-flex items-center">
						<!-- Current page -->
						<span
							v-if="index === breadcrumbs.length - 1"
							class="breadcrumb-current"
							aria-current="page"
						>
							{{ item.label }}
						</span>

						<!-- Link items -->
						<RouterLink
							v-else-if="item.to"
							:to="item.to"
							class="breadcrumb-link"
						>
							{{ item.label }}
						</RouterLink>

						<!-- Plain label fallback -->
						<span v-else class="text-muted">{{ item.label }}</span>
					</li>

					<!-- Divider -->
					<li
						v-if="index !== breadcrumbs.length - 1"
						class="breadcrumb-divider"
						aria-hidden="true"
					>
						<ChevronRight class="size-4" />
					</li>
				</template>
			</ol>
		</nav>
	</div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

/* A styled container for the breadcrumb list, matching the header's aesthetic */
.breadcrumb-trail {
    @apply flex items-center px-3 py-1.5 rounded-full;
    border: 1px solid var(--header-border);
    background: color-mix(in srgb, var(--header-surface) 65%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--header-link-hover) 5%, transparent);
}

/* Styling for clickable breadcrumb links */
.breadcrumb-link {
    @apply transition-colors duration-200;
    color: var(--header-link);
}
.breadcrumb-link:hover {
    color: var(--header-link-hover);
}

/* Styling for the current, non-clickable page label */
.breadcrumb-current {
    font-weight: 600;
    color: var(--section-title-color);
}

/* Styling for the separator icon */
.breadcrumb-divider {
    color: var(--text-muted);
    opacity: 0.8;
}
</style>