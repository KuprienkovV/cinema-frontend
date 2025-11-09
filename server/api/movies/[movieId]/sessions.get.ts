import type { MovieSession } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async (event) => {
  const movieId = getRouterParam(event, 'movieId')
  return await $fetch<MovieSession[]>(getServerUrl(`/movies/${movieId}/sessions`))
})

