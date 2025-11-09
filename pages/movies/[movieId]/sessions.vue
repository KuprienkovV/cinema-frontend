<template>
  <section>
    <h2>Сеансы фильма {{ movie?.title ?? `#${movieId}` }}</h2>
    <ul v-if="sessions.length">
      <li v-for="session in sessions" :key="session.id">
        {{ session.startTime }} — cinemaId: {{ session.cinemaId }}
      </li>
    </ul>
    <p v-else>Сеансов нет</p>
  </section>
</template>

<script setup lang="ts">
import { useMoviesStore } from '~/stores/movies'

const route = useRoute()
const movieId = computed(() => Number(route.params.movieId))

const moviesStore = useMoviesStore()
const { movies, sessionsByMovieId, loading } = storeToRefs(moviesStore)

await useAsyncData(
  () => `movie-sessions-${movieId.value}`,
  () => moviesStore.fetchMovieSessions(movieId.value),
  { watch: [movieId] }
)

const sessions = computed(() => sessionsByMovieId.value[movieId.value] ?? [])
const movie = computed(() => movies.value.find((item) => item.id === movieId.value))
</script>

