import { defineStore } from 'pinia'
import type { Cinema, MovieSession } from '~/types/api'

interface CinemasState {
  cinemas: Cinema[]
  sessionsByCinemaId: Record<number, MovieSession[]>
  loading: boolean
  error: unknown | null
}

export const useCinemasStore = defineStore('cinemas', {
  state: (): CinemasState => ({
    cinemas: [],
    sessionsByCinemaId: {},
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCinemas(options?: { force?: boolean }) {
      if (!options?.force && this.cinemas.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Cinema[]>('/api/cinemas')
        this.cinemas = data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchCinemaSessions(cinemaId: number, options?: { force?: boolean }) {
      if (this.cinemas.length === 0) {
        await this.fetchCinemas()
      }

      const cinemaExists = this.cinemas.some((cinema) => cinema.id === cinemaId)
      if (!cinemaExists) {
        console.error(`Cinema ${cinemaId} not found in store`)
        return
      }

      if (!options?.force && this.sessionsByCinemaId[cinemaId]?.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<MovieSession[]>(`/api/cinemas/${cinemaId}/sessions`)
        this.sessionsByCinemaId[cinemaId] = data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
