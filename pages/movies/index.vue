<template>
    <DataTable
      :items="movies"
      :columns="columns"
      item-key="id"
      empty-text="Нет доступных фильмов"
    >
      <template #cell-poster="{ item }: { item: Movie }">
        <NuxtImg
          :src="`${config.public.apiBase}${item.posterImage}`"
          class="poster"
          width="60"
          height="60"
          alt="Постер фильма"
        />
      </template>
      <template #cell-title="{ item }: { item: Movie }">
        <span class="movie-title">{{ item.title }}</span>
      </template>
      <template #cell-duration="{ item }: { item: Movie }">
        {{ formatDuration(item.lengthMinutes) }}
      </template>
      <template #cell-rating="{ item }: { item: Movie }">
        {{ item.rating.toFixed(2) }}
      </template>
      <template #cell-actions="{ item }: { item: Movie }">
        <NuxtLink class="table-action-button" :to="`/movies/${item.id}/sessions`">
          Посмотреть сеансы
        </NuxtLink>
      </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/api'
import { useMoviesStore } from '~/stores/movies'

definePageMeta({
  title: 'Фильмы',
})

const config = useRuntimeConfig()
const moviesStore = useMoviesStore()
const { movies } = storeToRefs(moviesStore)

await useAsyncData('movies-list', () => moviesStore.fetchMovies())

interface TableColumn {
  key: string
  label?: string
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

const columns: TableColumn[] = [
  { key: 'poster', label: '', align: 'center', width: 80 },
  { key: 'title', label: 'Название', align: 'left' },
  { key: 'duration', label: 'Продолжительность', align: 'center' },
  { key: 'rating', label: 'Рейтинг', align: 'center' },
  { key: 'actions', label: '', align: 'center', width: 220 },
]

const formatDuration = (minutes: number) => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}:${mins.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">

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
</style>