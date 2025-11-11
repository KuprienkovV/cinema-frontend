import { defineStore } from 'pinia'
import type { Booking, BookingPaymentResponse } from '~/types/api'

interface BookingsState {
  bookings: Booking[]
  loading: boolean
  error: unknown | null
}

export const useBookingsStore = defineStore('bookings', {
  state: (): BookingsState => ({
    bookings: [],
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (bookingId: string) =>
      state.bookings.find((booking) => booking.id === bookingId),
  },
  actions: {
    setBookings(bookings: Booking[]) {
      this.bookings = bookings
    },
    removeBookingLocal(bookingId: string) {
      this.bookings = this.bookings.filter((booking) => booking.id !== bookingId)
    },
    updateBookingLocal(bookingId: string, updater: (booking: Booking) => Booking) {
      this.bookings = this.bookings.map((booking) =>
        booking.id === bookingId ? updater(booking) : booking
      )
    },
    async fetchBookings(options?: { force?: boolean }) {
      if (!options?.force && this.bookings.length) {
        return this.bookings
      }

      this.loading = true
      this.error = null

      try {
        const data = await $fetch<Booking[]>('/api/secure/me/bookings')
        this.bookings = data
        return data
      } catch (error: any) {
        this.error = error?.data?.message ?? error?.message ?? 'Не удалось загрузить бронирования'
        throw error
      } finally {
        this.loading = false
      }
    },
    async refreshBookings() {
      return await this.fetchBookings({ force: true })
    },
    async payBooking(bookingId: string) {
      const response = await $fetch<BookingPaymentResponse>(
        `/api/secure/bookings/${bookingId}/payments`,
        { method: 'POST' }
      )
      await this.refreshBookings()
      return response
    },
  },
})

