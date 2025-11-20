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

    // Auto-resolve breadcrumb from route meta
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
	<div
		class="flex flex-wrap items-center justify-between gap-2 sm:gap-4"
	>
		<RouterLink
			v-if="backTarget"
			:to="backTarget"
			class="inline-flex items-center gap-1 rounded-lg border border-muted px-3 py-1.5 text-sm font-medium text-secondary hover:text-black dark:hover:text-gray-100 transition"
		>
			<ArrowLeftCircle class="size-4 text-muted-foreground" />
			Back
		</RouterLink>

		<nav
			aria-label="breadcrumb"
			class="flex items-center gap-2 text-sm text-muted"
		>
			<ol class="flex flex-wrap items-center gap-1 sm:gap-2">
				<template v-for="(item, index) in breadcrumbs" :key="index">
					<li class="inline-flex items-center gap-1">
						<!-- Current page -->
						<span
							v-if="index === breadcrumbs.length - 1"
							class="font-semibold text-black dark:text-gray-100"
							aria-current="page"
						>
							{{ item.label }}
						</span>

						<!-- Link items -->
						<RouterLink
							v-else-if="item.to"
							:to="item.to"
							class="text-secondary hover:text-black dark:hover:text-gray-100 transition-colors"
						>
							{{ item.label }}
						</RouterLink>

						<!-- Plain label fallback -->
						<span v-else class="text-secondary">{{ item.label }}</span>
					</li>

					<!-- Divider -->
					<li
						v-if="index !== breadcrumbs.length - 1"
						class="text-muted-foreground"
						aria-hidden="true"
					>
						<ChevronRight class="size-4" />
					</li>
				</template>
			</ol>
		</nav>
	</div>
</template>
