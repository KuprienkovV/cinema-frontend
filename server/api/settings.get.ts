import { getServerUrl } from '~/server/utils/url'
import type { Settings } from '~/types/api'

export default defineEventHandler(async (event) => {
  return await event.$fetch<Settings>(getServerUrl('/settings'))
})

