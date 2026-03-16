import type { ManagementOperationalContext } from '../model/OperationalContext'

const OPERATIONAL_CONTEXT_ENDPOINT = '/api/management/operational-context'

export class ManagementApiError extends Error {
  readonly statusCode: number

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message)
    this.name = 'ManagementApiError'
    this.statusCode = statusCode
  }
}

export async function fetchOperationalContext(
  authorizationHeader: string,
): Promise<ManagementOperationalContext> {
  let response: Response

  try {
    response = await fetch(OPERATIONAL_CONTEXT_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authorizationHeader,
      },
    })
  } catch {
    throw new ManagementApiError(
      'Cannot reach management domain service. Confirm backend is running on the configured port.',
      0,
    )
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ManagementApiError('You are not authorized to read operational context.', response.status)
    }

    throw new ManagementApiError('Operational context is currently unavailable.', response.status)
  }

  return (await response.json()) as ManagementOperationalContext
}
