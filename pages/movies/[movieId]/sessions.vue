<template>
  <section>
    <h2>Сеансы фильма {{ movie?.title ?? `#${movieId}` }}</h2>
    <ul v-if="sessions.length">
      <li v-for="session in sessions" :key="session.id">
        <NuxtLink :to="`/movie-sessions/${session.id}`">
          {{ session.startTime }} — {{ cinemaById.get(session.cinemaId) ?? `Кинотеатр #${session.cinemaId}` }}
        </NuxtLink>
      </li>
    </ul>
    <p v-else>Сеансов нет</p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import { useSessionsStore } from '~/stores/sessions'

const route = useRoute()
const movieId = computed(() => Number(route.params.movieId))

const moviesStore = useMoviesStore()
const sessionsStore = useSessionsStore()
const cinemasStore = useCinemasStore()
const { movies } = storeToRefs(moviesStore)
const { cinemas } = storeToRefs(cinemasStore)

await useAsyncData(
  () => `movie-sessions-${movieId.value}`,
  () =>
    Promise.all([
      moviesStore.fetchMovies(),
      cinemasStore.fetchCinemas(),
      sessionsStore.ensureMovieSessions(movieId.value),
    ]),
  { watch: [movieId] }
)

const sessions = computed(() => sessionsStore.sessionsByMovie(movieId.value))
const movie = computed(() => movies.value.find((item) => item.id === movieId.value))
const cinemaById = computed(() => {
  const map = new Map<number, string>()
  cinemas.value.forEach((cinema) => map.set(cinema.id, cinema.name))
  return map
})
</script>

