import { defineStore } from 'pinia'
import type { Cinema } from '~/types/api'
import { toApiError } from '~/utils/errors'

interface CinemasState {
  cinemas: Cinema[]
  loading: boolean
  error: string | null
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
      } catch (error: unknown) {
        const apiError = toApiError(error, 'Не удалось загрузить кинотеатры')
        this.error = apiError.message
      } finally {
        this.loading = false
      }
    },
  },
})