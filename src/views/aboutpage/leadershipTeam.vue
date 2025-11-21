<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useLeadersAPI } from '@/composables/fetch-public-apis/useLeadersAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages();
const { leaders, isLoading, fetchLeaders } = useLeadersAPI();

onMounted(fetchLeaders);

const ceo = computed(() => leaders.value.find(l => l.position.includes('CEO')));
const teamMembers = computed(() => leaders.value.filter(l => !l.position.includes('CEO')));
</script>

<template>
  <div class="section-bg">
    <header class="leadership-hero">
        <div class="leadership-hero__glow leadership-hero__glow--primary" aria-hidden="true"></div>
        <div class="leadership-hero__glow leadership-hero__glow--secondary" aria-hidden="true"></div>
        <div class="container mx-auto px-6 py-20 md:py-28 text-center relative z-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold section-title mb-4">Our Leadership</h1>
            <p class="text-lg md:text-xl section-description max-w-3xl mx-auto">
              The experienced and dedicated team guiding Zydin Biotech towards a new era in oncology.
            </p>
        </div>
    </header>

    <main class="py-20 md:py-28">
      <div v-if="isLoading" class="min-h-[40vh] grid place-content-center">
        <LoadingState message="Loading Team..." />
      </div>

      <div v-else-if="leaders.length > 0" class="container mx-auto px-6 space-y-28">
        <section v-if="ceo" class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative flex justify-center">
            <div class="ceo-avatar__glow"></div>
            <img 
              class="relative rounded-full w-64 h-64 lg:w-80 lg:h-80 object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
              :src="ceo.image_url ?? ceo.image_thumbnail_url ?? defaultProfileImage" 
              :alt="ceo.name" 
            />
          </div>
          <div>
            <h2 class="text-2xl font-semibold section-title mb-4">A Message from our Founder & CEO</h2>
            <blockquote class="border-l-4 border-primary-500 pl-6 mb-6">
              <p class="text-lg section-title italic">"{{ ceo.message }}"</p>
            </blockquote>
            <div class="text-left">
              <h3 class="font-bold section-title text-xl">{{ ceo.name }}</h3>
              <p class="text-muted">{{ ceo.position }}</p>
            </div>
          </div>
        </section>

        <section>
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold section-title">Meet the Executive Team</h2>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <RouterLink
              v-for="leader in teamMembers"
              :key="leader.id"
              :to="{ name: 'about.leader-detail', params: { id: leader.id } }"
              class="leader-card group"
            >
              <div class="leader-card__avatar">
                <img :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage" :alt="leader.name" />
              </div>
              <div class="text-center">
                <h3 class="text-xl font-bold section-title">{{ leader.name }}</h3>
                <p class="text-muted">{{ leader.position }}</p>
                <span class="inline-block mt-4 text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">View Profile &rarr;</span>
              </div>
            </RouterLink>
          </div>
        </section>
      </div>

      <div v-else class="text-center text-muted py-20">
        <p>Leadership information is currently unavailable.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.leadership-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--card-border);
}
.leadership-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-color: var(--section-bg);
  opacity: 0.8;
}

.leadership-hero__glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(120px);
}
.leadership-hero__glow--primary {
  background: var(--gradient-primary);
  width: 400px; height: 400px;
  top: -100px; left: -100px; opacity: 0.3;
}
.leadership-hero__glow--secondary {
  background: var(--gradient-secondary);
  width: 300px; height: 300px;
  bottom: -100px; right: -50px; opacity: 0.2;
}

.ceo-avatar__glow {
  position: absolute;
  width: 100%; height: 100%;
  background: var(--gradient-primary);
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.4;
  transform: scale(0.8);
}

.leader-card {
  @apply block p-6 rounded-2xl transition-all duration-300;
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-md);
}
.leader-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-400);
}
.leader-card__avatar {
  @apply w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2;
  border-color: var(--card-border);
}
.leader-card__avatar img {
  @apply w-full h-full object-cover;
}
</style>