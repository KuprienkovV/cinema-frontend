import { defineStore } from 'pinia'
import type { Movie } from '~/types/api'

interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: unknown | null
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
      } catch (error: any) {
        this.error = error?.data?.message ?? error?.message ?? 'Не удалось загрузить фильмы'
      } finally {
        this.loading = false
      }
    },
  },
})