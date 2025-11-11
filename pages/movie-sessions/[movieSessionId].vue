<template>
  <div v-if="session && movie && cinema" class="session-page">
    <header class="session-header">
      <h2 class="session-title">Выбрать места</h2>
      <div class="session-info">
        <div class="session-info__details">
          <p><strong>Фильм:</strong> {{ movie.title }}</p>
          <p><strong>Кинотеатр:</strong> {{ cinema.name }}</p>
          <p><strong>Время:</strong> {{ formatDateTime(session.startTime) }}</p>
        </div>
      </div>
    </header>

    <SeatGrid
      v-if="session.seats"
      class="seat-selector"
      :rows="session.seats.rows"
      :seats-per-row="session.seats.seatsPerRow"
      :booked-seats="session.bookedSeats"
      v-model="selectedSeats"
      :interactive="isAuthorized"
      @booked-seat-click="handleBookedSeatClick"
    />

    <div v-if="session.seats" class="actions">
      <div class="selected-info" v-if="isAuthorized">
        <span v-if="selectedSeats.length">
          Вы выбрали:
          <strong>
            {{
              selectedSeats
                .map((seat) => `ряд ${seat.rowNumber}, место ${seat.seatNumber}`)
                .join('; ')
            }}
          </strong>
        </span>
        <span v-else>Выберите места на схеме зала</span>
      </div>

      <NuxtLink
        v-if="!isAuthorized"
        class="primary-button"
        to="/auth/login"
      >
        Войти для бронирования
      </NuxtLink>

      <button
        v-else
        type="button"
        class="primary-button"
        :disabled="!selectedSeats.length || submitting"
        @click="bookSelectedSeats"
      >
        {{ submitting ? 'Бронирование...' : 'Забронировать' }}
      </button>
    </div>
  </div>
  <p v-else class="empty-state">Данные по сеансу не найдены.</p>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Seat } from '~/types/api'
import { useSessionsStore } from '~/stores/sessions'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'

definePageMeta({
  title: 'Выбор мест',
})

const config = useRuntimeConfig()
const route = useRoute()
const sessionId = computed(() => Number(route.params.movieSessionId))

const { data: authData } = await useAsyncData('auth-session-status', () =>
  $fetch<{ authenticated: boolean }>('/api/auth/session')
)
const isAuthorized = computed(() => authData.value?.authenticated ?? false)

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
      sessionsStore.ensureSessionDetails(sessionId.value, { force: true }),
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

const selectedSeats = ref<Seat[]>([])
watch(
  () => session.value?.id,
  () => {
    selectedSeats.value = []
  }
)
watch(
  bookedSeats,
  (booked) => {
    if (!booked.length) return
    selectedSeats.value = selectedSeats.value.filter(
      (seat) =>
        !booked.some(
          (b) => b.rowNumber === seat.rowNumber && b.seatNumber === seat.seatNumber
        )
    )
  },
  { deep: true }
)
watch(
  isAuthorized,
  (value) => {
    if (!value) {
      selectedSeats.value = []
    }
  }
)

const toast = useToast()
const submitting = ref(false)

const handleBookedSeatClick = () => {
  toast.info({ title: 'Место занято', message: 'Выберите другое место.' })
}

const bookSelectedSeats = async () => {
  if (!isAuthorized.value || !selectedSeats.value.length || !session.value) {
    return
  }

  submitting.value = true
  try {
    await $fetch(`/api/secure/movieSessions/${session.value.id}/bookings`, {
      method: 'POST',
      body: {
        seats: selectedSeats.value,
      },
    })
    toast.success({
      title: 'Успех',
      message: 'Места успешно забронированы.',
    })
    selectedSeats.value = []
    await sessionsStore.ensureSessionDetails(session.value.id, { force: true })
    await navigateTo('/me/bookings')
  } catch (error: any) {
    toast.error({
      title: 'Ошибка',
      message: error?.data?.message ?? 'Не удалось забронировать места.',
    })
  } finally {
    submitting.value = false
  }
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped lang="scss">
.session-page {
  width: 100%;
  padding: 48px 72px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.session-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.session-title {
  font-size: 40px;
  font-weight: 400;
}

.session-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;

  &__poster {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 16px;
    border: 1px solid #ffffff;
  }

  &__details {
    text-align: left;
    font-size: 18px;
    line-height: 1.6;
  }
}

.seat-selector {
  margin: 0 auto;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.selected-info {
  font-size: 18px;
  text-align: center;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 12px 24px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  font-size: 18px;
  color: #ffffff;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-button:not([disabled]):hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.empty-state {
  font-size: 24px;
  color: #cccccc;
  padding: 40px 0;
  text-align: center;
}
</style>

