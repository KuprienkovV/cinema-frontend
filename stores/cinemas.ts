import { defineStore } from 'pinia'
import type { Cinema } from '~/types/api'

interface CinemasState {
  cinemas: Cinema[]
  loading: boolean
  error: unknown | null
}

export const useCinemasStore = defineStore('cinemas', {
  state: (): CinemasState => ({
    cinemas: [],
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
  },
})