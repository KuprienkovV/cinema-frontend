import type { Cinema } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async () => {
  return await $fetch<Cinema[]>(getServerUrl('/cinemas'))
})

