export default defineNuxtRouteMiddleware(async (to) => {
  const redirectToLogin = () =>
    navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })

  if (process.server) {
    const token = useCookie('token')
    if (!token.value) {
      return redirectToLogin()
    }
    return
  }

  try {
    const { authenticated } = await $fetch<{ authenticated: boolean }>('/api/auth/session')
    if (!authenticated) {
      return redirectToLogin()
    }
  } catch {
    return redirectToLogin()
  }
})