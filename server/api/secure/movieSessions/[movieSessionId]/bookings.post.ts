import { authHeaders } from '~/server/utils/auth'
import { getServerUrl } from '~/server/utils/url'
import type { BookingCreateResponse, Seat } from '~/types/api'

export default defineEventHandler(async (event) => {
  const movieSessionId = getRouterParam(event, 'movieSessionId')
  const body = await readBody<{ seats: Seat[] }>(event)
  const endpoint = getServerUrl(`/movieSessions/${movieSessionId}/bookings`)

  return await event.$fetch<BookingCreateResponse>(endpoint as unknown as string, {
    method: 'POST',
    body,
    headers: authHeaders(event),
  })
})

