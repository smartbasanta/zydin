<script setup lang="ts">

</script>

<template>
  <div class="not-found-container" :style="{ backgroundImage: `url('/images/errors/404.webp')` }">
    <div class="content">
      <h1>Oops! Page Not Found</h1>
      <p>It seems you've wandered into a digital abyss. Click below to return to safety.</p>
      <router-link to="/" class="home-link">Back to Homepage</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  font-family: Arial, sans-serif;
}

.content {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.home-link {
  color: #ffd700;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1em;
}

.home-link:hover {
  text-decoration: underline;
}
</style>