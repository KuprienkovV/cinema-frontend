export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')
  return { authenticated: Boolean(token) }
})

