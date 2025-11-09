import { defineStore } from 'pinia'
import type { Movie, MovieSession } from '~/types/api'

interface MoviesState {
  movies: Movie[]
  sessionsByMovieId: Record<number, MovieSession[]>
  loading: boolean
  error: unknown | null
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    sessionsByMovieId: {},
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
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchMovieSessions(movieId: number, options?: { force?: boolean }) {
      if (this.movies.length === 0) {
        await this.fetchMovies()
      }

      const movieExists = this.movies.some((movie) => movie.id === movieId)
      if (!movieExists) {
        console.error(`Movie ${movieId} not found in store`)
        return
      }

      if (!options?.force && this.sessionsByMovieId[movieId]?.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<MovieSession[]>(`/api/movies/${movieId}/sessions`)
        this.sessionsByMovieId[movieId] = data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})