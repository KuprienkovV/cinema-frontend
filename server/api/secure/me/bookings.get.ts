import { getServerUrl } from '~/server/utils/url'
import { authHeaders } from '~/server/utils/auth'
import type { Booking } from '~/types/api'

export default defineEventHandler(async (event) => {
  return await event.$fetch<Booking[]>(getServerUrl('/me/bookings'), {
    headers: authHeaders(event),
  })
})

