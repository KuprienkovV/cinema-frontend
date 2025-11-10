import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)
  const { public: { apiBase } } = useRuntimeConfig(event)

  const response = await event.$fetch<{ token: string }>(`${apiBase}/login`, {
    method: 'POST',
    body,
  })

  setCookie(event, 'token', response.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return { ok: true }
})

