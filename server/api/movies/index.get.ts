import type { Movie } from '~/types/api';
import { getServerUrl } from '~/server/utils/url'


export default defineEventHandler(async (event) => {
  return await $fetch<Movie[]>(getServerUrl('/movies'))
})