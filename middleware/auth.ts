export default defineNuxtRouteMiddleware(async (to) => {
  const redirectToLogin = () =>
    navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })

  const { isAuthenticated, ensureAuthSession } = useAuthSession()

  await ensureAuthSession()

  if (!isAuthenticated.value) {
    return redirectToLogin()
  }
})