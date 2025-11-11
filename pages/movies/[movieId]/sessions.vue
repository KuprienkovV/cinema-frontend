<template>
  <div class="movie-sessions-page">
    <section v-if="movie" class="movie-info">
      <NuxtImg
        :src="`${config.public.apiBase}${movie.posterImage}`"
        class="movie-info__poster"
        width="160"
        height="160"
        alt="Постер фильма"
      />
      <div class="movie-info__content">
        <h2 class="movie-info__title">{{ movie.title }}</h2>
        <p class="movie-info__description">{{ movie.description }}</p>
        <p class="movie-info__meta">
          Год: {{ movie.year }}<br />
          Продолжительность: {{ formatDuration(movie.lengthMinutes) }}<br />
          Рейтинг: {{ movie.rating.toFixed(1) }}
        </p>
      </div>
    </section>

    <section v-if="groupedSessions.length" class="sessions-groups">
      <article
        v-for="group in groupedSessions"
        :key="group.dateKey"
        class="sessions-group"
      >
        <header class="sessions-group__header">
          <h2>{{ group.title }}</h2>
        </header>

        <DataTable
          :items="group.rows"
          :columns="columns"
          item-key="id"
          class="sessions-group__table"
          :show-header="false"
        >
          <template #cell-cinema="{ item }: { item: SessionRow }">
            <span class="cinema-name">{{ item.cinemaName }}</span>
          </template>
          <template #cell-times="{ item }: { item: SessionRow }">
            <div class="times-grid">
              <NuxtLink
                v-for="session in item.sessions"
                :key="session.id"
                class="time-button"
                :to="`/movie-sessions/${session.id}`"
              >
                {{ formatTime(session.startTime) }}
              </NuxtLink>
            </div>
          </template>
        </DataTable>
      </article>
    </section>

    <p v-else class="empty-state">Сеансов нет</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { MovieSession } from '~/types/api'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import { useSessionsStore } from '~/stores/sessions'

interface SessionRow {
  id: string
  cinemaId: number
  cinemaName: string
  sessions: MovieSession[]
}

definePageMeta({
  title: 'Сеансы фильма',
})

const config = useRuntimeConfig()
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

const movie = computed(() => movies.value.find((item) => item.id === movieId.value))
const sessions = computed(() => sessionsStore.sessionsByMovie(movieId.value))

const cinemaById = computed(() => {
  const map = new Map<number, string>()
  cinemas.value.forEach((cinema) => map.set(cinema.id, cinema.name))
  return map
})

const groupedSessions = computed(() => {
  const byDate = new Map<string, MovieSession[]>()
  sessions.value.forEach((session) => {
    const dateKey = new Date(session.startTime).toDateString()
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, [])
    }
    byDate.get(dateKey)!.push(session)
  })

  return Array.from(byDate.entries()).map(([dateKey, list]) => {
    const rowsMap = new Map<number, SessionRow>()
    list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    list.forEach((session) => {
      const cinemaName = cinemaById.value.get(session.cinemaId) ?? `Кинотеатр #${session.cinemaId}`
      if (!rowsMap.has(session.cinemaId)) {
        rowsMap.set(session.cinemaId, {
          id: `${dateKey}-${session.cinemaId}`,
          cinemaId: session.cinemaId,
          cinemaName,
          sessions: [],
        })
      }
      rowsMap.get(session.cinemaId)!.sessions.push(session)
    })

    return {
      dateKey,
      title: formatDate(dateKey),
      rows: Array.from(rowsMap.values()),
    }
  })
})

const columns = [
  { key: 'cinema', label: '', align: 'left' as const },
  { key: 'times', label: '', align: 'left' as const, width: '2fr' },
]

const formatDate = (dateKey: string) => {
  const date = new Date(dateKey)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  })
}

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDuration = (minutes: number) => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}:${mins.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.movie-sessions-page {
  width: 100%;
  padding: 48px 72px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.movie-info {
  display: flex;
  gap: 32px;
  align-items: flex-start;

  &__poster {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 16px;
    border: 1px solid #ffffff;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__title {
    font-size: 40px;
    font-weight: 400;
  }

  &__description {
    font-size: 18px;
    line-height: 1.6;
    max-width: 560px;
    color: #f0f0f0;
  }

  &__meta {
    font-size: 18px;
    line-height: 1.6;
  }
}

.sessions-groups {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.sessions-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sessions-group__header {
  padding-bottom: 16px;
  border-bottom: 1px solid #a7a7a7;

  h2 {
    font-size: 22px;
    font-weight: 400;
  }
}

.cinema-name {
  font-size: 22px;
  font-weight: 400;
}

.times-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.time-button {
  display: inline-flex;
  min-width: 90px;
  padding: 10px 18px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.time-button:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.empty-state {
  font-size: 24px;
  color: #cccccc;
  text-align: center;
  padding: 40px 0;
}
</style>