import { authHeaders } from '~/server/utils/auth'
import { getServerUrl } from '~/server/utils/url'
import type { Seat } from '~/types/api'

export default defineEventHandler(async (event) => {
  const movieSessionId = getRouterParam(event, 'movieSessionId')
  const body = await readBody<{ seats: Seat[] }>(event)

  return await event.$fetch(getServerUrl(`/movieSessions/${movieSessionId}/bookings`), {
    method: 'POST',
    body,
    headers: authHeaders(event),
  })
})

