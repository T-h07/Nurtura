import type {
  ChildDetails,
  ChildGuardianContact,
  ChildGuardianLinkUpsertPayload,
  ChildSummary,
  ChildUpsertPayload,
  GuardianSummary,
  GuardianUpsertPayload,
} from '../model/Children'

const CHILDREN_ENDPOINT = '/api/management/children'
const GUARDIANS_ENDPOINT = '/api/management/guardians'

export class ChildrenApiError extends Error {
  readonly statusCode: number

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message)
    this.name = 'ChildrenApiError'
    this.statusCode = statusCode
  }
}

async function requestJson<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT',
  authorizationHeader: string,
  body?: unknown,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorizationHeader,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ChildrenApiError(
      'Cannot reach child management service. Confirm backend is running and reachable.',
      0,
    )
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ChildrenApiError('You are not authorized for child management operations.', response.status)
    }

    if (response.status === 404) {
      throw new ChildrenApiError('Requested child or guardian record was not found.', response.status)
    }

    if (response.status === 400 || response.status === 422) {
      throw new ChildrenApiError('Submitted child or guardian data is invalid.', response.status)
    }

    throw new ChildrenApiError('Child management service is currently unavailable.', response.status)
  }

  return (await response.json()) as T
}

export function fetchChildren(authorizationHeader: string): Promise<ChildSummary[]> {
  return requestJson<ChildSummary[]>(CHILDREN_ENDPOINT, 'GET', authorizationHeader)
}

export function fetchChildDetails(
  authorizationHeader: string,
  childId: string,
): Promise<ChildDetails> {
  return requestJson<ChildDetails>(`${CHILDREN_ENDPOINT}/${childId}`, 'GET', authorizationHeader)
}

export function createChild(
  authorizationHeader: string,
  payload: ChildUpsertPayload,
): Promise<ChildDetails> {
  return requestJson<ChildDetails>(CHILDREN_ENDPOINT, 'POST', authorizationHeader, payload)
}

export function updateChild(
  authorizationHeader: string,
  childId: string,
  payload: ChildUpsertPayload,
): Promise<ChildDetails> {
  return requestJson<ChildDetails>(`${CHILDREN_ENDPOINT}/${childId}`, 'PUT', authorizationHeader, payload)
}

export function fetchGuardians(authorizationHeader: string): Promise<GuardianSummary[]> {
  return requestJson<GuardianSummary[]>(GUARDIANS_ENDPOINT, 'GET', authorizationHeader)
}

export function createGuardian(
  authorizationHeader: string,
  payload: GuardianUpsertPayload,
): Promise<GuardianSummary> {
  return requestJson<GuardianSummary>(GUARDIANS_ENDPOINT, 'POST', authorizationHeader, payload)
}

export function updateGuardian(
  authorizationHeader: string,
  guardianId: string,
  payload: GuardianUpsertPayload,
): Promise<GuardianSummary> {
  return requestJson<GuardianSummary>(
    `${GUARDIANS_ENDPOINT}/${guardianId}`,
    'PUT',
    authorizationHeader,
    payload,
  )
}

export function fetchGuardiansForChild(
  authorizationHeader: string,
  childId: string,
): Promise<ChildGuardianContact[]> {
  return requestJson<ChildGuardianContact[]>(
    `${CHILDREN_ENDPOINT}/${childId}/guardians`,
    'GET',
    authorizationHeader,
  )
}

export function linkGuardianToChild(
  authorizationHeader: string,
  childId: string,
  guardianId: string,
  payload: ChildGuardianLinkUpsertPayload,
): Promise<ChildGuardianContact> {
  return requestJson<ChildGuardianContact>(
    `${CHILDREN_ENDPOINT}/${childId}/guardians/${guardianId}`,
    'PUT',
    authorizationHeader,
    payload,
  )
}
