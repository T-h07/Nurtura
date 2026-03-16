import { createContext } from 'react'
import type { AppRole } from '../model/AppRole'

export type AuthStatus = 'checking' | 'anonymous' | 'authenticated'

export interface AuthUser {
  username: string
  roles: AppRole[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthContextValue {
  status: AuthStatus
  currentUser: AuthUser | null
  errorMessage: string | null
  authorizationHeader: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hasAnyRole: (requiredRoles: AppRole[]) => boolean
  getDefaultRoute: () => string
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
