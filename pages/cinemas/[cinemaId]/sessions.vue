<template>
  <section>
    <h2>Сеансы кинотеатра {{ cinema?.name ?? `#${cinemaId}` }}</h2>
    <ul v-if="sessions.length">
      <li v-for="session in sessions" :key="session.id">
        {{ session.startTime }} — movieId: {{ session.movieId }}
      </li>
    </ul>
    <p v-else>Сеансов нет</p>
  </section>
</template>

<script setup lang="ts">
import { useCinemasStore } from '~/stores/cinemas'

const route = useRoute()
const cinemaId = computed(() => Number(route.params.cinemaId))

const cinemasStore = useCinemasStore()
const { cinemas, sessionsByCinemaId } = storeToRefs(cinemasStore)

await useAsyncData(
  () => `cinema-sessions-${cinemaId.value}`,
  () => cinemasStore.fetchCinemaSessions(cinemaId.value),
  { watch: [cinemaId] }
)

const sessions = computed(() => sessionsByCinemaId.value[cinemaId.value] ?? [])
const cinema = computed(() => cinemas.value.find((item) => item.id === cinemaId.value))
</script>

