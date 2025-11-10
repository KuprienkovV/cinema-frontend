import type { Movie } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async (event) => {
  return await event.$fetch<Movie[]>(getServerUrl('/movies'))
})