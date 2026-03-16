import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AuthApiError,
  buildBasicAuthorizationHeader,
  fetchCurrentSession,
} from '../api/authApi'
import {
  hasAnyRole as rolesMatch,
  resolveDefaultRoute,
  type AppRole,
} from '../model/AppRole'
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
  type AuthUser,
  type LoginCredentials,
} from './AuthContext'

const AUTH_STORAGE_KEY = 'nurtura.auth.basic'

function getStoredAuthorizationHeader() {
  return window.sessionStorage.getItem(AUTH_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() =>
    getStoredAuthorizationHeader() ? 'checking' : 'anonymous',
  )
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [authorizationHeader, setAuthorizationHeader] = useState<string | null>(() =>
    getStoredAuthorizationHeader(),
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const establishSession = useCallback((header: string, user: AuthUser) => {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, header)
    setAuthorizationHeader(header)
    setCurrentUser(user)
    setErrorMessage(null)
    setStatus('authenticated')
  }, [])

  const clearSession = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthorizationHeader(null)
    setCurrentUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    if (!authorizationHeader || status !== 'checking') {
      return
    }

    let isCurrent = true

    const restoreSession = async () => {
      try {
        const restoredSession = await fetchCurrentSession(authorizationHeader)

        if (!isCurrent) {
          return
        }

        establishSession(authorizationHeader, {
          username: restoredSession.username,
          roles: restoredSession.roles,
        })
      } catch {
        if (!isCurrent) {
          return
        }

        clearSession()
      }
    }

    void restoreSession()

    return () => {
      isCurrent = false
    }
  }, [authorizationHeader, clearSession, establishSession, status])

  const login = useCallback(
    async ({ username, password }: LoginCredentials) => {
      setStatus('checking')
      setErrorMessage(null)

      try {
        const nextAuthorizationHeader = buildBasicAuthorizationHeader(username, password)
        const session = await fetchCurrentSession(nextAuthorizationHeader)

        establishSession(nextAuthorizationHeader, {
          username: session.username,
          roles: session.roles,
        })
      } catch (error) {
        clearSession()

        if (error instanceof AuthApiError) {
          setErrorMessage(error.message)
          throw error
        }

        const unknownError = new AuthApiError('Unable to sign in.', 500)
        setErrorMessage(unknownError.message)
        throw unknownError
      }
    },
    [clearSession, establishSession],
  )

  const logout = useCallback(() => {
    clearSession()
    setErrorMessage(null)
  }, [clearSession])

  const hasAnyRole = useCallback(
    (requiredRoles: AppRole[]) => {
      if (!currentUser) {
        return false
      }

      return rolesMatch(currentUser.roles, requiredRoles)
    },
    [currentUser],
  )

  const getDefaultRoute = useCallback(() => {
    if (!currentUser) {
      return '/login'
    }

    return resolveDefaultRoute(currentUser.roles)
  }, [currentUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      currentUser,
      errorMessage,
      authorizationHeader,
      login,
      logout,
      hasAnyRole,
      getDefaultRoute,
    }),
    [
      authorizationHeader,
      currentUser,
      errorMessage,
      getDefaultRoute,
      hasAnyRole,
      login,
      logout,
      status,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
