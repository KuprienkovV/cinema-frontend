import type { Cinema } from '~/types/api'
import { getServerUrl } from '~/server/utils/url'

export default defineEventHandler(async (event) => {
  return await event.$fetch<Cinema[]>(getServerUrl('/cinemas'))
})

