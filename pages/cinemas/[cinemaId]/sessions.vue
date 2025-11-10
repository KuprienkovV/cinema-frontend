<template>
    <header class="sessions-header">
      <h2>{{ cinemaTitle }}</h2>
    </header>

    <section v-if="groupedSessions.length" class="sessions-groups">
      <div
        v-for="group in groupedSessions"
        :key="group.dateKey"
        class="sessions-group"
      >
        <header class="sessions-group__header">
          <h2 class="sessions-group__title">{{ group.title }}</h2>
        </header>

        <DataTable
          :items="group.rows"
          :columns="columns"
          item-key="id"
          class="sessions-group__table"
          :show-header="false"
        >
          <template #cell-poster="{ item }: { item: SessionRow }">
            <NuxtImg
              :src="`${config.public.apiBase}${item.posterImage}`"
              class="poster"
              width="60"
              height="60"
              alt="Постер фильма"
            />
          </template>
          <template #cell-title="{ item }: { item: SessionRow }">
            <span class="movie-title">{{ item.title }}</span>
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
      </div>
    </section>

    <p v-else class="empty-state">Сеансов нет</p>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { MovieSession } from '~/types/api'
import { useCinemasStore } from '~/stores/cinemas'
import { useMoviesStore } from '~/stores/movies'
import { useSessionsStore } from '~/stores/sessions'

interface SessionRow {
  id: string
  title: string
  posterImage: string
  sessions: MovieSession[]
}

definePageMeta({
  title: 'Сеансы кинотеатра',
})

const config = useRuntimeConfig()
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

const cinemaTitle = computed(() => {
  const cinema = cinemas.value.find((item) => item.id === cinemaId.value)
  return cinema ? cinema.name : `Кинотеатр #${cinemaId.value}`
})

const sessions = computed(() => sessionsStore.sessionsByCinema(cinemaId.value))

const movieInfoById = computed(() => {
  const map = new Map<number, { title: string; posterImage: string }>()
  movies.value.forEach((movie) =>
    map.set(movie.id, { title: movie.title, posterImage: movie.posterImage })
  )
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
      const movie = movieInfoById.value.get(session.movieId)
      if (!movie) return
      if (!rowsMap.has(session.movieId)) {
        rowsMap.set(session.movieId, {
          id: `${dateKey}-${session.movieId}`,
          title: movie.title,
          posterImage: movie.posterImage,
          sessions: [],
        })
      }
      rowsMap.get(session.movieId)!.sessions.push(session)
    })

    return {
      dateKey,
      title: formatDate(dateKey),
      rows: Array.from(rowsMap.values()),
    }
  })
})

const columns = [
  { key: 'poster', label: '', align: 'center' as const, width: 80 },
  { key: 'title', label: '', align: 'left' as const, width: '1.5fr' },
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
</script>

<style scoped lang="scss">

.sessions-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    font-size: 40px;
    font-weight: 400;
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
}

.sessions-group__title {
  font-size: 22px;
  font-weight: 400;
}

.poster {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ffffff;
}

.movie-title {
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
