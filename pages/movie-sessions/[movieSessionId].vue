<template>
  <section v-if="session">
    <h2>Сеанс фильма {{ movie?.title ?? `#${session.movieId}` }}</h2>
    <p>Кинотеатр: {{ cinema?.name ?? `#${session.cinemaId}` }}</p>
    <p>Дата и время начала: {{ session.startTime }}</p>

    <div v-if="session.seats">
      <p>
        Зал: {{ session.seats.rows }} рядов × {{ session.seats.seatsPerRow }} мест
        <span v-if="totalSeats"> (всего {{ totalSeats }} мест)</span>
      </p>
    </div>

    <div v-if="bookedSeats.length">
      <h3>Забронированные места</h3>
      <ul>
        <li v-for="seat in bookedSeats" :key="`${seat.rowNumber}-${seat.seatNumber}`">
          Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
        </li>
      </ul>
    </div>
    <p v-else>Свободно все места.</p>
  </section>
  <p v-else>Данные по сеансу не найдены.</p>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionsStore } from '~/stores/sessions'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'

const route = useRoute()
const sessionId = computed(() => Number(route.params.movieSessionId))

const sessionsStore = useSessionsStore()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()
const { movies } = storeToRefs(moviesStore)
const { cinemas } = storeToRefs(cinemasStore)

await useAsyncData(
  () => `movie-session-${sessionId.value}`,
  () =>
    Promise.all([
      moviesStore.fetchMovies(),
      cinemasStore.fetchCinemas(),
      sessionsStore.ensureSessionDetails(sessionId.value),
    ]),
  { watch: [sessionId] }
)

const session = computed(() => sessionsStore.session(sessionId.value))
const movie = computed(() =>
  session.value ? movies.value.find((item) => item.id === session.value?.movieId) : undefined
)
const cinema = computed(() =>
  session.value ? cinemas.value.find((item) => item.id === session.value?.cinemaId) : undefined
)
const bookedSeats = computed(() => session.value?.bookedSeats ?? [])
const totalSeats = computed(() => {
  const seats = session.value?.seats
  return seats ? seats.rows * seats.seatsPerRow : undefined
})
</script>

