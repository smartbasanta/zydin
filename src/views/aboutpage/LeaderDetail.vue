<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { LinkedinIcon, TwitterIcon, ArrowLeftIcon } from 'lucide-vue-next';
import LoadingState from '@/components/loading/LoadingState.vue';
import { useLeadersAPI } from '@/composables/fetch-public-apis/useLeadersAPI';
import { useDefaultImages } from '@/composables/useDefaultImages';

const { defaultProfileImage } = useDefaultImages(); // 2. Get the images you need
const route = useRoute();
const leaderId = route.params.id as string;

const { leader, isLoading, fetchLeaderById } = useLeadersAPI();

onMounted(() => {
    fetchLeaderById(leaderId);
});
</script>

<template>
  <section class="leader-detail section-bg">
    <div v-if="isLoading" class="leader-detail__loading">
      <LoadingState message="Loading Profile..." />
    </div>

    <div v-else-if="leader" class="container mx-auto px-6 py-20 leader-detail__content">
      <div class="leader-detail__grid">
        <aside class="leader-profile-card">
          <div class="leader-profile-card__avatar">
            <img
              :src="leader.image_url ?? leader.image_thumbnail_url ?? defaultProfileImage"
              :alt="`Portrait of ${leader.name}`"
              loading="lazy"
            />
          </div>
          <h1>{{ leader.name }}</h1>
          <p>{{ leader.position }}</p>
          <div v-if="leader.socials" class="leader-profile-card__socials">
            <a v-if="leader.socials.linkedin" :href="leader.socials.linkedin" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon class="w-5 h-5" />
            </a>
            <a v-if="leader.socials.twitter" :href="leader.socials.twitter" target="_blank" rel="noopener noreferrer">
              <TwitterIcon class="w-5 h-5" />
            </a>
          </div>
        </aside>

        <article class="leader-info">
          <section v-if="leader.quote" class="leader-info__quote">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path
                d="M9.352 4C4.456 7.424 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.424-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
            </svg>
            <p>{{ leader.quote }}</p>
          </section>

          <section v-if="leader.bio" class="leader-info__section">
            <h2>About {{ leader.name.split(' ')[0] }}</h2>
            <div class="leader-info__body" v-html="leader.bio.replace(/\n/g, '<p></p>')"></div>
          </section>

          <section v-if="leader.career_highlights" class="leader-info__section">
            <h2>Career Highlights</h2>
            <dl>
              <div v-for="(value, key) in leader.career_highlights" :key="key">
                <dt>{{ key }}</dt>
                <dd>{{ value }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="leader.education" class="leader-info__section">
            <h2>Education</h2>
            <dl>
              <div v-for="(value, key) in leader.education" :key="key">
                <dt>{{ key }}</dt>
                <dd>{{ value }}</dd>
              </div>
            </dl>
          </section>

          <RouterLink :to="{ name: 'about.leadership-team' }" class="leader-info__back">
            <ArrowLeftIcon class="w-4 h-4" />
            Back to Leadership Team
          </RouterLink>
        </article>
      </div>
    </div>

    <div v-else class="leader-detail__empty">
      <h1>Leader Not Found</h1>
      <p>The profile you are looking for does not exist or could not be loaded.</p>
      <RouterLink :to="{ name: 'about.leadership-team' }">Return to Leadership Team</RouterLink>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.leader-detail {
  --leader-accent: color-mix(in srgb, var(--color-primary-600) 70%, var(--section-title-color));
  --leader-surface: color-mix(in srgb, var(--section-bg) 92%, var(--color-primary-500));
  --leader-border: color-mix(in srgb, var(--section-title-color) 18%, var(--color-primary-500));
}
:global(.dark) .leader-detail {
  --leader-accent: color-mix(in srgb, var(--color-primary-400) 80%, var(--section-title-color));
}

.leader-detail__loading,
.leader-detail__empty {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 4rem 1.5rem;
}
.leader-detail__empty h1 {
  font-size: 2rem;
  color: var(--section-title-color);
  margin-bottom: 0.5rem;
}
.leader-detail__empty p {
  color: var(--section-text-color);
  margin-bottom: 1rem;
}
.leader-detail__empty a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  background-image: var(--gradient-secondary);
  color: var(--color-static-white);
}

.leader-detail__grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 1024px) {
  .leader-detail__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 2fr);
  }
}

.leader-profile-card {
  position: sticky;
  top: 6rem;
  align-self: start;
  border-radius: 1.75rem;
  border: 1px solid var(--leader-border);
  background: var(--leader-surface);
  box-shadow: 0 30px 60px -45px color-mix(in srgb, var(--leader-accent) 35%, var(--color-primary-500));
  padding: clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;
}
.leader-profile-card__avatar {
  width: clamp(8rem, 20vw, 10rem);
  height: clamp(8rem, 20vw, 10rem);
  margin: 0 auto 1.25rem;
  border-radius: 2rem;
  overflow: hidden;
  /* border: 3px solid color-mix(in srgb, var(--leader-accent) 55%, transparent); */
}
.leader-profile-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.leader-profile-card h1 {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--section-title-color);
}
.leader-profile-card p {
  color: var(--section-text-color);
  margin-top: 0.25rem;
}
.leader-profile-card__socials {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.leader-profile-card__socials a {
  color: var(--leader-accent);
  padding: 0.4rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--leader-accent) 25%, var(--color-primary-500));
}

.leader-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.leader-info__quote {
  border-radius: 1.5rem;
  padding: clamp(1.5rem, 4vw, 2rem);
  background: color-mix(in srgb, var(--leader-surface) 90%, var(--color-primary-500));
  border: 1px solid var(--leader-border);
  position: relative;
  color: var(--section-title-color);
}
.leader-info__quote svg {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  color: var(--leader-accent);
  opacity: 0.15;
}
.leader-info__quote p {
  margin: 0;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  line-height: 1.7;
}

.leader-info__section {
  border-radius: 1.5rem;
  border: 1px solid var(--leader-border);
  background: var(--leader-surface);
  padding: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 30px 60px -45px color-mix(in srgb, var(--leader-accent) 30%, var(--color-primary-500));
}
.leader-info__section h2 {
  font-size: 1.4rem;
  color: var(--section-title-color);
  margin-bottom: 1rem;
}
.leader-info__body {
  color: var(--section-text-color);
  line-height: 1.7;
}
.leader-info__section dl div + div {
  margin-top: 1rem;
}
.leader-info__section dt {
  font-weight: 600;
  color: var(--section-title-color);
}
.leader-info__section dd {
  margin: 0.35rem 0 0 0;
  padding-left: 1rem;
  border-left: 2px solid var(--leader-border);
  color: var(--section-text-color);
}

.leader-info__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--leader-accent);
}
</style>