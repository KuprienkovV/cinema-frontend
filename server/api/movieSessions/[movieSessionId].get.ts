import type { MovieSessionDetails } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async (event) => {
  const movieSessionId = getRouterParam(event, 'movieSessionId')
  return await event.$fetch<MovieSessionDetails>(getServerUrl(`/movieSessions/${movieSessionId}`))
})

