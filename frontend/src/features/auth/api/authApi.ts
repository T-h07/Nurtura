import { parseAppRoles, type AppRole } from '../model/AppRole'

const SESSION_ENDPOINT = '/api/auth/me'

interface AuthSessionPayload {
  username: string
  roles: string[]
}

export interface AuthSession {
  username: string
  roles: AppRole[]
}

export class AuthApiError extends Error {
  readonly statusCode: number

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message)
    this.name = 'AuthApiError'
    this.statusCode = statusCode
  }
}

export function buildBasicAuthorizationHeader(username: string, password: string): string {
  return `Basic ${window.btoa(`${username}:${password}`)}`
}

export async function fetchCurrentSession(authorizationHeader: string): Promise<AuthSession> {
  let response: Response

  try {
    response = await fetch(SESSION_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authorizationHeader,
      },
    })
  } catch {
    throw new AuthApiError(
      'Cannot reach backend authentication service. Confirm backend is running on the configured port.',
      0,
    )
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AuthApiError('Invalid credentials.', response.status)
    }

    if (response.status === 404) {
      throw new AuthApiError(
        'Authentication endpoint was not found. Check backend port and frontend proxy configuration.',
        response.status,
      )
    }

    throw new AuthApiError('Authentication service is unavailable.', response.status)
  }

  const payload = (await response.json()) as AuthSessionPayload

  return {
    username: payload.username,
    roles: parseAppRoles(payload.roles),
  }
}
