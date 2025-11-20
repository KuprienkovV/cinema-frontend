export default defineNuxtRouteMiddleware(async () => {
  const { refreshAuthSession } = useAuthSession()

  await refreshAuthSession()
})

