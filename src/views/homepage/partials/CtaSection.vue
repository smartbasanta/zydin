<template>
    <section class="py-20 md:py-28 section-bg relative overflow-hidden">
        <div class="cta-glow cta-glow--primary" aria-hidden="true"></div>
        <div class="cta-glow cta-glow--secondary" aria-hidden="true"></div>
        <div class="container px-6 mx-auto text-center relative z-10">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-3xl md:text-4xl lg:text-5xl section-title font-bold tracking-tight mb-6">Join Us in Shaping the Future of Healthcare</h2>
                <p class="text-lg md:text-xl lg:text-2xl section-description leading-relaxed max-w-3xl mx-auto mb-12">
                    Explore a rewarding career with Zydin Biotech and be part of a team dedicated to advancing pharmaceutical innovation.
                </p>
                <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <RouterLink :to="{ name: 'career' }" class="btn btn-primary shadow-xl hover:-translate-y-0">
                        View Open Positions
                    </RouterLink>
                    <RouterLink :to="{ name: 'contact' }" class="btn btn-glass text-section-title border-section-title/30 hover:bg-section-title/10">
                        Contact Us
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.cta-glow {
    position: absolute;
    width: 360px;
    height: 360px;
    border-radius: 9999px;
    filter: blur(120px);
    opacity: 0.35;
    pointer-events: none;
}
.cta-glow--primary {
    bottom: -40px;
    left: 10%;
    background: var(--gradient-primary);
}
.cta-glow--secondary {
    top: -60px;
    right: 8%;
    background: var(--gradient-secondary);
}
</style>
