import { createError, getRouterParam } from 'h3'
import { getServerUrl } from '~/server/utils/url'
import { authHeaders } from '~/server/utils/auth'
import type { BookingPaymentResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  const bookingId = getRouterParam(event, 'bookingId')

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Booking id is required',
    })
  }

  return await event.$fetch<BookingPaymentResponse>(
    getServerUrl(`/bookings/${bookingId}/payments`),
    {
      method: 'POST',
      headers: authHeaders(event),
    }
  )
})

