import type { H3Event } from 'h3'

export function authHeaders(event: H3Event): Record<string, string> {
  const token = getCookie(event, 'token')
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

