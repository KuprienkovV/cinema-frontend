<template>
  <div class="bookings-page">
    <h1 class="bookings-page__title">Мои билеты</h1>

    <div v-if="bookingsLoading" class="bookings-page__state">Загрузка...</div>
    <div v-else-if="!hasAnyBookings" class="bookings-page__state">
      Билетов пока нет.
    </div>

    <template v-else>
      <section
        v-if="unpaidBookings.length"
        class="bookings-section"
      >
        <header class="bookings-section__header">
          <h2>Не оплаченные</h2>
        </header>
        <ul class="booking-list">
          <li
            v-for="item in unpaidBookings"
            :key="item.booking.id"
            class="booking-row booking-row--with-action"
          >
            <div class="booking-row__info">
              <span class="booking-row__title">{{ item.movieTitle }}</span>
              <span class="booking-row__subtitle">{{ item.cinemaName }}</span>
              <span class="booking-row__datetime">{{ item.dateLabel }}</span>
            </div>

            <div class="booking-row__seats">
              <span
                v-for="seat in item.booking.seats"
                :key="`${seat.rowNumber}-${seat.seatNumber}`"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </span>
            </div>

            <div class="booking-row__actions">
              <button
                type="button"
                class="booking-row__button"
                :disabled="payLoadingId === item.booking.id"
                @click="onPay(item.booking.id)"
              >
                {{ payLoadingId === item.booking.id ? 'Оплата…' : 'Оплатить' }}
              </button>
              <span class="booking-row__timer">
                Осталось {{ formatCountdown(item.timeLeft) }}
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section
        v-if="upcomingBookings.length"
        class="bookings-section"
      >
        <header class="bookings-section__header">
          <h2>Будущие</h2>
        </header>
        <ul class="booking-list">
          <li
            v-for="item in upcomingBookings"
            :key="item.booking.id"
            class="booking-row"
          >
            <div class="booking-row__info">
              <span class="booking-row__title">{{ item.movieTitle }}</span>
              <span class="booking-row__subtitle">{{ item.cinemaName }}</span>
              <span class="booking-row__datetime">{{ item.dateLabel }}</span>
            </div>

            <div class="booking-row__seats">
              <span
                v-for="seat in item.booking.seats"
                :key="`${seat.rowNumber}-${seat.seatNumber}`"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section
        v-if="pastBookings.length"
        class="bookings-section"
      >
        <header class="bookings-section__header">
          <h2>Прошедшие</h2>
        </header>
        <ul class="booking-list">
          <li
            v-for="item in pastBookings"
            :key="item.booking.id"
            class="booking-row"
          >
            <div class="booking-row__info">
              <span class="booking-row__title">{{ item.movieTitle }}</span>
              <span class="booking-row__subtitle">{{ item.cinemaName }}</span>
              <span class="booking-row__datetime">{{ item.dateLabel }}</span>
            </div>

            <div class="booking-row__seats">
              <span
                v-for="seat in item.booking.seats"
                :key="`${seat.rowNumber}-${seat.seatNumber}`"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </span>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from '#imports'
import type { Booking, Settings } from '~/types/api'
import { useBookingsStore } from '~/stores/bookings'
import { useSessionsStore } from '~/stores/sessions'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import { toApiError } from '~/utils/errors'

interface BookingViewModel {
  booking: Booking
  movieTitle: string
  cinemaName: string
  dateLabel: string
  startTimestamp: number | null
  timeLeft: number
}

definePageMeta({
  title: 'Мои билеты',
  middleware: ['auth'],
})

const toast = useToast()
const bookingsStore = useBookingsStore()
const sessionsStore = useSessionsStore()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()

const { bookings, loading } = storeToRefs(bookingsStore)
const { movies } = storeToRefs(moviesStore)
const { cinemas } = storeToRefs(cinemasStore)

const settings = ref<Settings | null>(null)
const now = ref(Date.now())
const payLoadingId = ref<string | null>(null)
const refreshInProgress = ref(false)

let timer: number | undefined

await useAsyncData('bookings-init', async () => {
  try {
    const [settingsData] = await Promise.all([
      $fetch<Settings>('/api/settings'),
      moviesStore.fetchMovies(),
      cinemasStore.fetchCinemas(),
    ])

    settings.value = settingsData

    await bookingsStore.fetchBookings({ force: true })

    await Promise.all(
      bookingsStore.bookings.map((booking) =>
        sessionsStore.ensureSessionDetails(booking.movieSessionId)
      )
    )
  } catch (fetchError: unknown) {
    const apiError = toApiError(fetchError, 'Не удалось загрузить билеты.')
    toast.error({
      title: 'Ошибка',
      message: apiError.message,
    })
  }
})

watch(
  bookings,
  async (list) => {
    if (!list.length) {
      return
    }

    await Promise.all(
      list.map((booking) => sessionsStore.ensureSessionDetails(booking.movieSessionId))
    )
  },
  { immediate: false }
)

if (import.meta.client) {
  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) {
      window.clearInterval(timer)
    }
  })
}

const enrichedBookings = computed<BookingViewModel[]>(() => {
  return bookings.value.map((booking) => {
    const session = sessionsStore.session(booking.movieSessionId)
    const movie = session ? movies.value.find((item) => item.id === session.movieId) : undefined
    const cinema = session ? cinemas.value.find((item) => item.id === session.cinemaId) : undefined
    const startTime = session?.startTime ?? null
    const startTimestamp = startTime ? new Date(startTime).getTime() : null

    const timeLeft =
      !booking.isPaid && settings.value
        ? Math.max(
            0,
            Math.floor(
              (new Date(booking.bookedAt).getTime() +
                settings.value.bookingPaymentTimeSeconds * 1000 -
                now.value) /
                1000
            )
          )
        : 0

    return {
      booking,
      movieTitle: movie?.title ?? `Фильм #${session?.movieId ?? '—'}`,
      cinemaName: cinema?.name ?? `Кинотеатр #${session?.cinemaId ?? '—'}`,
      dateLabel: startTime ? formatSessionDate(startTime) : '—',
      startTimestamp,
      timeLeft,
    }
  })
})

const unpaidBookings = computed(() =>
  sortByStartTime(
    enrichedBookings.value.filter((item) => !item.booking.isPaid && item.timeLeft > 0),
    'asc'
  )
)

const upcomingBookings = computed(() =>
  sortByStartTime(
    enrichedBookings.value.filter(
      (item) =>
        item.booking.isPaid &&
        item.startTimestamp !== null &&
        item.startTimestamp >= now.value
    ),
    'asc'
  )
)

const pastBookings = computed(() =>
  sortByStartTime(
    enrichedBookings.value.filter(
      (item) =>
        item.booking.isPaid &&
        item.startTimestamp !== null &&
        item.startTimestamp < now.value
    ),
    'desc'
  )
)

const hasAnyBookings = computed(() => bookings.value.length > 0)
const bookingsLoading = computed(() => loading.value && !bookings.value.length)

if (import.meta.client) {
  watch(
    enrichedBookings,
    (list) => {
      if (!settings.value?.bookingPaymentTimeSeconds) {
        return
      }

      const expired = list.filter((item) => !item.booking.isPaid && item.timeLeft === 0)

      if (!expired.length || refreshInProgress.value) {
        return
      }

      expired.forEach((item) => bookingsStore.removeBookingLocal(item.booking.id))

      refreshInProgress.value = true
      bookingsStore
        .refreshBookings()
        .catch(() => {})
        .finally(() => {
          refreshInProgress.value = false
        })
    },
    { deep: true }
  )
}

function formatSessionDate(iso: string) {
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  })
  const timePart = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} ${timePart}`
}

function sortByStartTime(list: BookingViewModel[], direction: 'asc' | 'desc') {
  return [...list].sort((a, b) => {
    const aTime = a.startTimestamp ?? 0
    const bTime = b.startTimestamp ?? 0

    if (direction === 'asc') {
      return aTime - bTime
    }
    return bTime - aTime
  })
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const onPay = async (bookingId: string) => {
  if (payLoadingId.value) {
    return
  }

  payLoadingId.value = bookingId

  try {
    const response = await bookingsStore.payBooking(bookingId)

    toast.success({
      title: 'Оплата успешна',
      message: response.message ?? 'Бронирование оплачено.',
    })
  } catch (paymentError: unknown) {
    const apiError = toApiError(paymentError, 'Не удалось выполнить оплату.')
    toast.error({
      title: 'Ошибка оплаты',
      message: apiError.message,
    })
  } finally {
    payLoadingId.value = null
  }
}
</script>

<style scoped lang="scss">
.bookings-page {
  width: 100%;
  padding: 48px 72px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.bookings-page__title {
  font-size: 40px;
  font-weight: 400;
  text-align: center;
}

.bookings-page__state {
  font-size: 20px;
  text-align: center;
  color: #dcdcdc;
}

.bookings-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bookings-section__header {
  padding-bottom: 16px;
  border-bottom: 1px solid #a7a7a7;

  h2 {
    font-size: 22px;
    font-weight: 400;
  }
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.booking-row {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(200px, 1fr);
  align-items: center;
  gap: 24px;
  font-size: 18px;
}

.booking-row--with-action {
  grid-template-columns: minmax(220px, 2fr) minmax(200px, 1fr) minmax(220px, 1fr);
}

.booking-row__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
}

.booking-row__title {
  font-size: 22px;
  font-weight: 400;
}

.booking-row__subtitle {
  color: #dedede;
}

.booking-row__datetime {
  color: #dedede;
}

.booking-row__seats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #ffffff;
}

.booking-row__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.booking-row__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #ffffff;
  color: #ffffff;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.booking-row__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.booking-row__button:not(:disabled):hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.booking-row__timer {
  font-size: 16px;
  color: #dedede;
}
</style>