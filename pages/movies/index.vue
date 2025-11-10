<template>
<ul>
  <li v-for="movie in movies" :key="movie.id">
    <nuxt-link :to="`/movies/${movie.id}/sessions`">Link to {{ movie.title }}</nuxt-link>
  </li>
</ul>
</template>
<script setup lang="ts">
import { useMoviesStore } from '~/stores/movies';
const moviesStore = useMoviesStore();
const { movies, loading } = storeToRefs(moviesStore);
await useAsyncData('initial-offers', async () => {
  await moviesStore.fetchMovies();
});

</script>  