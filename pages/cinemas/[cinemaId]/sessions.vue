<template>
  <section>
    <h2>Сеансы кинотеатра {{ cinema?.name ?? `#${cinemaId}` }}</h2>
    <ul v-if="sessions.length">
      <li v-for="session in sessions" :key="session.id">
        <NuxtLink :to="`/movie-sessions/${session.id}`">
          {{ session.startTime }} — {{ movieById.get(session.movieId) ?? `Фильм #${session.movieId}` }}
        </NuxtLink>
      </li>
    </ul>
    <p v-else>Сеансов нет</p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCinemasStore } from '~/stores/cinemas'
import { useMoviesStore } from '~/stores/movies'
import { useSessionsStore } from '~/stores/sessions'

const route = useRoute()
const cinemaId = computed(() => Number(route.params.cinemaId))

const cinemasStore = useCinemasStore()
const moviesStore = useMoviesStore()
const sessionsStore = useSessionsStore()
const { cinemas } = storeToRefs(cinemasStore)
const { movies } = storeToRefs(moviesStore)

await useAsyncData(
  () => `cinema-sessions-${cinemaId.value}`,
  () =>
    Promise.all([
      cinemasStore.fetchCinemas(),
      moviesStore.fetchMovies(),
      sessionsStore.ensureCinemaSessions(cinemaId.value),
    ]),
  { watch: [cinemaId] }
)

const sessions = computed(() => sessionsStore.sessionsByCinema(cinemaId.value))
const cinema = computed(() => cinemas.value.find((item) => item.id === cinemaId.value))
const movieById = computed(() => {
  const map = new Map<number, string>()
  movies.value.forEach((movie) => map.set(movie.id, movie.title))
  return map
})
</script>

