import type { MovieSession } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async (event) => {
  const cinemaId = getRouterParam(event, 'cinemaId')
  return await $fetch<MovieSession[]>(getServerUrl(`/cinemas/${cinemaId}/sessions`))
})

