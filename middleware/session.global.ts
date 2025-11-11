export default defineNuxtRouteMiddleware(async () => {
  const session = useState<{ authenticated: boolean }>('auth-session', () => ({
    authenticated: false,
  }))

  try {
    const headers = process.server ? useRequestHeaders(['cookie']) : undefined
    const data = await $fetch<{ authenticated: boolean }>('/api/auth/session', {
      headers,
    })
    session.value = data
  } catch {
    session.value = { authenticated: false }
  }
})

