import { defineStore } from 'pinia'
import type { MovieSession, MovieSessionDetails } from '~/types/api'

type SessionEntity = MovieSession & Partial<Pick<MovieSessionDetails, 'seats' | 'bookedSeats'>>

interface SessionsState {
  byId: Record<number, SessionEntity>
  byMovieId: Record<number, number[]>
  byCinemaId: Record<number, number[]>
  loading: boolean
  error: unknown | null
}

const appendUnique = (list: number[], value: number) => {
  if (!list.includes(value)) {
    list.push(value)
  }
}

export const useSessionsStore = defineStore('sessions', {
  state: (): SessionsState => ({
    byId: {},
    byMovieId: {},
    byCinemaId: {},
    loading: false,
    error: null,
  }),
  getters: {
    sessionsByMovie: (state) => (movieId: number) =>
      (state.byMovieId[movieId] ?? []).map((sessionId) => state.byId[sessionId]),
    sessionsByCinema: (state) => (cinemaId: number) =>
      (state.byCinemaId[cinemaId] ?? []).map((sessionId) => state.byId[sessionId]),
    session: (state) => (sessionId: number) => state.byId[sessionId],
    isDetailed: () => (session?: SessionEntity) =>
      Boolean(session?.seats && session?.bookedSeats),
  },
  actions: {
    upsertBase(session: MovieSession) {
      this.byId[session.id] = { ...this.byId[session.id], ...session }

      this.byMovieId[session.movieId] ||= []
      appendUnique(this.byMovieId[session.movieId], session.id)

      this.byCinemaId[session.cinemaId] ||= []
      appendUnique(this.byCinemaId[session.cinemaId], session.id)
    },
    upsertManyBase(sessions: MovieSession[]) {
      sessions.forEach((session) => this.upsertBase(session))
    },
    upsertDetails(details: MovieSessionDetails) {
      this.byId[details.id] = { ...this.byId[details.id], ...details }

      this.byMovieId[details.movieId] ||= []
      appendUnique(this.byMovieId[details.movieId], details.id)

      this.byCinemaId[details.cinemaId] ||= []
      appendUnique(this.byCinemaId[details.cinemaId], details.id)
    },

    async ensureMovieSessions(movieId: number, options?: { force?: boolean }) {
      if (!options?.force && this.byMovieId[movieId]?.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<MovieSession[]>(`/api/movies/${movieId}/sessions`)
        this.upsertManyBase(data)
      } catch (error: any) {
        this.error =
          error?.data?.message ?? error?.message ?? 'Не удалось загрузить сеансы фильма'
      } finally {
        this.loading = false
      }
    },
    async ensureCinemaSessions(cinemaId: number, options?: { force?: boolean }) {
      if (!options?.force && this.byCinemaId[cinemaId]?.length) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const data = await $fetch<MovieSession[]>(`/api/cinemas/${cinemaId}/sessions`)
        this.upsertManyBase(data)
      } catch (error: any) {
        this.error =
          error?.data?.message ?? error?.message ?? 'Не удалось загрузить сеансы кинотеатра'
      } finally {
        this.loading = false
      }
    },
    async ensureSessionDetails(sessionId: number, options?: { force?: boolean }) {
      const current = this.byId[sessionId]
      if (!options?.force && current && current.seats && current.bookedSeats) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const details = await $fetch<MovieSessionDetails>(`/api/movieSessions/${sessionId}`)
        this.upsertDetails(details)
      } catch (error: any) {
        this.error =
          error?.data?.message ?? error?.message ?? 'Не удалось загрузить детали сеанса'
      } finally {
        this.loading = false
      }
    },
  },
})

