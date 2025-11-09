<template>
  <section>
    <h2>Кинотеатры</h2>
    <ul>
      <li v-for="cinema in cinemas" :key="cinema.id">
        <nuxt-link :to="`/cinemas/${cinema.id}/sessions`">
          {{ cinema.name }} — {{ cinema.address }}
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useCinemasStore } from '~/stores/cinemas'

const cinemasStore = useCinemasStore()
const { cinemas } = storeToRefs(cinemasStore)

await useAsyncData('initial-cinemas', () => cinemasStore.fetchCinemas())
</script>

