import { defineStore } from 'pinia'
import type { Movie } from '~/types/api'
import { toApiError } from '~/utils/errors'

interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMovies(options?: { force?: boolean }) {
      if (!options?.force && this.movies.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Movie[]>('/api/movies')
        this.movies = data
      } catch (error: unknown) {
        const apiError = toApiError(error, 'Не удалось загрузить фильмы')
        this.error = apiError.message
      } finally {
        this.loading = false
      }
    },
  },
})