import { computed } from 'vue'

interface AuthSession {
  authenticated: boolean
}

export const useAuthSession = () => {
  const session = useState<AuthSession | null>('auth-session', () => null)

  const isAuthenticated = computed(() => Boolean(session.value?.authenticated))

  const refreshAuthSession = async () => {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

    try {
      const data = await $fetch<AuthSession>('/api/auth/session', { headers })
      session.value = data
      return data
    } catch (error) {
      session.value = { authenticated: false }
      throw error
    }
  }

  const ensureAuthSession = async () => {
    if (session.value === null) {
      await refreshAuthSession()
    }

    return session.value
  }

  const clearAuthSession = () => {
    session.value = { authenticated: false }
  }

  return {
    session,
    isAuthenticated,
    refreshAuthSession,
    ensureAuthSession,
    clearAuthSession,
  }
}


