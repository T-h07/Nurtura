export const APP_ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  MANAGEMENT: 'MANAGEMENT',
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
} as const

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES]

export const MANAGEMENT_SURFACE_ROLES: AppRole[] = [
  APP_ROLES.PLATFORM_ADMIN,
  APP_ROLES.MANAGEMENT,
]

export const CLASSROOM_SURFACE_ROLES: AppRole[] = [
  APP_ROLES.PLATFORM_ADMIN,
  APP_ROLES.TEACHER,
]

export const ACTIVE_PRODUCT_ROLES: AppRole[] = [
  APP_ROLES.PLATFORM_ADMIN,
  APP_ROLES.MANAGEMENT,
  APP_ROLES.TEACHER,
]

const knownRoles = new Set<AppRole>(Object.values(APP_ROLES))

export function parseAppRoles(roleCodes: string[]): AppRole[] {
  return roleCodes.filter((roleCode): roleCode is AppRole => knownRoles.has(roleCode as AppRole))
}

export function hasAnyRole(userRoles: AppRole[], requiredRoles: AppRole[]): boolean {
  return requiredRoles.some((requiredRole) => userRoles.includes(requiredRole))
}

export function resolveDefaultRoute(userRoles: AppRole[]): string {
  if (hasAnyRole(userRoles, MANAGEMENT_SURFACE_ROLES)) {
    return '/app/management/overview'
  }

  if (hasAnyRole(userRoles, CLASSROOM_SURFACE_ROLES)) {
    return '/app/classroom/overview'
  }

  return '/app/unsupported'
}

export function hasActiveProductRole(userRoles: AppRole[]): boolean {
  return hasAnyRole(userRoles, ACTIVE_PRODUCT_ROLES)
}
