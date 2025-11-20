<template>
    <section class="py-24 sm:py-32 bg-background-soft">
        <div class="container px-6 mx-auto text-center">
            <div class="max-w-3xl mx-auto">
                 <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Join Us in Shaping the Future of Healthcare
                </h2>
                <p class="max-w-2xl mx-auto mt-4 mb-8 text-lg text-text-secondary">
                    Explore a rewarding career with Zydin Biotech and be part of a team dedicated to making a difference.
                </p>
                <RouterLink :to="{ name: 'career' }" class="btn btn-primary btn-lg">
                    View Open Positions
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
.btn-lg {
    @apply px-8 py-4 text-lg rounded-lg;
}
</style>