import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

mockNuxtImport('useRequestHeaders', () => () => ({}))

Object.defineProperty(import.meta, 'server', {
  value: false,
  writable: true,
})

describe('useAuthSession', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('clearAuthSession устанавливает authenticated в false', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, clearAuthSession } = useAuthSession()

    session.value = { authenticated: true }

    clearAuthSession()

    expect(session.value).toEqual({ authenticated: false })
  })

  it('isAuthenticated возвращает true когда session.authenticated === true', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, isAuthenticated } = useAuthSession()

    session.value = { authenticated: true }

    expect(isAuthenticated.value).toBe(true)
  })

  it('isAuthenticated возвращает false когда session.authenticated === false', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, isAuthenticated } = useAuthSession()

    session.value = { authenticated: false }

    expect(isAuthenticated.value).toBe(false)
  })

  it('isAuthenticated возвращает false когда session === null', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, isAuthenticated } = useAuthSession()

    session.value = null

    expect(isAuthenticated.value).toBe(false)
  })

  it('refreshAuthSession успешно обновляет сессию', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, refreshAuthSession } = useAuthSession()

    mockFetch.mockResolvedValue({ authenticated: true })

    await refreshAuthSession()

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/session', { headers: undefined })
    expect(session.value).toEqual({ authenticated: true })
  })

  it('refreshAuthSession устанавливает authenticated: false при ошибке', async () => {
    const { useAuthSession } = await import('~/composables/useAuthSession')
    const { session, refreshAuthSession } = useAuthSession()

    session.value = { authenticated: true }
    mockFetch.mockRejectedValue(new Error('Network error'))

    await expect(refreshAuthSession()).rejects.toThrow('Network error')
    expect(session.value).toEqual({ authenticated: false })
  })
})

