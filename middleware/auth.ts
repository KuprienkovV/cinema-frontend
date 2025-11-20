export default defineNuxtRouteMiddleware(async (to) => {
  const redirectToLogin = () =>
    navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })

  const session = useState<{ authenticated: boolean }>('auth-session')

  if (session.value === undefined) {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const data = await $fetch<{ authenticated: boolean }>('/api/auth/session', { headers })
      session.value = data
    } catch {
      session.value = { authenticated: false }
    }
  }

  if (!session.value?.authenticated) {
    return redirectToLogin()
  }
})