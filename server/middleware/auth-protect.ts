export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/secure/')) {
    const token = getCookie(event, 'token')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentication required',
      })
    }
  }
})

